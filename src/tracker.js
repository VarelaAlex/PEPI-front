/**
 * Bridge to the InteractionLab tracker loaded globally from public/tracker-*.js
 */

export const COMPONENT_TEXT_FIELD = 1;
export const COMPONENT_COMBOBOX = 2;
export const COMPONENT_OPTION = 3;
export const COMPONENT_RADIO_BUTTON = 4;
export const COMPONENT_CHECK_BOX = 5;

function callTracker(fnName, ...args) {
    const fn = window[fnName];
    if (typeof fn !== 'function') {
        console.warn(`Tracker: ${fnName} is not available`);
        return undefined;
    }
    return fn(...args);
}

export function buildSceneId(exercise, phase) {
    return `${exercise.title}_${exercise.representation}_${exercise.networkType}.${phase}`;
}

function getPageRect(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        xF: rect.right + window.scrollX,
        yF: rect.bottom + window.scrollY,
    };
}

export async function waitForDomPaint() {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

export async function registerDomElement(sceneId, element, typeId = COMPONENT_TEXT_FIELD) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (!el) return;

    const componentId = el.id || el.getAttribute('data-track-id');
    if (!componentId) return;

    const { x, y, xF, yF } = getPageRect(el);
    await callTracker('registerComponent', sceneId, componentId, x, y, xF, yF, typeId, null);
}

export async function registerSceneElements(sceneId, elementIds, typeId = COMPONENT_TEXT_FIELD) {
    await waitForDomPaint();
    await Promise.all(elementIds.map((id) => registerDomElement(sceneId, id, typeId)));
}

export async function startExperiment() {
    await callTracker('startExperiment');
}

export function finishExperiment() {
    callTracker('finishExperiment');
}

export async function initTracking(sceneId) {
    await callTracker('initTracking', sceneId);
}

export async function finishSubsceneTracking() {
    await callTracker('finishSubsceneTracking');
}

export async function registerStudentId(value) {
    await callTracker('postNumberDD', 6, value);
}

export async function setupSceneTracking(sceneId, elementIds) {
    await registerSceneElements(sceneId, elementIds);
    await initTracking(sceneId);
}
