/**
 * Bridge entre la app y el módulo tracker-agent (InteractionLab).
 * No requiere modificar tracker-agent.js.
 *
 * La app solo debería usar:
 *   - startExperiment(studentId)                tras el login
 *   - setupSceneTracking(sceneId, elements)     al montar cada ejercicio
 *   - finishSubsceneTracking()                  al terminar cada ejercicio
 *   - endSession(loginUrl)                      en el logout
 *
 * Cómo se aísla el sessionId por cuenta sin tocar el tracker:
 *   tracker-agent guarda su sessionId en localStorage con la clave
 *   `user_<idExperiment>` (sin nada de la cuenta) y lo calcula al EVALUAR el módulo.
 *   Por eso el bridge (1) recuerda qué cuenta lo creó, (2) borra esa clave si entra
 *   otra cuenta, y (3) importa el módulo de forma dinámica DESPUÉS de hacerlo.
 *   Las claves se localizan por patrón, así que no hay que copiar el idExperiment.
 */

import localTimestamp from "./utils/localTimestamp";

export const COMPONENT_TEXT_FIELD = 1;
export const COMPONENT_COMBOBOX = 2;
export const COMPONENT_OPTION = 3;
export const COMPONENT_RADIO_BUTTON = 4;
export const COMPONENT_CHECK_BOX = 5;

const ACCOUNT_KEY = "tracker_account";        // cuenta que creó el sessionId actual
const SESSION_KEY_PATTERN = /^user_\d+$/;     // clave de tracker-agent: user_<idExperiment>
const STUDENT_ID_FIELD = 6;                   // id del dato demográfico (numérico)
const LOGOUT_FALLBACK_MS = 15000;

// Desactivación limpia (desarrollo, tests). Con Vite: VITE_TRACKING=off
const ENABLED = !(
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_TRACKING === "off"
);

let tracker = null;
let activeScene = null;
let starting = null;
let html2CanvasLoad = null;

function installLazyHtml2Canvas() {
    if (typeof window.html2canvas === "function") return;

    window.html2canvas = (...args) => {
        if (!html2CanvasLoad) {
            html2CanvasLoad = new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = `${process.env.PUBLIC_URL || ""}/html2canvas.js`;
                script.async = true;
                script.onload = () => {
                    if (typeof window.html2canvas !== "function") {
                        html2CanvasLoad = null;
                        reject(new Error("html2canvas did not expose its API"));
                        return;
                    }
                    resolve(window.html2canvas);
                };
                script.onerror = () => {
                    html2CanvasLoad = null;
                    reject(new Error("Failed to load html2canvas"));
                };
                document.head.appendChild(script);
            });
        }

        return html2CanvasLoad.then(
            (html2canvas) => html2canvas(...args),
            (error) => {
                html2CanvasLoad = null;
                throw error;
            }
        );
    };
}

// Serializa las operaciones de escena: evita carreras con StrictMode,
// efectos que se desmontan y montan, dobles clics, etc.
let queue = Promise.resolve();
const enqueue = (task) => {
    const run = queue.then(task);
    queue = run.catch(() => {});
    return run;
};

/* -------------------------------------------------------------------------- */
/* Utilidades                                                                  */
/* -------------------------------------------------------------------------- */

/** Borra el/los sessionId que tracker-agent guardó en localStorage. */
function clearSessionIds() {
    Object.keys(localStorage)
        .filter((key) => SESSION_KEY_PATTERN.test(key))
        .forEach((key) => localStorage.removeItem(key));
}

/**
 * Genera el id de escena. Llámalo UNA vez por escena y reutiliza el resultado,
 * porque el timestamp cambia en cada llamada.
 */
export function buildSceneId(trainingMode, exercise, phase) {
    const ts = new Date(localTimestamp()).toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const safe = (s) => String(s ?? "").replace(/[^\w-]+/g, "_");
    return `${ts}_${safe(trainingMode)}_${safe(exercise.title)}_${safe(exercise.representation)}_${safe(exercise.networkType)}.${phase}`;
}

/**
 * Id de escena para actividades que no son un ejercicio (pretraining, etc.).
 * Ej.: buildActivitySceneId("phrases", "1-3") -> "20261106142500_phrases.1-3"
 */
export function buildActivitySceneId(name, phase) {
    const ts = new Date(localTimestamp()).toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const safe = (s) => String(s ?? "").replace(/[^\w-]+/g, "_");
    return `${ts}_${safe(name)}.${safe(phase)}`;
}

/** Coordenadas de página (no de viewport): el tracker usa pageX/pageY. */
function getPageRect(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        xF: rect.right + window.scrollX,
        yF: rect.bottom + window.scrollY,
    };
}

