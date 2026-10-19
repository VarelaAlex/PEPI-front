/**
 * Bridge between the app and the InteractionLab tracker module.
 */

import {
    finishExperiment as finishTrackerExperiment,
    finishSubsceneTracking as finishTrackerSubsceneTracking,
    finishTracking as finishTrackerTracking,
    initTracking as initTrackerTracking,
    postNumberDD,
    registerComponent as registerTrackerComponent,
    startExperiment as startTrackerExperiment,
} from "./tracker-agent";

export const COMPONENT_TEXT_FIELD = 1;
export const COMPONENT_COMBOBOX = 2;
export const COMPONENT_OPTION = 3;
export const COMPONENT_RADIO_BUTTON = 4;
export const COMPONENT_CHECK_BOX = 5;

export function buildSceneId(exercise, phase) {
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    return `${timestamp}_${exercise.title}_${exercise.representation}_${exercise.networkType}.${phase}`;
}

function getPageRect(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        xF: rect.right + window.scrollX,
        yF: rect.bottom + window.scrollY,
    };
}

export async function waitForDomPaint() {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

export async function registerDomElement(sceneId, element, typeId = COMPONENT_TEXT_FIELD) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (!el) return;

    const componentId = el.id || el.getAttribute('data-track-id');
    if (!componentId) return;

    const { x, y, xF, yF } = getPageRect(el);
    await registerTrackerComponent(sceneId, componentId, x, y, xF, yF, typeId, null);
}

export async function registerSceneElements(sceneId, elementIds, typeId = COMPONENT_TEXT_FIELD) {
    await waitForDomPaint();
    await Promise.all(elementIds.map((id) => registerDomElement(sceneId, id, typeId)));
}

export async function startExperiment() {
    await startTrackerExperiment();
}

export function finishExperiment() {
    finishTrackerExperiment();
}

export async function initTracking(sceneId) {
    await initTrackerTracking(sceneId);
}

export async function finishTracking(newPage) {
    await finishTrackerTracking(newPage);
}

export async function finishSubsceneTracking() {
    await finishTrackerSubsceneTracking();
}

export async function registerStudentId(value) {
    await postNumberDD(6, value);
}

export async function setupSceneTracking(sceneId, elementIds) {
    await registerSceneElements(sceneId, elementIds);
    await initTracking(sceneId);
}
