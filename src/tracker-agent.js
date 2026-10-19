/**
 * Contains the global configuration and state of the tracking system.
 */
const VERSION = 8;

const EVENT_ON_MOUSE_MOVE = 0;
const EVENT_ON_CLICK = 1;
const EVENT_ON_DOUBLE_CLICK = 2;
const EVENT_ON_MOUSE_DOWN = 3;
const EVENT_ON_MOUSE_UP = 4;
const EVENT_ON_WHEEL = 5;
const EVENT_CONTEXT_MENU = 6;
const EVENT_POINTER_MOVE = 7;
const EVENT_POINTER_DOWN = 8;
const EVENT_POINTER_UP = 9;
const EVENT_POINTER_CANCEL = 10;
const EVENT_WINDOW_SCROLL = 11;
const EVENT_WINDOW_RESIZE = 12;
const EVENT_KEY_DOWN = 13;
const EVENT_KEY_PRESS = 14;
const EVENT_KEY_UP = 15;
const EVENT_FOCUS = 16;
const EVENT_BLUR = 17;
const EVENT_ON_CHANGE_SELECTION_OBJECT = 18;
const EVENT_ON_CLICK_SELECTION_OBJECT = 19;
const EVENT_GAZE = 20;
const EVENT_INIT_TRACKING = 100;
const EVENT_TRACKING_END = 200;

const COMPONENT_TEXT_FIELD = 1;
const COMPONENT_COMBOBOX = 2;
const COMPONENT_OPTION = 3;
const COMPONENT_RADIO_BUTTON = 4;
const COMPONENT_CHECK_BOX = 5;

const idExperiment = 4;

/**
 * localStorage key for this experiment's session ID, scoped per experiment.
 */
function getUserStorageKey() {
    return "user_" + idExperiment;
}

/**
 * Returns the persistent session user ID, creating one if it does not exist.
 */
function createUser() {
    const key = getUserStorageKey();
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, crypto.randomUUID());
    }
    return localStorage.getItem(key);
}

const user = createUser();

let list = [];
let sceneId = 0;
let eventCounter = 0;
let trackingOn = false;
let sentRequest = 0;
let pendingRequest = 0;
let pendingBackgroundsDelivered = 0;
let backgroundsDelivered = 0;
let eventsDelivered = false;
let finishedExperiment = false;
let leftPage = false;
let newPage = null;
let emittingData = false;
let recordBackground = true;
let trackingAbortController = null;
let sceneEnd = null;
let gazeTrackingEnabled = false;
let gazeSampleIntervalMs = 200;
let lastGazeSampleTs = 0;
let gazeStarted = false;
let lastPointerType = 'mouse';
/** Last sample of every active touch/pen pointer, by pointerId. */
const pointerSamples = new Map();
/** Touch pointers the browser cancelled to scroll or zoom, by pointerId, followed through touch events. */
const cancelledTouches = new Map();
/** pointerId of every touch, by touch identifier. */
const touchPointers = new Map();

const elements = [];
const TOP_LIMIT = 50;
const urlBase = "https:\/\/156-35-163-141.nip.io";
const url = urlBase + '/TrackerServer/restws/track';
const urlBackgroundTracker = urlBase + '/TrackerServer/restws/backgroundTracker';
const urlRegisterComponent = urlBase + '/TrackerServer/restws/registerComponent';
const urlRegisterUserData = urlBase + '/TrackerServer/restws/registerUserData';
const urlDemographicData = urlBase + '/TrackerServer/restws/registerDemographicData';
const urlExperimentStatus = urlBase + '/TrackerServer/restws/experiment/status/' + idExperiment;
const urlBackgroundRecording = urlBase + '/TrackerServer/restws/experiment/backgroundRecording/' + idExperiment;
const urlEyeTrackingEnabled = urlBase + '/TrackerServer/restws/experiment/eyeTrackingEnabled/' + idExperiment;

/**
 * Auxiliary and helper functions for the entire tracking system.
 */

/**
 * Sends a POST request with a JSON body and returns the response as text.
 * @param {string} url Endpoint URL.
 * @param {object} data Object to serialize as JSON body.
 * @param {{keepalive?: boolean}} [options] keepalive lets the request outlive the page.
 * @returns {Promise<string>} Response body text.
 * @throws {Error} If the response status is not OK.
 */
async function postJSON(url, data, options = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: options.keepalive === true
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.text();
}

/**
 * Sends a GET request with query parameters and returns the response as text.
 * @param {string} url Endpoint URL (without query string).
 * @param {object} params Key-value pairs appended as query parameters.
 * @returns {Promise<string>} Response body text.
 * @throws {Error} If the response status is not OK.
 */
async function getWithParams(url, params) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(url + '?' + query);
    if (!response.ok) throw new Error(response.statusText);
    return response.text();
}

/**
 * Returns the local UTC offset in hours (positive = east of UTC).
 * @returns {number} Timezone offset in hours.
 */
function getTimezone() {
    return (new Date()).getTimezoneOffset() / 60 * (-1);
}

/**
 * Initializes a user session: checks experiment status, fetches background recording
 * setting, and registers browser/device metadata with the tracker server.
 * Must be called once before any tracking begins.
 * @returns {Promise<void>}
 */
export async function startExperiment() {
    console.log("Creating user session " + user);
    await getExperimentStatus();
    await getBackgroundRecordingStatus();
    await getEyeTrackingEnabledStatus();
    await registerUserData();
}

/**
 * Marks the whole experiment as finished so the participant's session ID is removed
 * from localStorage once the current page's pending requests complete, preventing it
 * from being reused on a future visit. Also releases the webcam/model if gaze
 * tracking was running, since no further scenes will request it.
 *
 * This is separate from finishTracking()/finishSubsceneTracking() (in
 * tracker-events.js), which only end tracking for the current scene. In a
 * multi-page/multi-scene experiment, call finishTracking() on every scene change, but
 * call finishExperiment() exactly once, on the truly last page, otherwise the
 * session ID is never cleaned up.
 */
export function finishExperiment() {
    finishedExperiment = true;
    if (gazeTrackingEnabled && typeof webgazer !== 'undefined') { webgazer.end(); }
}

/**
 * Fetches the background recording setting for the current experiment and updates
 * the global recordBackground flag. Silently ignores network errors.
 * @returns {Promise<void>}
 */
async function getBackgroundRecordingStatus() {
    try {
        const response = await fetch(urlBackgroundRecording);
        if (!response.ok) return;
        const text = await response.text();
        recordBackground = (text.trim() === 'true');
    } catch {
        // If check fails, recordBackground remains true
    }
}

