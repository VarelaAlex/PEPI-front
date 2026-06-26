/**
 * Manages the capture and logging of all user events in the interface
 * (mouse, keyboard, window, elements).
 */
async function trackWithEvent(eventType, event) {
    if (trackingOn) { await trackEventOverElement(eventType, event); }
}

async function trackEvent(eventType) {
    if (trackingOn) { await trackEventOverElement(eventType, null); }
}

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

async function initTracking(_sceneId) {
    // Cancelar listeners anteriores si existen
    if (trackingAbortController) {
        trackingAbortController.abort();
    }
    trackingAbortController = new AbortController();
    const signal = trackingAbortController.signal;

    await getExperimentStatus();
    trackingOn = true;
    sceneId = _sceneId;
    console.log("Initializing tracking for scene " + _sceneId);
    await trackEvent(EVENT_INIT_TRACKING);

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
    // Pointer Events API — touch interactions only
    target.addEventListener('pointerdown', trackPointerDown, { signal });
    target.addEventListener('pointerup', trackPointerUp, { signal });
    target.addEventListener('pointermove', trackPointerMove, { signal });
    target.addEventListener('pointercancel', trackPointerCancel, { signal });
}

function trackMouseMovement(event) { trackWithEvent(EVENT_ON_MOUSE_MOVE, event).catch(console.error); }
function trackClick(event) { trackWithEvent(EVENT_ON_CLICK, event).catch(console.error); }
function trackDblclick(event) { trackWithEvent(EVENT_ON_DOUBLE_CLICK, event).catch(console.error); }
function trackMouseDown(event) { trackWithEvent(EVENT_ON_MOUSE_DOWN, event).catch(console.error); }
function trackMouseUp(event) { trackWithEvent(EVENT_ON_MOUSE_UP, event).catch(console.error); }
function trackWheel(event) { trackWithEvent(EVENT_ON_WHEEL, event).catch(console.error); }
function trackContextmenu(event) { trackWithEvent(EVENT_CONTEXT_MENU, event).catch(console.error); }
function trackWindowScroll(event) { trackWithEvent(EVENT_WINDOW_SCROLL, event).catch(console.error); }
function trackWindowResize(event) { trackWithEvent(EVENT_WINDOW_RESIZE, event).catch(console.error); }
function trackEventKeydown(event) { trackWithEvent(EVENT_KEY_DOWN, event).catch(console.error); }
function trackEventKeypress(event) { trackWithEvent(EVENT_KEY_PRESS, event).catch(console.error); }
function trackEventKeyup(event) { trackWithEvent(EVENT_KEY_UP, event).catch(console.error); }
function trackPointerDown(event) { if (event.pointerType !== 'mouse') { trackWithPointerEvent(EVENT_POINTER_DOWN, event).catch(console.error); } }
function trackPointerUp(event) { if (event.pointerType !== 'mouse') { trackWithPointerEvent(EVENT_POINTER_UP, event).catch(console.error); } }
function trackPointerMove(event) { if (event.pointerType !== 'mouse') { trackWithPointerEvent(EVENT_POINTER_MOVE, event).catch(console.error); } }
function trackPointerCancel(event) { if (event.pointerType !== 'mouse') { trackWithPointerEvent(EVENT_POINTER_CANCEL, event).catch(console.error); } }
function trackFocusEvent(event) { trackWithEvent(EVENT_FOCUS, event).catch(console.error); }
function trackBlurEvent(event) { trackWithEvent(EVENT_BLUR, event).catch(console.error); }
function trackOnChangeSelectionEvent(event) { trackWithEvent(EVENT_ON_CHANGE_SELECTION_OBJECT, event).catch(console.error); }
function trackOnClickSelectionEvent(event) { trackWithEvent(EVENT_ON_CLICK_SELECTION_OBJECT, event).catch(console.error); }

async function finishTracking(_newPage) {
    await trackEvent(EVENT_TRACKING_END);
    trackingOn = false;
    await takeSnapshot(sceneId);
    await deliverData(list);
    list = [];
    newPage = _newPage;
    checkReadyToLeave();
}

function checkReadyToLeave() {
    if (!eventsDelivered || pendingRequest > 0) {
        console.log("Not ready to leave page, events still pending");
    } else {
        if (pendingBackgroundsDelivered > 0) {
            console.log("Not ready to leave page, " + pendingBackgroundsDelivered + " backgrounds still pending");
            setTimeout(() => { checkReadyToLeave(); }, 2000);
            return;
        }
        console.log("Ready to leave page, pending request:" + pendingRequest + ", pending backgrounds " + pendingBackgroundsDelivered + "/" + backgroundsDelivered);
        if (finishedExperiment) {
            console.log("Experiment finished, deleting user " + localStorage.getItem("user"));
            localStorage.removeItem("user");
        }
        if (newPage != null) {
            window.location.href = newPage;
        }
    }
}

async function finishSubsceneTracking() {
    await trackEvent(EVENT_TRACKING_END);
    trackingOn = false;
    await takeSnapshot(sceneId);
    await deliverData(list);
    list = [];
}

async function registerComponent(sceneId, componentId, x, y, xF, yF, typeId, componentAssociated) {
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
 * Captures a Pointer Events API event (touch or stylus).
 * Encodes pointer-specific data into existing fields:
 *   keyValueEvent → "pointerType:contactWidth:contactHeight:pointerId"
 *   keyCodeEvent  → Math.round(pressure * 1000)  (0 = no pressure, 1000 = max pressure)
 */
async function trackWithPointerEvent(eventType, event) {
    if (!trackingOn) return;

    const item = {};
    item.id = eventCounter++;
    item.sceneId = sceneId;
    item.sessionId = user;
    item.eventType = eventType;
    item.timeStamp = Date.now();
    item.x = Math.round(event.pageX);
    item.y = Math.round(event.pageY);
    item.keyValueEvent = `${event.pointerType}:${Math.round(event.width ?? 0)}:${Math.round(event.height ?? 0)}:${event.pointerId ?? 0}`;
    item.keyCodeEvent = Math.round((event.pressure ?? 0) * 1000);
    item.elementId = detectElement(item.x, item.y);

    list.push(item);

    if (list.length >= TOP_LIMIT) {
        const deliverPackage = list;
        list = [];
        await deliverData(deliverPackage);
    }
}

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
