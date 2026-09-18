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
 * gaze listener. Never throws — any failure (library not loaded, camera denied, no
 * webcam) degrades to a no-op so the rest of the tracking pipeline is unaffected.
 * If WebGazer was already started earlier in this tab session (e.g. a previous scene),
 * this only resumes it — begin() must be called at most once per page load, otherwise
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
 * Builds a tracking item the same way trackWithPointerEvent does and appends it to the
 * shared pending list, flushing at TOP_LIMIT like every other event source.
 * @param {{x: number, y: number}|null} data - Predicted gaze point in viewport coordinates.
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