/**
 * Captures a screenshot of the current page via html2canvas and delivers it to the
 * tracker server associated with the given scene. Normalizes the canvas to CSS pixel
 * dimensions on HiDPI screens so coordinates match event positions.
 * Does nothing if tracking is not emitting or background recording is disabled.
 * @param {number} sceneId ID of the scene being captured.
 * @returns {Promise<void>}
 */
async function takeSnapshot(sceneId) {
    if (!emittingData || !recordBackground) return;
    try {
        const dpr = window.devicePixelRatio || 1;
        const rawCanvas = await html2canvas(document.body, { scale: 1 });

        // html2canvas may render at physical pixels even with scale:1 on HiDPI screens.
        // Normalize to CSS pixel dimensions so coordinates match event.pageX/pageY.
        const cssWidth = Math.round(rawCanvas.width / dpr);
        const cssHeight = Math.round(rawCanvas.height / dpr);
        let finalCanvas = rawCanvas;
        if (rawCanvas.width !== cssWidth || rawCanvas.height !== cssHeight) {
            finalCanvas = document.createElement('canvas');
            finalCanvas.width = cssWidth;
            finalCanvas.height = cssHeight;
            finalCanvas.getContext('2d').drawImage(rawCanvas, 0, 0, cssWidth, cssHeight);
        }

        console.log("Delivering background for scene " + sceneId);
        await deliverSnapshot(sceneId, finalCanvas);
    } catch (error) {
        console.log("Error taking snapshot: " + error.message);
    }
}

/**
 * Uploads a canvas snapshot as a PNG data URL to the background tracker endpoint.
 * Does nothing if tracking is not emitting.
 * @param {number} sceneId ID of the scene the snapshot belongs to.
 * @param {HTMLCanvasElement} canvas Canvas element to upload.
 * @returns {Promise<void>}
 */
async function deliverSnapshot(sceneId, canvas) {
    if (!emittingData) return;

    const parametros = {
        "timezone": getTimezone(),
        "experiment": idExperiment,
        "sceneId": sceneId,
        "canvas": canvas.toDataURL("image/png"),
        "timeStamp": Date.now(),
        "sessionId": user
    };

    pendingBackgroundsDelivered++;
    console.log("Sending background. Pending backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);

    try {
        const responseText = await postJSON(urlBackgroundTracker, parametros);
        backgroundsDelivered++;
        console.log('Result: ' + responseText);
    } catch (error) {
        console.error("Error delivering snapshot: " + error.message);
    } finally {
        pendingBackgroundsDelivered--;
        console.log("Call completed. Pending Backgrounds: " + pendingBackgroundsDelivered + "/" + backgroundsDelivered);
    }
}

/**
 * Detects browser name and version from the User-Agent string.
 * @param {string} ua navigator.userAgent string.
 * @returns {{browserName: string, browserVersion1b: string}}
 */
function detectBrowser(ua) {
    const patterns = [
        ['Edge', /Edg(?:e|A|iOS)?\/([\d.]+)/],
        ['Samsung Internet', /SamsungBrowser\/([\d.]+)/],
        ['Opera', /(?:OPR|OPiOS|Opera)\/([\d.]+)/],
        ['Firefox', /(?:Firefox|FxiOS)\/([\d.]+)/],
        ['Chrome', /(?:Chrome|CriOS)\/([\d.]+)/],
        ['Safari', /Version\/([\d.]+).*Safari/],
    ];
    for (const [browserName, regex] of patterns) {
        const match = ua.match(regex);
        if (match) return { browserName, browserVersion1b: match[1] };
    }
    return { browserName: 'Unknown', browserVersion1b: 'Unknown' };
}

/**
 * Collects and sends browser, device, and screen metadata for the current session
 * to the tracker server. Does nothing if tracking is not emitting.
 * @returns {Promise<void>}
 */
async function registerUserData() {
    if (!emittingData) return;

    const ua = navigator.userAgent;

    let browserEngine = "Unknown";
    if (ua.includes("Gecko/")) browserEngine = "Gecko";
    else if (ua.includes("AppleWebKit/")) browserEngine = "Blink/WebKit";

    const { browserName, browserVersion1b } = detectBrowser(ua);

    const parametros = {
        "timezone": getTimezone(),
        "timeOpened": new Date(),
        "pageon": window.location.pathname,
        "referrer": document.referrer,
        "previousSites": history.length,
        "browserVersion1a": ua,
        "browserVersion1b": browserVersion1b,
        "browserName": browserName,
        "browserEngine": browserEngine,
        "browserLanguage": navigator.language,
        "browserOnline": navigator.onLine,
        "browserPlatform": navigator.userAgentData?.platform ?? navigator.platform,
        "javaEnabled": navigator.javaEnabled?.() ?? false,
        "dataCookiesEnabled": navigator.cookieEnabled,
        "dataStorage": typeof Storage !== "undefined" ? "localStorage available" : "not available",
        "sizeScreenW": screen.width,
        "sizeScreenH": screen.height,
        "sizeDocW": document.body.clientWidth,
        "sizeDocH": document.body.clientHeight,
        "sizeInW": innerWidth,
        "sizeInH": innerHeight,
        "sizeAvailW": screen.availWidth,
        "sizeAvailH": screen.availHeight,
        "scrColorDepth": screen.colorDepth,
        "scrPixelDepth": screen.pixelDepth,
        "touchDevice": ('ontouchstart' in window || navigator.maxTouchPoints > 0),
        "scriptVersion": VERSION,
        "idExperiment": idExperiment,
        "sessionId": user
    };

    const resultEl = document.getElementById("result");
    if (resultEl) { resultEl.textContent = "Registering user data..."; }

    try {
        const responseText = await postJSON(urlRegisterUserData, parametros);
        if (resultEl) { resultEl.textContent = responseText; }
    } catch (error) {
        console.log("Error: " + error.message);
    }
}

/**
 * Returns the ID of the scene currently being tracked.
 * @returns {number} Current scene ID.
 */
export function getCurrentSceneId() {
    console.log("CURRENT SCENE ID: " + sceneId);
    return sceneId;
}

/**
 * Fetches the current experiment status from the tracker server and updates
 * the global emittingData flag. Silently ignores network errors.
 * @returns {Promise<void>}
 */
async function getExperimentStatus() {
    try {
        const response = await fetch(urlExperimentStatus);
        if (!response.ok) return;
        const responseText = await response.text();
        emittingData = (responseText === 'OPEN');
    } catch {
        // If check fails, emittingData remains false
    }
}

/**
 * Manages the registration and detection of interactive HTML elements on the interface.
 */

/**
 * Represents a registered UI element with its bounding box and scene association.
 */
class TrackedElement {
    /**
     * @param {string} id DOM element ID.
     * @param {number} x Left edge X coordinate (CSS pixels).
     * @param {number} y Top edge Y coordinate (CSS pixels).
     * @param {number} xF Right edge X coordinate (CSS pixels).
     * @param {number} yF Bottom edge Y coordinate (CSS pixels).
     * @param {number} sceneId Scene this element belongs to.
     */
    constructor(id, x, y, xF, yF, sceneId) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.xF = xF;
        this.yF = yF;
        this.sceneId = sceneId;
    }

    /** @returns {number} The scene ID this element belongs to. */
    getScene() {
        return this.sceneId;
    }

    /**
     * Returns true if the given point falls within this element's bounding box.
     * @param {number} mX X coordinate to test.
     * @param {number} mY Y coordinate to test.
     * @returns {boolean}
     */
    isOver(mX, mY) {
        return this.x < mX && mX < this.xF && this.y < mY && mY < this.yF;
    }
}

