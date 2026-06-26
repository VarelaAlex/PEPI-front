/**
 * Auxiliary and helper functions for the entire tracking system.
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

async function getWithParams(url, params) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(url + '?' + query);
    if (!response.ok) throw new Error(response.statusText);
    return response.text();
}

function getTimezone() {
    return (new Date()).getTimezoneOffset() / 60 * (-1);
}

async function startExperiment() {
    console.log("Creating user session " + user);
    await getExperimentStatus();
    await getBackgroundRecordingStatus();
    await registerUserData();
}

function finishExperiment() {
    finishedExperiment = true;
}

async function getBackgroundRecordingStatus() {
    try {
        const response = await fetch(urlBackgroundRecording);
        if (!response.ok) return;
        const text = await response.text();
        recordBackground = (text.trim() === 'true');
    } catch {
        // Si falla la comprobación, recordBackground permanece true
    }
}

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

async function registerUserData() {
    if (!emittingData) return;

    const ua = navigator.userAgent;

    let browserEngine = "Unknown";
    if (ua.includes("Gecko/")) browserEngine = "Gecko";
    else if (ua.includes("AppleWebKit/")) browserEngine = "Blink/WebKit";

    const brandEntry = navigator.userAgentData?.brands?.find(b => !b.brand.includes("Not"));
    const browserName = brandEntry?.brand ?? "Unknown";
    const browserVersion1b = brandEntry?.version ?? "Unknown";

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

async function getExperimentStatus() {
    try {
        const response = await fetch(urlExperimentStatus);
        if (!response.ok) return;
        const responseText = await response.text();
        emittingData = (responseText === 'OPEN');
    } catch {
        // Si falla la comprobación, emittingData permanece false
    }
}
