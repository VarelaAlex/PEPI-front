/**
 * Manages the registration and detection of interactive HTML elements on the interface.
 */

/**
 * Represents a registered UI element with its bounding box and scene association.
 */
class Element {
    /**
     * @param {string} id - DOM element ID.
     * @param {number} x - Left edge X coordinate (CSS pixels).
     * @param {number} y - Top edge Y coordinate (CSS pixels).
     * @param {number} xF - Right edge X coordinate (CSS pixels).
     * @param {number} yF - Bottom edge Y coordinate (CSS pixels).
     * @param {number} sceneId - Scene this element belongs to.
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
     * @param {number} mX - X coordinate to test.
     * @param {number} mY - Y coordinate to test.
     * @returns {boolean}
     */
    isOver(mX, mY) {
        return this.x < mX && mX < this.xF && this.y < mY && mY < this.yF;
    }
}

/**
 * Returns the ID of the registered element under the given coordinates in the current scene,
 * or -1 if no element matches.
 * @param {number} x - X coordinate (CSS pixels).
 * @param {number} y - Y coordinate (CSS pixels).
 * @returns {string|number} Element ID or -1.
 */
function detectElement(x, y) {
    return elements.find(e => e.isOver(x, y) && e.sceneId === sceneId)?.id ?? -1;
}

/**
 * Returns the ID of the registered element matching the given DOM ID in the current scene,
 * or -1 if not found.
 * @param {string} name - DOM element ID to look up.
 * @returns {string|number} Element ID or -1.
 */
function detectElementByName(name) {
    return elements.find(e => e.id === name && e.sceneId === sceneId)?.id ?? -1;
}

/**
 * Adds an element to the local registry and attaches focus/blur listeners.
 * Selection events (change, click) are also attached for combobox, option,
 * radio button, and checkbox components.
 * @param {string} id - DOM element ID.
 * @param {number} x - Left edge X coordinate.
 * @param {number} y - Top edge Y coordinate.
 * @param {number} xF - Right edge X coordinate.
 * @param {number} yF - Bottom edge Y coordinate.
 * @param {number} typeId - Component type constant.
 * @param {number} sceneId - Scene this element belongs to.
 */
function registerElement(id, x, y, xF, yF, typeId, sceneId) {
    elements.push(new Element(id, x, y, xF, yF, sceneId));
    addFocusAndBlurEvents(id);
    if (typeId === COMPONENT_COMBOBOX || typeId === COMPONENT_OPTION ||
        typeId === COMPONENT_RADIO_BUTTON || typeId === COMPONENT_CHECK_BOX) {
        addSelectionEvent(id);
    }
}

/**
 * Attaches focus and blur tracking listeners to the DOM element with the given ID.
 * Does nothing if the element is not found in the document.
 * @param {string} elementId - DOM element ID.
 */
function addFocusAndBlurEvents(elementId) {
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
 * @param {string} elementId - DOM element ID.
 */
function addSelectionEvent(elementId) {
    const element = document.getElementById(elementId);
    if (element != null) {
        const signal = trackingAbortController?.signal;
        element.addEventListener('change', trackOnChangeSelectionEvent, { signal });
        element.addEventListener('click', trackOnClickSelectionEvent, { signal });
    }
}