/**
 * Returns the ID of the registered element under the given coordinates in the current scene,
 * or -1 if no element matches.
 * @param {number} x X coordinate (CSS pixels).
 * @param {number} y Y coordinate (CSS pixels).
 * @returns {string|number} Element ID or -1.
 */
function detectElement(x, y) {
    return elements.find(e => e.isOver(x, y) && e.sceneId === sceneId)?.id ?? -1;
}

/**
 * Returns the ID of the registered element matching the given DOM ID in the current scene,
 * or -1 if not found.
 * @param {string} name DOM element ID to look up.
 * @returns {string|number} Element ID or -1.
 */
function detectElementByName(name) {
    return elements.find(e => e.id === name && e.sceneId === sceneId)?.id ?? -1;
}

/**
 * Adds an element to the local registry and attaches focus/blur listeners.
 * Selection events (change, click) are also attached for combobox, option,
 * radio button, and checkbox components.
 * @param {string} id DOM element ID.
 * @param {number} x Left edge X coordinate.
 * @param {number} y Top edge Y coordinate.
 * @param {number} xF Right edge X coordinate.
 * @param {number} yF Bottom edge Y coordinate.
 * @param {number} typeId Component type constant.
 * @param {number} sceneId Scene this element belongs to.
 */
export function registerElement(id, x, y, xF, yF, typeId, sceneId) {
    elements.push(new TrackedElement(id, x, y, xF, yF, sceneId));
    addFocusAndBlurEvents(id);
    if (typeId === COMPONENT_COMBOBOX || typeId === COMPONENT_OPTION ||
        typeId === COMPONENT_RADIO_BUTTON || typeId === COMPONENT_CHECK_BOX) {
        addSelectionEvent(id);
    }
}

/**
 * Attaches focus and blur tracking listeners to the DOM element with the given ID.
 * Does nothing if the element is not found in the document.
 * @param {string} elementId DOM element ID.
 */
export function addFocusAndBlurEvents(elementId) {
    const element = document.getElementById(elementId);
    if (element != null) {
        const signal = trackingAbortController?.signal;
        element.addEventListener('focus', trackFocusEvent, { signal });
        element.addEventListener('blur', trackBlurEvent, { signal });
    }
}

/**
 * Attaches change and click tracking listeners to the DOM element with the given ID.
 * Used for interactive selection components (combobox, radio, checkbox).
 * Does nothing if the element is not found in the document.
 * @param {string} elementId DOM element ID.
 */
export function addSelectionEvent(elementId) {
    const element = document.getElementById(elementId);
    if (element != null) {
        const signal = trackingAbortController?.signal;
        element.addEventListener('change', trackOnChangeSelectionEvent, { signal });
        element.addEventListener('click', trackOnClickSelectionEvent, { signal });
    }
}

/**
 * Webcam-based gaze tracking via WebGazer.js
 */

/**
 * Fetches the eye-tracking setting for the current experiment and updates the global
 * gazeTrackingEnabled flag. Fails closed: camera access must never be requested as a
 * side effect of a network error.
 * @returns {Promise<void>}
 */
async function getEyeTrackingEnabledStatus() {
    try {
        const response = await fetch(urlEyeTrackingEnabled);
        if (!response.ok) return;
        const text = await response.text();
        gazeTrackingEnabled = (text.trim() === 'true');
    } catch {
        // If check fails, gazeTrackingEnabled remains false
    }
}

/**
 * Shows a full-screen consent overlay asking the participant to allow webcam-based
 * gaze tracking. This is independent of the browser's native camera permission prompt,
 * which is requested afterwards only if the participant accepts here.
 * @returns {Promise<boolean>} true if the participant accepted, false if declined.
 */
function requestGazeConsent() {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.85);'
            + 'display:flex;align-items:center;justify-content:center;font-family:sans-serif;';

        const box = document.createElement('div');
        box.style.cssText = 'background:#fff;color:#111;padding:24px;border-radius:8px;max-width:420px;text-align:center;';

        const text = document.createElement('p');
        text.style.cssText = 'margin:0 0 16px;';
        text.textContent = 'This experiment would like to use your webcam to track where you look on the '
            + 'screen. Video is processed locally in your browser; only gaze coordinates are recorded.';
        box.appendChild(text);

        const acceptBtn = document.createElement('button');
        acceptBtn.textContent = 'Accept';
        acceptBtn.style.cssText = 'margin-right:8px;padding:8px 16px;cursor:pointer;';
        const declineBtn = document.createElement('button');
        declineBtn.textContent = 'Decline';
        declineBtn.style.cssText = 'padding:8px 16px;cursor:pointer;';

        acceptBtn.addEventListener('click', () => { document.body.removeChild(overlay); resolve(true); });
        declineBtn.addEventListener('click', () => { document.body.removeChild(overlay); resolve(false); });

        box.appendChild(acceptBtn);
        box.appendChild(declineBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}

/**
 * Shows a 9-point calibration overlay. Each dot must be clicked 5 times while the
 * participant looks at it; WebGazer's own click listener (already active once
 * webgazer.begin() has resolved) learns from these clicks, so no explicit WebGazer
 * calibration API needs to be called here.
 * @returns {Promise<void>} Resolves once all 9 dots have been clicked enough times.
 */
