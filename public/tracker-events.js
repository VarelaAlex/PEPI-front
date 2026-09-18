/**
 * Manages the capture and logging of all user events in the interface
 * (mouse, keyboard, window, elements).
 */

/**
 * Dispatches a DOM event to the tracking pipeline if tracking is active.
 * @param {number} eventType - Event type constant (e.g. EVENT_ON_CLICK).
 * @param {Event} event - Original DOM event providing coordinates and target info.
 * @returns {Promise<void>}
 */
async function trackWithEvent(eventType, event) {
    if (trackingOn) { await trackEventOverElement(eventType, event); }
}

/**
 * Dispatches a synthetic event (no DOM event) to the tracking pipeline if tracking is active.
 * Used for events that carry no pointer or keyboard data (e.g. INIT, END markers).
 * @param {number} eventType - Event type constant.
 * @returns {Promise<void>}
 */
async function trackEvent(eventType) {
    if (trackingOn) { await trackEventOverElement(eventType, null); }
}

/**
 * Builds a tracking item from the event and appends it to the pending list.
 * Flushes the list to the server when it reaches TOP_LIMIT entries.
 * @param {number} eventType - Event type constant.
 * @param {Event|null} event - DOM event, or null for synthetic events.
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
 * @param {number} _sceneId - ID of the scene to start tracking.
 * @returns {Promise<void>}
 */
async function initTracking(_sceneId) {
    // Cancel previous listeners if they exist
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
    // Pointer Events API — touch interactions only
    target.addEventListener('pointerdown', trackPointerDown, { signal });
    target.addEventListener('pointerup', trackPointerUp, { signal });
    target.addEventListener('pointermove', trackPointerMove, { signal });
    target.addEventListener('pointercancel', trackPointerCancel, { signal });
}