/** Espera a que el navegador haya pintado el DOM actual. */
export function waitForDomPaint() {
    return new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
}

async function registerDomElement(sceneId, id, typeId = COMPONENT_TEXT_FIELD) {
    // Se exige id: el tracker usa getElementById para los listeners
    // y event.target.id para focus/blur/selección.
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`[tracker] elemento no encontrado: ${id}`);
        return;
    }
    const { x, y, xF, yF } = getPageRect(el);
    await tracker.registerComponent(sceneId, id, x, y, xF, yF, typeId, null);
}

/* -------------------------------------------------------------------------- */
/* API pública                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Llamar tras el login.
 * @param {string|number} accountId  Id interno del alumno (no el email). Identifica
 *                                   qué cuenta es dueña del sessionId.
 * @param {string|number|null} [studentId]  Valor del dato demográfico numérico.
 *        Por defecto es el propio accountId; pasa null para no enviarlo.
 */
export async function startExperiment(accountId, studentId = accountId) {
    if (!ENABLED) return;
    if (tracker) return starting;             // ya iniciado: no repetir

    starting = (async () => {
        // ANTES del import: tracker-agent fija `user` al evaluarse.
        if (localStorage.getItem(ACCOUNT_KEY) !== String(accountId)) {
            clearSessionIds();                // otra cuenta: sessionId nuevo
            localStorage.setItem(ACCOUNT_KEY, String(accountId));
        }
        installLazyHtml2Canvas();
        tracker = await import("./tracker-agent");
        await tracker.startExperiment();
        if (studentId !== undefined && studentId !== null) {
            await tracker.postNumberDD(STUDENT_ID_FIELD, studentId);
        }
    })();

    try {
        await starting;
    } catch (error) {
        tracker = null;                       // permite reintentar
        starting = null;
        throw error;
    }
}

/** ¿Hay una sesión de tracking iniciada en esta carga de la página? */
export const isTrackingActive = () => tracker !== null;

/**
 * Reanuda la sesión tras recargar la página con el alumno ya logueado.
 * Usa la cuenta guardada por startExperiment; no vuelve a enviar el dato demográfico.
 */
export async function resumeExperiment() {
    const accountId = localStorage.getItem(ACCOUNT_KEY);
    if (accountId && !tracker) await startExperiment(accountId, null);
}

/**
 * Abre una escena. Si había otra activa, la cierra antes.
 * @param {string} sceneId
 * @param {Array<string | {id: string, type?: number}>} elements
 *        Ids de los elementos interactivos. Usa {id, type} para combobox,
 *        radios, checkboxes, etc.
 */
export function setupSceneTracking(sceneId, elements = []) {
    return enqueue(() => openScene(sceneId, elements));
}

async function openScene(sceneId, elements) {
    if (!ENABLED) return;
    if (!tracker) await resumeExperiment();   // recarga de página con la sesión abierta
    if (!tracker) return;

    if (activeScene) await closeScene();
    await waitForDomPaint();

    // Primero initTracking: los listeners de focus/blur/selección usan
    // el AbortController que crea esta llamada.
    await tracker.initTracking(sceneId);
    activeScene = sceneId;

    await Promise.all(
        elements.map((e) => {
            const { id, type } = typeof e === "string" ? { id: e } : e;
            return registerDomElement(sceneId, id, type);
        })
    );
}

/**
 * Cierra la escena activa. Llamar ANTES de cambiar el DOM:
 * el tracker toma el screenshot de fondo al cerrar.
 * No hace nada si no hay escena activa.
 */
export function finishSubsceneTracking() {
    return enqueue(closeScene);
}

async function closeScene() {
    if (!ENABLED || !tracker || !activeScene) return;
    activeScene = null;
    await tracker.finishSubsceneTracking();
}

/**
 * Cierra la sesión: termina la escena activa, marca el experimento como
 * finalizado (el tracker borra su sessionId) y navega a loginUrl con recarga completa.
 * No lo sustituyas por una navegación del router: la recarga es la que
 * reinicia el estado del módulo tracker-agent.
 */
export async function endSession(loginUrl = "/login") {
    if (!ENABLED || !tracker) {
        window.location.href = loginUrl;
        return;
    }

    try {
        await finishSubsceneTracking();
        tracker.finishExperiment();

        // Fallback por si checkReadyToLeave nunca llega a navegar
        // (p. ej. login y logout sin ninguna escena entre medias).
        setTimeout(() => {
            clearSessionIds();
            window.location.href = loginUrl;
        }, LOGOUT_FALLBACK_MS);

        await tracker.finishTracking(loginUrl);
    } catch (error) {
        console.error("[tracker] error al cerrar la sesión:", error);
        window.location.href = loginUrl;
    }
}