function runGazeCalibration() {
    return new Promise((resolve) => {
        const REQUIRED_CLICKS = 5;
        const positions = [[10, 10], [50, 10], [90, 10], [10, 50], [50, 50], [90, 50], [10, 90], [50, 90], [90, 90]];

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.9);';

        const message = document.createElement('div');
        message.textContent = 'Look at each dot and click it 5 times.';
        message.style.cssText = 'position:absolute;top:16px;left:0;right:0;text-align:center;color:#fff;font-family:sans-serif;';
        overlay.appendChild(message);

        let remaining = positions.length;
        positions.forEach(([leftPct, topPct]) => {
            let clicks = 0;
            const dot = document.createElement('div');
            dot.style.cssText = `position:absolute;left:${leftPct}%;top:${topPct}%;transform:translate(-50%,-50%);`
                + 'width:24px;height:24px;border-radius:50%;background:#f00;cursor:pointer;';
            dot.addEventListener('click', () => {
                clicks++;
                if (clicks >= REQUIRED_CLICKS) {
                    dot.style.background = '#0f0';
                    dot.style.pointerEvents = 'none';
                    remaining--;
                    if (remaining === 0) {
                        document.body.removeChild(overlay);
                        resolve();
                    }
                } else {
                    dot.style.opacity = String(1 - (clicks / REQUIRED_CLICKS) * 0.5);
                }
            });
            overlay.appendChild(dot);
        });

        document.body.appendChild(overlay);
    });
}

/**
 * Starts webcam-based gaze tracking: asks for participant consent (once per tab
 * session), starts WebGazer, runs calibration (once per tab session), and attaches the
 * gaze listener. Never throws: any failure (library not loaded, camera denied, no
 * webcam) degrades to a no-op so the rest of the tracking pipeline is unaffected.
 * If WebGazer was already started earlier in this tab session (e.g. a previous scene),
 * this only resumes it, since begin() must be called at most once per page load, otherwise
 * WebGazer reinitializes its model and camera stream from scratch on every scene.
 * @returns {Promise<void>}
 */
async function startGazeTracking() {
    if (typeof webgazer === 'undefined') return;

    let consent = sessionStorage.getItem('hci_gaze_consent');
    if (consent === null) {
        consent = (await requestGazeConsent()) ? 'granted' : 'denied';
        sessionStorage.setItem('hci_gaze_consent', consent);
    }
    if (consent !== 'granted') return;

    if (gazeStarted) {
        webgazer.resume();
        return;
    }

    try {
        // WebGazer's TFFacemesh tracker resolves this path relative to the host page's
        // own origin (not webgazer.js's origin), so without this it 404s on any page
        // that doesn't also self-host WebGazer's www/mediapipe/face_mesh/ folder.
        webgazer.params.faceMeshSolutionPath = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh';
        await webgazer.begin();
    } catch (error) {
        console.log("Error starting gaze tracking: " + error.message);
        sessionStorage.setItem('hci_gaze_consent', 'denied');
        return;
    }
    gazeStarted = true;
    webgazer.showVideoPreview(false).showPredictionPoints(false);

    if (!sessionStorage.getItem('hci_gaze_calibrated')) {
        await runGazeCalibration();
        sessionStorage.setItem('hci_gaze_calibrated', 'true');
    }

    webgazer.setGazeListener(onGazeData);
}

/**
 * WebGazer gaze callback, throttled to gazeSampleIntervalMs (see tracker-config.js).
 * Builds a tracking item the same way trackPointerSample does and appends it to the
 * shared pending list, flushing at TOP_LIMIT like every other event source.
 * @param {{x: number, y: number}|null} data Predicted gaze point in viewport coordinates.
 * @returns {void}
 */
function onGazeData(data) {
    if (!data || !trackingOn) return;
    const now = Date.now();
    if (now - lastGazeSampleTs < gazeSampleIntervalMs) return;
    lastGazeSampleTs = now;

    const item = {};
    item.id = eventCounter++;
    item.sceneId = sceneId;
    item.sessionId = user;
    item.eventType = EVENT_GAZE;
    item.timeStamp = now;
    item.x = Math.round(data.x + window.scrollX);
    item.y = Math.round(data.y + window.scrollY);
    item.keyValueEvent = "gaze:-1";
    item.keyCodeEvent = -1;
    item.elementId = detectElement(item.x, item.y);

    list.push(item);

    if (list.length >= TOP_LIMIT) {
        const deliverPackage = list;
        list = [];
        deliverData(deliverPackage).catch(console.error);
    }
}

/**
 * Pauses gaze tracking without releasing the camera or reloading the WebGazer model, so
 * it can resume instantly on the next scene without re-requesting permission. No-op if
 * gaze tracking was never started (not enabled, consent denied, or library missing).
 * @returns {void}
 */
function stopGazeTracking() {
    if (typeof webgazer === 'undefined') return;
    if (sessionStorage.getItem('hci_gaze_consent') !== 'granted') return;
    webgazer.pause();
}

/**
 * Manages the capture and logging of all user events in the interface
 * (mouse, keyboard, window, elements).
 */

/**
 * Dispatches a DOM event to the tracking pipeline if tracking is active.
 * @param {number} eventType Event type constant (e.g. EVENT_ON_CLICK).
 * @param {Event} event Original DOM event providing coordinates and target info.
 * @returns {Promise<void>}
 */
async function trackWithEvent(eventType, event) {
    if (trackingOn) { await trackEventOverElement(eventType, event); }
}

/**
 * Dispatches a synthetic event (no DOM event) to the tracking pipeline if tracking is active.
 * Used for events that carry no pointer or keyboard data (e.g. INIT, END markers).
 * @param {number} eventType Event type constant.
 * @returns {Promise<void>}
 */
async function trackEvent(eventType) {
    if (trackingOn) { await trackEventOverElement(eventType, null); }
}

/**
 * Builds a tracking item from the event and appends it to the pending list.
 * Flushes the list to the server when it reaches TOP_LIMIT entries.
 * @param {number} eventType Event type constant.
 * @param {Event|null} event DOM event, or null for synthetic events.
 * @returns {Promise<void>}
 */
async function trackEventOverElement(eventType, event) {
    const item = {};
    item.id = eventCounter++;
    item.sceneId = sceneId;
    item.sessionId = user;
    item.eventType = eventType;
    item.timeStamp = Date.now();

    item.x = (event && typeof event.pageX === 'number') ? event.pageX : -1;
    item.y = (event && typeof event.pageY === 'number') ? event.pageY : -1;

    item.keyValueEvent = -1;
    item.keyCodeEvent = -1;

    const isKeyEvent = eventType === EVENT_KEY_DOWN || eventType === EVENT_KEY_PRESS || eventType === EVENT_KEY_UP;
    const isTargetEvent = eventType === EVENT_FOCUS || eventType === EVENT_BLUR
        || eventType === EVENT_ON_CHANGE_SELECTION_OBJECT || eventType === EVENT_ON_CLICK_SELECTION_OBJECT;

    if (event && (isKeyEvent || isTargetEvent)) {
        if (isKeyEvent && event.target && event.target.type !== 'password') {
            item.keyValueEvent = event.key;
        }
        item.elementId = detectElementByName(event.target.id);
    } else {
        item.elementId = detectElement(item.x, item.y);
    }
    list.push(item);

    if (list.length >= TOP_LIMIT) {
        const deliverPackage = list;
        list = [];
        await deliverData(deliverPackage);
    }
}