/** @param {MouseEvent} event */ function trackMouseMovement(event) { trackWithEvent(EVENT_ON_MOUSE_MOVE, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackClick(event) { trackWithEvent(EVENT_ON_CLICK, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackDblclick(event) { trackWithEvent(EVENT_ON_DOUBLE_CLICK, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackMouseDown(event) { trackWithEvent(EVENT_ON_MOUSE_DOWN, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackMouseUp(event) { trackWithEvent(EVENT_ON_MOUSE_UP, event).catch(console.error); }
/** @param {WheelEvent} event */ function trackWheel(event) { trackWithEvent(EVENT_ON_WHEEL, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackContextmenu(event) { trackWithEvent(EVENT_CONTEXT_MENU, event).catch(console.error); }
/** @param {Event} event */ function trackWindowScroll(event) { trackWithEvent(EVENT_WINDOW_SCROLL, event).catch(console.error); }
/** @param {UIEvent} event */ function trackWindowResize(event) { trackWithEvent(EVENT_WINDOW_RESIZE, event).catch(console.error); }
/** @param {KeyboardEvent} event */ function trackEventKeydown(event) { trackWithEvent(EVENT_KEY_DOWN, event).catch(console.error); }
/** @param {KeyboardEvent} event */ function trackEventKeypress(event) { trackWithEvent(EVENT_KEY_PRESS, event).catch(console.error); }
/** @param {KeyboardEvent} event */ function trackEventKeyup(event) { trackWithEvent(EVENT_KEY_UP, event).catch(console.error); }
/** @param {PointerEvent} event */ function trackPointerDown(event) { if (event.pointerType !== 'mouse') { trackWithPointerEvent(EVENT_POINTER_DOWN, event).catch(console.error); } }
/** @param {PointerEvent} event */ function trackPointerUp(event) { if (event.pointerType !== 'mouse') { trackWithPointerEvent(EVENT_POINTER_UP, event).catch(console.error); } }
/** @param {PointerEvent} event */ function trackPointerMove(event) { if (event.pointerType !== 'mouse') { trackWithPointerEvent(EVENT_POINTER_MOVE, event).catch(console.error); } }
/** @param {PointerEvent} event */ function trackPointerCancel(event) { if (event.pointerType !== 'mouse') { trackWithPointerEvent(EVENT_POINTER_CANCEL, event).catch(console.error); } }
/** @param {FocusEvent} event */ function trackFocusEvent(event) { trackWithEvent(EVENT_FOCUS, event).catch(console.error); }
/** @param {FocusEvent} event */ function trackBlurEvent(event) { trackWithEvent(EVENT_BLUR, event).catch(console.error); }
/** @param {Event} event */ function trackOnChangeSelectionEvent(event) { trackWithEvent(EVENT_ON_CHANGE_SELECTION_OBJECT, event).catch(console.error); }
/** @param {MouseEvent} event */ function trackOnClickSelectionEvent(event) { trackWithEvent(EVENT_ON_CLICK_SELECTION_OBJECT, event).catch(console.error); }

/**
 * Ends tracking for the current scene: emits the TRACKING_END event, captures a
 * background snapshot, flushes remaining events, then navigates to _newPage once
 * all pending requests complete. Also removes the DOM event listeners registered by
 * initTracking (they would otherwise only be removed by the next initTracking call).
 *
 * This does NOT mark the whole experiment as finished — it only ends the current
 * scene. If this is the last page of the experiment, finishExperiment() (in
 * tracker-helpers.js) must also be called once, otherwise the participant's
 * session ID is never removed from localStorage and will be reused on a future visit.
 * @param {string|null} _newPage - URL to navigate to after all data is delivered, or null.
 * @returns {Promise<void>}
 */
async function finishTracking(_newPage) {
    await trackEvent(EVENT_TRACKING_END);
    trackingOn = false;
    if (trackingAbortController) {
        trackingAbortController.abort();
        trackingAbortController = null;
    }
    if (gazeTrackingEnabled) { stopGazeTracking(); }
    await takeSnapshot(sceneId);
    await deliverData(list);
    list = [];
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
            console.log("Experiment finished, deleting user " + localStorage.getItem("user"));
            localStorage.removeItem("user");
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
 * initTracking — call initTracking again before tracking the next sub-scene.
 * @returns {Promise<void>}
 */
async function finishSubsceneTracking() {
    await trackEvent(EVENT_TRACKING_END);
    trackingOn = false;
    if (trackingAbortController) {
        trackingAbortController.abort();
        trackingAbortController = null;
    }
    if (gazeTrackingEnabled) { stopGazeTracking(); }
    await takeSnapshot(sceneId);
    await deliverData(list);
    list = [];
}

/**
 * Registers a UI component with the tracker server and adds it to the local element
 * registry so it can be detected by pointer coordinates.
 * @param {number} sceneId - Scene the component belongs to.
 * @param {string} componentId - DOM element ID of the component.
 * @param {number} x - Left edge X coordinate (CSS pixels).
 * @param {number} y - Top edge Y coordinate (CSS pixels).
 * @param {number} xF - Right edge X coordinate (CSS pixels).
 * @param {number} yF - Bottom edge Y coordinate (CSS pixels).
 * @param {number} typeId - Component type constant (e.g. COMPONENT_TEXT_FIELD).
 * @param {string} componentAssociated - ID of a related/parent component, if any.
 * @returns {Promise<void>}
 */
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

/**
 * Sends a single chunk of events to the tracker server with up to 3 automatic retries
 * on failure (delays: 500 ms, 1500 ms, 4000 ms). Updates pendingRequest and
 * eventsDelivered counters and triggers checkReadyToLeave on completion.
 * @param {object[]} chunk - Array of tracking event items to deliver.
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
 * Captures a Pointer Events API event (touch or stylus).
 * Encodes pointer-specific data into existing fields:
 *   keyValueEvent → "pointerType:contactWidth:contactHeight:pointerId"
 *   keyCodeEvent  → Math.round(pressure * 1000)  (0 = no pressure, 1000 = max pressure)
 * @param {number} eventType - Pointer event type constant.
 * @param {PointerEvent} event - Original pointer DOM event.
 * @returns {Promise<void>}
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

/**
 * Splits a list of events into chunks of at most TOP_LIMIT items and delivers them
 * concurrently via deliverChunk.
 * @param {object[]} list - Full list of tracking event items to deliver.
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
