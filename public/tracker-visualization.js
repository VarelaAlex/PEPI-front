/**
 * Provides functions to fetch and graphically visualize the user trace.
 * It also includes the necessary methods to register demographic data (String, Number, Date) from the user.
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

function getColor(eventType) {
    switch (eventType) {
        case EVENT_ON_MOUSE_MOVE: return "#FF0000";
        case EVENT_ON_CLICK: return "#FFF000";
        case EVENT_ON_DOUBLE_CLICK: return "#FFFF00";
        case EVENT_ON_MOUSE_DOWN: return "#FFFFF0";
        case EVENT_ON_MOUSE_UP: return "#FF00FF";
        case EVENT_INIT_TRACKING: return "#74FF33";
        case EVENT_TRACKING_END: return "#336BFF";
        default: return "#000F00";
    }
}

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

async function postNumberDD(id, value) { await postDemographicData(id, "numberValue", value); }
async function postStringDD(id, value) { await postDemographicData(id, "stringValue", value); }
async function postDateDD(id, value) { await postDemographicData(id, "dateValue", value); }

async function postAJAXDemographicData(parametros) {
    if (!emittingData) return;

    try {
        await postJSON(urlDemographicData, parametros);
    } catch (error) {
        console.log("Error posting demographic data: " + error.message);
    }
}

/* --- Funciones de datos demograficos --- */
function registerid(value) { postNumberDD(6, value); }