/**
 * Starts tracking for the given scene: refreshes experiment status, registers all
 * DOM event listeners, and emits the INIT_TRACKING event.
 * Cancels any previously active tracking session before starting a new one.
 * @param {number} _sceneId ID of the scene to start tracking.
 * @returns {Promise<void>}
 */
export async function initTracking(_sceneId) {
    // Cancel previous listeners if they exist
    if (trackingAbortController) {
        trackingAbortController.abort();
    }
    trackingAbortController = new AbortController();
    const signal = trackingAbortController.signal;
    pointerSamples.clear();
    cancelledTouches.clear();
    touchPointers.clear();

    await getExperimentStatus();
    trackingOn = true;
    sceneId = _sceneId;
    console.log("Initializing tracking for scene " + _sceneId);
    await trackEvent(EVENT_INIT_TRACKING);

    if (gazeTrackingEnabled) { await startGazeTracking(); }

    const target = parent;
    target.addEventListener('scroll', trackWindowScroll, { signal });
    target.addEventListener('resize', trackWindowResize, { signal });
    target.addEventListener('mousemove', trackMouseMovement, { signal });
    target.addEventListener('mousedown', trackMouseDown, { signal });
    target.addEventListener('mouseup', trackMouseUp, { signal });
    target.addEventListener('click', trackClick, { signal });
    target.addEventListener('dblclick', trackDblclick, { signal });
    target.addEventListener('contextmenu', trackContextmenu, { signal });
    target.addEventListener('wheel', trackWheel, { signal });
    target.addEventListener('keydown', trackEventKeydown, { signal });
    target.addEventListener('keypress', trackEventKeypress, { signal });
    target.addEventListener('keyup', trackEventKeyup, { signal });
    // Pointer Events API, touch interactions only
    target.addEventListener('pointerdown', trackPointerDown, { signal });
    target.addEventListener('pointerup', trackPointerUp, { signal });
    target.addEventListener('pointermove', trackPointerMove, { signal });
    target.addEventListener('pointercancel', trackPointerCancel, { signal });
    // Touch Events API, only to follow the touches the browser cancelled as pointers
    target.addEventListener('touchstart', trackTouchStart, { signal, passive: true });
    target.addEventListener('touchmove', trackTouchMove, { signal, passive: true });
    target.addEventListener('touchend', trackTouchEnd, { signal, passive: true });
    target.addEventListener('touchcancel', trackTouchEnd, { signal, passive: true });
}

