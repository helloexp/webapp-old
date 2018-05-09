/*
 * Event Delegate
 * Current concentration is on Window object alone
 * TODO: Think about extending this for all components
 */
import { scrollToTop } from './scroll';

// This constent will be used to add additional visibility region over top / bottom / left / right
// 0 in this value indicates the viewport is the load region.
const visibileRegion = 500;

const eventList = {};
const subscriptions = {};
const listenerStack = {};

/**
 * Target element for all event listeners. By default it is set to windows
 * All the events requested through subscribe will be attached to thes element.
 * Only one eventTarget is supported to have a single event listener.
 */
let eventTarget;
let contentHolder;
let rootAltered = false;

function unsubscribe(id) {
  const eventObj = listenerStack[id];

  if (eventObj) {
    const eventsArray = eventList[eventObj.name];

    if (eventsArray.indexOf(id) !== -1) {
      eventsArray.splice(eventsArray.indexOf(id), 1);

      delete listenerStack[id];

      if (!eventsArray.length) {
        eventTarget.removeEventListener(eventObj.name, handler); // eslint-disable-line no-use-before-define
        subscriptions[eventObj.name] = false;
      }
    }
  }
}

function handler(event) {
  const listeners = eventList[event.type];

  listeners.forEach((eventId) => {
    if (listenerStack[eventId]) {
      listenerStack[eventId].callback(event, ...listenerStack[eventId].args);

      const config = listenerStack[eventId] ? listenerStack[eventId].config : undefined;

      if (config && config.once) {
        unsubscribe(eventId);
      }
    } else {
      listeners.splice(listeners.indexOf(eventId), 1);
    }
  });
}

function subscribe(eventname, callback, config = {}) {
  const args = [...arguments]; // eslint-disable-line prefer-rest-params

  if (!eventname || !callback || typeof callback !== 'function') return null;

  const listeners = eventList[eventname] = eventList[eventname] || [];
  const eventObj = {
    id: Date.now(),
    callback,
    name: eventname,
    args: args.splice(3),
    config,
  };

  listeners.push(eventObj.id);
  listenerStack[eventObj.id] = eventObj;

  if (!subscriptions[eventname]) {
    eventTarget.addEventListener(eventname, handler);
    subscriptions[eventname] = true;
  }

  return eventObj.id;
}

// logic for visibility is taken from react-component-visibility
// Ref: https://github.com/Pomax/react-component-visibility/blob/master/index.js#L30
// Update:
//   * border check for element from strict '=' to '<='.
//   * load region from configuration
function isvisible(elem, flag, parent) {
  if (!elem) {
    return false;
  }
  const container = parent || eventTarget;
  const rect = elem.getBoundingClientRect();
  let containerHeight = container.innerHeight;
  let containerWidth = container.innerWidth;
  let containerTop = 0;
  let containerLeft = 0;
  const currentVisibleRegion = flag ? 0 : visibileRegion;

  /**
   * when the route is altered the element may not provide innerWidth & innerHeight
   */
  if (rootAltered) {
    const containerRect = container.getBoundingClientRect();

    containerHeight = containerRect.bottom;
    containerWidth = containerRect.right;
    containerTop = containerRect.top;
    containerLeft = containerRect.left;
  }

  // decision on load region
  const loadScreen = {
    right: containerWidth + currentVisibleRegion,
    bottom: containerHeight + currentVisibleRegion,
    top: containerTop - currentVisibleRegion,
    left: containerLeft - currentVisibleRegion,
  };
  // are we vertically visible?
  // top || bottom
  const verticallyVisible = (loadScreen.top <= rect.top && rect.top < loadScreen.bottom) ||
    (loadScreen.top < rect.bottom && rect.bottom <= loadScreen.bottom);

  // also, are we horizontally visible?
  // left || right
  const horizontallyVisible = (loadScreen.left <= rect.left && rect.left < loadScreen.right) ||
    (loadScreen.left < rect.right && rect.right <= loadScreen.right);

  // we're only visible if both of those are true.
  return horizontallyVisible && verticallyVisible;
}

function register(root) {
  if (root) {
    const events = Object.keys(subscriptions);

    if (events.length) {
      events.forEach((item) => {
        root.addEventListener(item, handler);
        eventTarget.removeEventListener(item, handler);
      });
    }

    eventTarget = contentHolder = root;
    rootAltered = true;
  }
}

function getContentScroll() {
  return contentHolder.scrollTop;
}

function performScroll(toPosition, duration) {
  scrollToTop(contentHolder, toPosition, duration);
}

const events = {
  subscribe,
  unsubscribe,
  isvisible,
  scrollToTop: performScroll,
  register,
  getContentScroll,
};

eventTarget = window;
contentHolder = document.body;

export default events;
