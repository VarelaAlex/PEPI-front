/**
 * Contains the global configuration and state of the tracking system.
 */
const VERSION = 4;

const EVENT_ON_MOUSE_MOVE = 0;
const EVENT_ON_CLICK = 1;
const EVENT_ON_DOUBLE_CLICK = 2;
const EVENT_ON_MOUSE_DOWN = 3;
const EVENT_ON_MOUSE_UP = 4;
const EVENT_ON_WHEEL = 5;
const EVENT_CONTEXT_MENU = 6;
const EVENT_WINDOW_SCROLL = 11;
const EVENT_WINDOW_RESIZE = 12;
const EVENT_KEY_DOWN = 13;
const EVENT_KEY_PRESS = 14;
const EVENT_KEY_UP = 15;
const EVENT_FOCUS = 16;
const EVENT_BLUR = 17;
const EVENT_ON_CHANGE_SELECTION_OBJECT = 18;
const EVENT_ON_CLICK_SELECTION_OBJECT = 19;
const EVENT_POINTER_DOWN = 20;
const EVENT_POINTER_UP = 21;
const EVENT_POINTER_MOVE = 22;
const EVENT_POINTER_CANCEL = 23;
const EVENT_INIT_TRACKING = 100;
const EVENT_TRACKING_END = 200;
const COMPONENT_TEXT_FIELD = 1;
const COMPONENT_COMBOBOX = 2;
const COMPONENT_OPTION = 3;
const COMPONENT_RADIO_BUTTON = 4;
const COMPONENT_CHECK_BOX = 5;

function createUser() {
    if (localStorage.getItem("user") === null) {
        localStorage.setItem("user", crypto.randomUUID());
    }
    return localStorage.getItem("user");
}

const user = createUser();

let list = [];
let sceneId = 0;
let eventCounter = 0;
let trackingOn = false;
let sentRequest = 0;
let pendingRequest = 0;
let pendingBackgroundsDelivered = 0;
let backgroundsDelivered = 0;
let eventsDelivered = false;
let finishedExperiment = false;
let newPage = null;
let emittingData = false;
let recordBackground = true;
let trackingAbortController = null;

const elements = [];
const TOP_LIMIT = 50;
const idExperiment = 4;
const urlBase = "https:\/\/156.35.163.141";
const url = urlBase + '/TrackerServer/restws/track';
const urlBackgroundTracker = urlBase + '/TrackerServer/restws/backgroundTracker';
const urlRegisterComponent = urlBase + '/TrackerServer/restws/registerComponent';
const urlRegisterUserData = urlBase + '/TrackerServer/restws/registerUserData';
const urlDemographicData = urlBase + '/TrackerServer/restws/registerDemographicData';
const urlExperimentStatus = urlBase + '/TrackerServer/restws/experiment/status/' + idExperiment;
const urlBackgroundRecording = urlBase + '/TrackerServer/restws/experiment/backgroundRecording/' + idExperiment;
