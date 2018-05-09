import { isAnalyticsDisabledRoute } from 'utils/routing';

let instance;

const hitType = {
  PAGE_VIEW: 'pageview',
  SCREEN_VIEW: 'screenview',
  EVENT: 'event',
  SOCIAL: 'social',
  EXCEPTION: 'exception',
  TIMING: 'timing',
};

function getTypeDefinion(type) {
  switch (type) {
    case hitType.PAGE_VIEW:
      return {
        fields: ['page', 'title', 'location'],
        required: ['page'],
      };
    case hitType.SCREEN_VIEW:
      return {
        fields: ['screenName', 'appName', 'appId', 'appVersion', 'appInstallerId'],
        required: ['screenName'],
      };
    case hitType.EVENT:
      return {
        fields: ['eventCategory', 'eventAction', 'eventLabel', 'eventValue'],
        required: ['eventCategory', 'eventAction'],
        eventValue: 'number',
      };
    case hitType.SOCIAL:
      return {
        fields: ['socialNetwork', 'socialAction', 'socialTarget'],
        required: ['socialNetwork', 'socialAction', 'socialTarget'],
      };
    case hitType.EXCEPTION:
      return {
        fields: ['exDescription', 'exFatal'],
        required: [],
        exFatal: 'boolean',
      };
    case hitType.TIMING:
      return {
        fields: ['timingCategory', 'timingVar', 'timingValue', 'timingLabel'],
        required: ['timingCategory', 'timingVar', 'timingValue'],
        timingValue: 'number',
      };
    default:
      return null;
  }
}

function init(trackerId, appName, domain = 'none') {
  // Initialization script
  if (!instance && !isAnalyticsDisabledRoute()) {
    window.ga = window.ga || function gaPolyfill(...rest) {
      (ga.q = ga.q || []).push(...rest);
    };

    ga.l = +new Date; // eslint-disable-line new-parens
    ga('create', trackerId, 'auto', { appName, cookieDomain: domain });

    const script = document.createElement('script');

    script.src = 'https://www.google-analytics.com/analytics.js';
    script.async = 1;
    script.id = appName;

    document.body.appendChild(script);

    instance = true;
  }
}

function track(...args) {
  if (!isAnalyticsDisabledRoute()) {
    const tracker = {};
    let invalid = false;
    const type = args.shift();
    const typeDef = getTypeDefinion(type);
    const { required, fields } = typeDef;

    if (typeof args[0] === 'object') {
      Object.assign(tracker, args[0]);
      Object.values(required).forEach((fieldName) => {
        if (!tracker[fieldName]) {
          invalid = true;
        }
      });
    } else {
      args.forEach((value, index) => {
        const fieldName = fields[index];

        tracker[fieldName] = value;

        if (typeDef[fieldName] && typeof value !== typeDef[fieldName]) { // eslint-disable-line valid-typeof
          invalid = true;
        }
      });
    }

    tracker.hitType = type;

    if (!invalid) {
      ga('send', tracker);
    }
  }
}

const ganalytics = {
  init,
  track,
};

export {
  hitType,
  getTypeDefinion,
};

export default ganalytics;