/** @param {MouseEvent} event */ function trackMouseMovement(event) { if (lastPointerType === 'mouse') trackWithEvent(EVENT_ON_MOUSE_MOVE, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackClick(event) { if (lastPointerType === 'mouse') trackWithEvent(EVENT_ON_CLICK, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackDblclick(event) { if (lastPointerType === 'mouse') trackWithEvent(EVENT_ON_DOUBLE_CLICK, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackMouseDown(event) { if (lastPointerType === 'mouse') trackWithEvent(EVENT_ON_MOUSE_DOWN, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackMouseUp(event) { if (lastPointerType === 'mouse') trackWithEvent(EVENT_ON_MOUSE_UP, event).catch(console.error); }
/** @param {WheelEvent} event */ function trackWheel(event) { if (lastPointerType === 'mouse') trackWithEvent(EVENT_ON_WHEEL, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackContextmenu(event) { if (lastPointerType === 'mouse') trackWithEvent(EVENT_CONTEXT_MENU, event).catch(console.error); }
/** @param {Event} event */ function trackWindowScroll(event) { trackWithEvent(EVENT_WINDOW_SCROLL, event).catch(console.error); }
/** @param {UIEvent} event */ function trackWindowResize(event) { trackWithEvent(EVENT_WINDOW_RESIZE, event).catch(console.error); }
/** @param {KeyboardEvent} event */ function trackEventKeydown(event) { trackWithEvent(EVENT_KEY_DOWN, event).catch(console.error); }
/** @param {KeyboardEvent} event */ function trackEventKeypress(event) { trackWithEvent(EVENT_KEY_PRESS, event).catch(console.error); }
/** @param {KeyboardEvent} event */ function trackEventKeyup(event) { trackWithEvent(EVENT_KEY_UP, event).catch(console.error); }
/** @param {PointerEvent} event */ function trackPointerDown(event) { trackPointer(EVENT_POINTER_DOWN, event); }
/** @param {PointerEvent} event */ function trackPointerUp(event) { trackPointer(EVENT_POINTER_UP, event); }
/** @param {PointerEvent} event */ function trackPointerMove(event) { trackPointer(EVENT_POINTER_MOVE, event); }
/** @param {PointerEvent} event */ function trackPointerCancel(event) { trackPointer(EVENT_POINTER_CANCEL, event); }
/** @param {FocusEvent} event */ function trackFocusEvent(event) { trackWithEvent(EVENT_FOCUS, event).catch(console.error); }
/** @param {FocusEvent} event */ function trackBlurEvent(event) { trackWithEvent(EVENT_BLUR, event).catch(console.error); }
/** @param {Event} event */ function trackOnChangeSelectionEvent(event) { trackWithEvent(EVENT_ON_CHANGE_SELECTION_OBJECT, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackOnClickSelectionEvent(event) { trackWithEvent(EVENT_ON_CLICK_SELECTION_OBJECT, event).catch(console.error); }

/**
 * Ends tracking for the current scene: emits the TRACKING_END event, captures a
 * background snapshot, flushes remaining events, then navigates to _newPage once
 * all pending requests complete. Also removes the DOM event listeners registered by
 * initTracking (they would otherwise only be removed by the next initTracking call).
 * A call made while the scene is already ending waits for it instead of ending it again.
 *
 * This does NOT mark the whole experiment as finished: it only ends the current
 * scene. If this is the last page of the experiment, finishExperiment() (in
 * tracker-helpers.js) must also be called once, otherwise the participant's
 * session ID is never removed from localStorage and will be reused on a future visit.
 * @param {string|null} _newPage URL to navigate to after all data is delivered, or null.
 * @returns {Promise<void>}
 */
export async function finishTracking(_newPage) {
    await endScene();
    newPage = _newPage;
    checkReadyToLeave();
}

/**
 * Checks whether all pending event and background requests have completed.
 * If not, retries after 2 seconds. Once clear, cleans up the user session if the
 * experiment is finished and navigates to the next page if one was set.
 */
function checkReadyToLeave() {
    if (!eventsDelivered || pendingRequest > 0) {
        console.log("Not ready to leave page, events still pending");
    } else {
        if (pendingBackgroundsDelivered > 0) {
            console.log("Not ready to leave page, " + pendingBackgroundsDelivered + " backgrounds still pending");
            setTimeout(() => { checkReadyToLeave(); }, 2000);
            return;
        }
        if (leftPage) return;
        console.log("Ready to leave page, pending request:" + pendingRequest + ", pending backgrounds " + pendingBackgroundsDelivered + "/" + backgroundsDelivered);
        if (finishedExperiment) {
            leftPage = true;
            console.log("Experiment finished, deleting user " + localStorage.getItem(getUserStorageKey()));
            localStorage.removeItem(getUserStorageKey());
        }
        if (newPage != null) {
            window.location.href = newPage;
        }
    }
}

/**
 * Ends tracking for a sub-scene without navigating: emits TRACKING_END, captures a
 * snapshot, and flushes remaining events. Use when transitioning between sub-scenes
 * within the same page. Also removes the DOM event listeners registered by
 * initTracking. Call initTracking again before tracking the next sub-scene.
 * @returns {Promise<void>}
 */
export async function finishSubsceneTracking() {
    await endScene();
}

/**
 * Ends the scene being tracked once, however many times it is called: the page may call
 * finishTracking again before the first call is done (a button tapped twice, for instance),
 * and every call would otherwise record its own TRACKING_END, take its own snapshot and send
 * the same pending events again. Calls made while the scene is ending get the same promise,
 * and calls made once it has ended resolve at once.
 * @returns {Promise<void>}
 */
function endScene() {
    if (sceneEnd) return sceneEnd;
    if (!trackingOn) return Promise.resolve();
    sceneEnd = (async () => {
        await flushCancelledTouches();
        await trackEvent(EVENT_TRACKING_END);
        trackingOn = false;
        if (trackingAbortController) {
            trackingAbortController.abort();
            trackingAbortController = null;
        }
        if (gazeTrackingEnabled) { stopGazeTracking(); }
        const pending = list;
        list = [];
        await takeSnapshot(sceneId);
        await deliverData(pending);
    })().finally(() => { sceneEnd = null; });
    return sceneEnd;
}

/**
 * Sends the events still waiting to fill a chunk when the participant hides or leaves the
 * page, which would otherwise be lost if the scene is never finished. keepalive lets the
 * request complete after the page is gone. Tracking goes on if the participant comes back.
 * @returns {void}
 */
function deliverPendingOnHide() {
    if (!emittingData || list.length === 0) return;
    const pending = list;
    list = [];
    for (let i = 0; i < pending.length; i += TOP_LIMIT) {
        const parametros = {
            "timezone": getTimezone(),
            "list": pending.slice(i, i + TOP_LIMIT),
            "idExperiment": idExperiment,
            "sessionId": user
        };
        postJSON(url, parametros, { keepalive: true }).catch(console.error);
    }
}

window.addEventListener('pagehide', deliverPendingOnHide);
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { deliverPendingOnHide(); }
});

/**
 * Registers a UI component with the tracker server and adds it to the local element
 * registry so it can be detected by pointer coordinates.
 * @param {number} sceneId Scene the component belongs to.
 * @param {string} componentId DOM element ID of the component.
 * @param {number} x Left edge X coordinate (CSS pixels).
 * @param {number} y Top edge Y coordinate (CSS pixels).
 * @param {number} xF Right edge X coordinate (CSS pixels).
 * @param {number} yF Bottom edge Y coordinate (CSS pixels).
 * @param {number} typeId Component type constant (e.g. COMPONENT_TEXT_FIELD).
 * @param {string} componentAssociated ID of a related/parent component, if any.
 * @returns {Promise<void>}
 */
export async function registerComponent(sceneId, componentId, x, y, xF, yF, typeId, componentAssociated) {
    if (!emittingData) return;

    registerElement(componentId, x, y, xF, yF, typeId, sceneId);
    const parametros = {
        "timezone": getTimezone(),
        "sceneId": sceneId,
        "componentId": componentId,
        "x": Math.round(x),
        "y": Math.round(y),
        "xF": Math.round(xF),
        "yF": Math.round(yF),
        "timeStamp": Date.now(),
        "idExperiment": idExperiment,
        "typeId": typeId,
        "componentAssociated": componentAssociated,
        "sessionId": user
    };

    try {
        await postJSON(urlRegisterComponent, parametros);
    } catch (error) {
        console.log("Error registering component: " + error.message);
    }
}

/**
 * Sends a single chunk of events to the tracker server with up to 3 automatic retries
 * on failure (delays: 500 ms, 1500 ms, 4000 ms). Updates pendingRequest and
 * eventsDelivered counters and triggers checkReadyToLeave on completion.
 * @param {object[]} chunk Array of tracking event items to deliver.
 * @returns {Promise<void>}
 */
async function deliverChunk(chunk) {
    if (!emittingData) {
        if (pendingRequest === 0) { eventsDelivered = true; }
        return;
    }

    const parametros = {
        "timezone": getTimezone(),
        "list": chunk,
        "idExperiment": idExperiment,
        "sessionId": user
    };

    pendingRequest++;
    sentRequest++;
    console.log("Sending request. Pending requests: " + pendingRequest + "/" + sentRequest);

    const RETRY_DELAYS = [500, 1500, 4000];
    try {
        let lastError;
        for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
            if (attempt > 0) {
                await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt - 1]));
                console.warn(`Retrying chunk delivery (attempt ${attempt + 1}/${RETRY_DELAYS.length + 1})...`);
            }
            try {
                const responseText = await postJSON(url, parametros);
                console.log('Result: ' + responseText);
                return;
            } catch (error) {
                lastError = error;
            }
        }
        console.error(`Chunk of ${chunk.length} events lost after ${RETRY_DELAYS.length + 1} attempts: ${lastError.message}`);
    } finally {
        pendingRequest--;
        console.log("Call completed. Pending Requests: " + pendingRequest + "/" + sentRequest);
        if (pendingRequest === 0) { eventsDelivered = true; }
        checkReadyToLeave();
    }
}

/**
 * Captures a Pointer Events API event (touch or stylus); mouse pointers only update
 * lastPointerType, since the mouse events already record them.
 * The browser cancels a touch pointer as soon as it takes over the gesture to scroll or
 * zoom, and reports the cancel at (0, 0), but the finger goes on moving and only the touch
 * events keep following it. So a cancelled touch is not recorded yet: its moves are taken
 * from the touch events, and its cancel is recorded where the finger is lifted
 * (see trackTouchMove and trackTouchEnd).
 * @param {number} eventType Pointer event type constant.
 * @param {PointerEvent} event Original pointer DOM event.
 * @returns {void}
 */
function trackPointer(eventType, event) {
    lastPointerType = event.pointerType;
    if (event.pointerType === 'mouse') return;

    const pointerId = event.pointerId ?? 0;
    if (eventType !== EVENT_POINTER_CANCEL) {
        const sample = pointerSample(event);
        if (eventType === EVENT_POINTER_UP) {
            pointerSamples.delete(pointerId);
        } else {
            pointerSamples.set(pointerId, sample);
        }
        trackPointerSample(eventType, event.pointerType, pointerId, sample).catch(console.error);
        return;
    }

    const last = pointerSamples.get(pointerId) ?? pointerSample(event);
    pointerSamples.delete(pointerId);
    if (trackingOn && event.pointerType === 'touch' && 'TouchEvent' in window) {
        cancelledTouches.set(pointerId, last);
        return;
    }
    trackPointerSample(EVENT_POINTER_CANCEL, event.pointerType, pointerId, last).catch(console.error);
}

/**
 * Builds a pointer sample from a pointer event.
 * @param {PointerEvent} event
 * @returns {{x: number, y: number, clientX: number, clientY: number, width: number, height: number, pressure: number}}
 */
function pointerSample(event) {
    return {
        x: event.pageX,
        y: event.pageY,
        clientX: event.clientX,
        clientY: event.clientY,
        width: event.width ?? 0,
        height: event.height ?? 0,
        pressure: event.pressure ?? 0,
    };
}

/**
 * Pairs every new touch with the pointer of the same finger, whose pointerdown the
 * browser has just fired at the same point.
 * @param {TouchEvent} event
 * @returns {void}
 */
function trackTouchStart(event) {
    const paired = new Set(touchPointers.values());
    for (const touch of event.changedTouches) {
        let nearest;
        let nearestDistance = Infinity;
        for (const [pointerId, sample] of pointerSamples) {
            if (paired.has(pointerId)) continue;
            const distance = Math.hypot(sample.x - touch.pageX, sample.y - touch.pageY);
            if (distance < nearestDistance) {
                nearest = pointerId;
                nearestDistance = distance;
            }
        }
        if (nearest !== undefined) {
            touchPointers.set(touch.identifier, nearest);
            paired.add(nearest);
        }
    }
}

/**
 * Records the moves of the cancelled touch pointers (see trackPointer) as pointer moves.
 * @param {TouchEvent} event
 * @returns {void}
 */
function trackTouchMove(event) {
    if (cancelledTouches.size === 0) return;
    for (const touch of event.changedTouches) {
        const pointerId = touchPointers.get(touch.identifier);
        if (pointerId === undefined || !cancelledTouches.has(pointerId)) continue;
        const sample = touchSample(touch, cancelledTouches.get(pointerId));
        cancelledTouches.set(pointerId, sample);
        trackPointerSample(EVENT_POINTER_MOVE, 'touch', pointerId, sample).catch(console.error);
    }
}

/**
 * Records the cancel of the cancelled touch pointers (see trackPointer) where their finger
 * is lifted, and forgets the lifted touches.
 * @param {TouchEvent} event
 * @returns {void}
 */
function trackTouchEnd(event) {
    for (const touch of event.changedTouches) {
        const pointerId = touchPointers.get(touch.identifier);
        touchPointers.delete(touch.identifier);
        if (pointerId === undefined || !cancelledTouches.has(pointerId)) continue;
        const sample = touchSample(touch, cancelledTouches.get(pointerId));
        cancelledTouches.delete(pointerId);
        trackPointerSample(EVENT_POINTER_CANCEL, 'touch', pointerId, sample).catch(console.error);
    }
}

/**
 * Builds a pointer sample from a touch, keeping the previous contact size and pressure
 * when the browser does not report them for touches.
 * @param {Touch} touch
 * @param {{x: number, y: number, clientX: number, clientY: number, width: number, height: number, pressure: number}} previous
 * @returns {{x: number, y: number, clientX: number, clientY: number, width: number, height: number, pressure: number}}
 */
function touchSample(touch, previous) {
    return {
        x: touch.pageX,
        y: touch.pageY,
        clientX: touch.clientX,
        clientY: touch.clientY,
        width: touch.radiusX > 0 ? touch.radiusX * 2 : previous.width,
        height: touch.radiusY > 0 ? touch.radiusY * 2 : previous.height,
        pressure: touch.force > 0 ? touch.force : previous.pressure,
    };
}

/**
 * Records the cancel of every touch pointer still being followed, at its last position,
 * so that the scene does not end with a gesture left open.
 * @returns {Promise<void>}
 */
async function flushCancelledTouches() {
    for (const [pointerId, sample] of cancelledTouches) {
        await trackPointerSample(EVENT_POINTER_CANCEL, 'touch', pointerId, sample);
    }
    cancelledTouches.clear();
}

/**
 * Builds a tracking item from a pointer sample and appends it to the pending list.
 * x and y hold the position on the page. The rest of the pointer data goes in existing fields:
 *   keyValueEvent: "pointerType:contactWidth:contactHeight:pointerId:clientX:clientY", where
 *     clientX and clientY are the position on the screen (viewport), which is what shows how
 *     far the finger moved while it scrolled the page under it
 *   keyCodeEvent: Math.round(pressure * 1000), from 0 (no pressure) to 1000 (max pressure)
 * @param {number} eventType Pointer event type constant.
 * @param {string} pointerType "touch" or "pen".
 * @param {number} pointerId Pointer the sample belongs to.
 * @param {{x: number, y: number, clientX: number, clientY: number, width: number, height: number, pressure: number}} sample Position on the page and on the screen, contact size and pressure.
 * @returns {Promise<void>}
 */
async function trackPointerSample(eventType, pointerType, pointerId, sample) {
    if (!trackingOn) return;

    const item = {};
    item.id = eventCounter++;
    item.sceneId = sceneId;
    item.sessionId = user;
    item.eventType = eventType;
    item.timeStamp = Date.now();
    item.x = Math.round(sample.x);
    item.y = Math.round(sample.y);
    item.keyValueEvent = `${pointerType}:${Math.round(sample.width)}:${Math.round(sample.height)}:${pointerId}:${Math.round(sample.clientX)}:${Math.round(sample.clientY)}`;
    item.keyCodeEvent = Math.round(sample.pressure * 1000);
    item.elementId = detectElement(item.x, item.y);

    list.push(item);

    if (list.length >= TOP_LIMIT) {
        const deliverPackage = list;
        list = [];
        await deliverData(deliverPackage);
    }
}

/**
 * Splits a list of events into chunks of at most TOP_LIMIT items and delivers them
 * concurrently via deliverChunk.
 * @param {object[]} list Full list of tracking event items to deliver.
 * @returns {Promise<void>}
 */
async function deliverData(list) {
    const promises = [];
    let chunk = [];
    for (const item of list) {
        chunk.push(item);
        if (chunk.length >= TOP_LIMIT) {
            promises.push(deliverChunk(chunk));
            chunk = [];
        }
    }
    if (chunk.length > 0) {
        promises.push(deliverChunk(chunk));
    }
    await Promise.all(promises);
}

/**
 * Provides functions to fetch and graphically visualize the user trace.
 * It also includes the necessary methods to register demographic data (String, Number, Date) from the user.
 */

/**
 * Fetches the tracking event list for a session/scene and draws it on the canvas.
 * @param {string} sessionId User session ID.
 * @param {number} sceneId Scene ID to retrieve tracking data for.
 * @param {boolean} [showLoading=true] Whether to show a loading message in the result element.
 * @returns {Promise<void>}
 */
async function getTracking(sessionId, sceneId, showLoading = true) {
    if (!emittingData) return;

    const parametros = {
        "sessionId": sessionId,
        "sceneId": sceneId,
        "idExperiment": idExperiment
    };
    const resultEl = document.getElementById("result");
    if (showLoading && resultEl) {
        resultEl.textContent = "Procesando, espere por favor...";
    }
    try {
        const responseText = await getWithParams(url, parametros);
        if (resultEl) { resultEl.textContent = responseText; }
        paintTracking(responseText);
    } catch (error) {
        console.error("Error getting tracking: " + error.message);
    }
}

/**
 * Fetches and overlays both the background screenshot and the tracking trace on the canvas
 * for the given session and scene. Both requests run concurrently.
 * @param {string} sessionId User session ID.
 * @param {number} sceneId Scene ID.
 * @returns {Promise<void>}
 */
async function showTrace(sessionId, sceneId) {
    if (!emittingData) return;

    const resultEl = document.getElementById("result");
    if (resultEl) { resultEl.innerHTML = "Procesando, espere por favor..."; }

    try {
        await Promise.all([
            getBackground(sessionId, sceneId),
            getTracking(sessionId, sceneId, false)
        ]);
    } catch (error) {
        console.error("Error in showTrace: " + error.message);
    }
}

/**
 * Fetches the background screenshot for a session/scene and draws it on the canvas element
 * with id "myCanvas".
 * @param {string} sessionId User session ID.
 * @param {number} sceneId Scene ID.
 * @returns {Promise<void>}
 */
async function getBackground(sessionId, sceneId) {
    if (!emittingData) return;

    const parametros = {
        "sessionId": sessionId,
        "sceneId": sceneId,
        "idExperiment": idExperiment
    };

    try {
        const responseText = await getWithParams(urlBackgroundTracker, parametros);
        const img = new Image();
        img.src = responseText;
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        img.onload = function () {
            if (ctx) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            }
        };
    } catch (error) {
        console.log("Error: " + error.message);
    }
}

/**
 * Parses a JSON tracking response and draws each event as a colored dot on the
 * canvas element with id "myCanvas". Color encodes the event type.
 * @param {string} response JSON string with a list array of event objects.
 */
function paintTracking(response) {
    const c = document.getElementById("myCanvas");
    const ctx = c.getContext("2d");
    let responseJSON;
    try {
        responseJSON = JSON.parse(response);
    } catch (error) {
        console.error("Error parsing tracking response: " + error.message);
        return;
    }
    responseJSON.list.forEach(function (item) {
        ctx.beginPath();
        ctx.arc(item['x'], item['y'], 1, 0, 2 * Math.PI);
        ctx.strokeStyle = getColor(item['eventType']);
        ctx.stroke();
    });
}

/**
 * Returns the hex color associated with an event type for canvas visualization.
 * @param {number} eventType Event type constant.
 * @returns {string} CSS hex color string.
 */
function getColor(eventType) {
    switch (eventType) {
        case EVENT_ON_MOUSE_MOVE: return "#FF0000";
        case EVENT_ON_CLICK: return "#FFF000";
        case EVENT_ON_DOUBLE_CLICK: return "#FFFF00";
        case EVENT_ON_MOUSE_DOWN: return "#FFFFF0";
        case EVENT_ON_MOUSE_UP: return "#FF00FF";
        case EVENT_INIT_TRACKING: return "#74FF33";
        case EVENT_TRACKING_END: return "#336BFF";
        case EVENT_GAZE: return "#00FFFF";
        default: return "#000F00";
    }
}

/**
 * Sends a demographic data value to the tracker server under the specified field name.
 * @param {number} id Demographic data field ID.
 * @param {string} fieldName Payload key for the value ("stringValue", "numberValue", or "dateValue").
 * @param {string|number} value The value to submit.
 * @returns {Promise<void>}
 */
async function postDemographicData(id, fieldName, value) {
    const parametros = {
        "timezone": getTimezone(),
        "id": id,
        "idExperiment": idExperiment,
        "sessionId": user
    };
    parametros[fieldName] = value;
    await postAJAXDemographicData(parametros);
}

/**
 * Submits a string demographic data value.
 * @param {number} id Demographic data field ID.
 * @param {string} value String value to submit.
 * @returns {Promise<void>}
 */
export async function postNumberDD(id, value) { await postDemographicData(id, "numberValue", value); }

/**
 * Submits a numeric demographic data value.
 * @param {number} id Demographic data field ID.
 * @param {number} value Numeric value to submit.
 * @returns {Promise<void>}
 */
export async function postStringDD(id, value) { await postDemographicData(id, "stringValue", value); }

/**
 * Submits a date demographic data value.
 * @param {number} id Demographic data field ID.
 * @param {string} value Date value to submit (ISO string or similar).
 * @returns {Promise<void>}
 */
export async function postDateDD(id, value) { await postDemographicData(id, "dateValue", value); }

/**
 * Low-level POST for demographic data. Does nothing if tracking is not emitting.
 * @param {object} parametros Fully assembled payload to send to the demographic data endpoint.
 * @returns {Promise<void>}
 */
async function postAJAXDemographicData(parametros) {
    if (!emittingData) return;

    try {
        await postJSON(urlDemographicData, parametros);
    } catch (error) {
        console.log("Error posting demographic data: " + error.message);
    }
}

/* --- Demographic data functions --- */
export function registerid(value) { postNumberDD(6, value); }

