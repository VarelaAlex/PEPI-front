/**
 * Manages the registration and detection of interactive HTML elements on the interface.
 */
class Element {
    constructor(id, x, y, xF, yF, sceneId) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.xF = xF;
        this.yF = yF;
        this.sceneId = sceneId;
    }
    getScene() {
        return this.sceneId;
    }
    isOver(mX, mY) {
        return this.x < mX && mX < this.xF && this.y < mY && mY < this.yF;
    }
}

function detectElement(x, y) {
    return elements.find(e => e.isOver(x, y) && e.sceneId === sceneId)?.id ?? -1;
}

function detectElementByName(name) {
    return elements.find(e => e.id === name && e.sceneId === sceneId)?.id ?? -1;
}

function registerElement(id, x, y, xF, yF, typeId, sceneId) {
    elements.push(new Element(id, x, y, xF, yF, sceneId));
    addFocusAndBlurEvents(id);
    if (typeId === COMPONENT_COMBOBOX || typeId === COMPONENT_OPTION ||
        typeId === COMPONENT_RADIO_BUTTON || typeId === COMPONENT_CHECK_BOX) {
        addSelectionEvent(id);
    }
}

function addFocusAndBlurEvents(elementId) {
    const element = document.getElementById(elementId);
    if (element != null) {
        element.addEventListener('focus', trackFocusEvent);
        element.addEventListener('blur', trackBlurEvent);
    }
}

function addSelectionEvent(elementId) {
    const element = document.getElementById(elementId);
    if (element != null) {
        element.addEventListener('change', trackOnChangeSelectionEvent);
        element.addEventListener('click', trackOnClickSelectionEvent);
    }
}
