/**
 * Auxiliary and helper functions for the entire tracking system.
 */

/**
 * Sends a POST request with a JSON body and returns the response as text.
 * @param {string} url - Endpoint URL.
 * @param {object} data - Object to serialize as JSON body.
 * @returns {Promise<string>} Response body text.
 * @throws {Error} If the response status is not OK.
 */
async function postJSON(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.text();
}

/**
 * Sends a GET request with query parameters and returns the response as text.
 * @param {string} url - Endpoint URL (without query string).
 * @param {object} params - Key-value pairs appended as query parameters.
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
async function startExperiment() {
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
 * call finishExperiment() exactly once, on the truly last page — otherwise the
 * session ID is never cleaned up.
 */
function finishExperiment() {
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
 * @param {number} sceneId - ID of the scene being captured.
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
 * @param {number} sceneId - ID of the scene the snapshot belongs to.
 * @param {HTMLCanvasElement} canvas - Canvas element to upload.
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
 * @param {string} ua - navigator.userAgent string.
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
function getCurrentSceneId() {
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
