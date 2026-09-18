/**
 * Provides functions to fetch and graphically visualize the user trace.
 * It also includes the necessary methods to register demographic data (String, Number, Date) from the user.
 */

/**
 * Fetches the tracking event list for a session/scene and draws it on the canvas.
 * @param {string} sessionId - User session ID.
 * @param {number} sceneId - Scene ID to retrieve tracking data for.
 * @param {boolean} [showLoading=true] - Whether to show a loading message in the result element.
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
 * @param {string} sessionId - User session ID.
 * @param {number} sceneId - Scene ID.
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
 * @param {string} sessionId - User session ID.
 * @param {number} sceneId - Scene ID.
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
 * @param {string} response - JSON string with a list array of event objects.
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
 * @param {number} eventType - Event type constant.
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
 * @param {number} id - Demographic data field ID.
 * @param {string} fieldName - Payload key for the value ("stringValue", "numberValue", or "dateValue").
 * @param {string|number} value - The value to submit.
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
 * @param {number} id - Demographic data field ID.
 * @param {string} value - String value to submit.
 * @returns {Promise<void>}
 */
async function postNumberDD(id, value) { await postDemographicData(id, "numberValue", value); }

/**
 * Submits a numeric demographic data value.
 * @param {number} id - Demographic data field ID.
 * @param {number} value - Numeric value to submit.
 * @returns {Promise<void>}
 */
async function postStringDD(id, value) { await postDemographicData(id, "stringValue", value); }

/**
 * Submits a date demographic data value.
 * @param {number} id - Demographic data field ID.
 * @param {string} value - Date value to submit (ISO string or similar).
 * @returns {Promise<void>}
 */
async function postDateDD(id, value) { await postDemographicData(id, "dateValue", value); }

/**
 * Low-level POST for demographic data. Does nothing if tracking is not emitting.
 * @param {object} parametros - Fully assembled payload to send to the demographic data endpoint.
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
function registerid(value) { postNumberDD(6, value); }

