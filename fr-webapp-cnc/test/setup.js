import { jsdom } from 'jsdom';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import icepick from 'icepick';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

function createLocalStorage() {
  const storage = {};

  return {
    getItem: key => storage[key],
    setItem: (key, item) => {
      storage[key] = item;
    },
    removeItem: (key) => {
      delete storage[key];
    },
  };
}

const doc = jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

chai.use(sinonChai);
chai.use(chaiAsPromised);

global.self = global;
global.icepick = icepick;
global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
global.shallow = shallow;
global.mount = mount;
global.__DEVELOPMENT__ = true;
global.__CLIENT__ = true;
global.__DEVTOOLS__ = false;
global.document = doc;
global.window = win;
global.localStorage = createLocalStorage();

((window) => {
  for (const key in window) {
    if (window.hasOwnProperty(key)) {
      if (!(key in global)) {
        global[key] = window[key];
      }
    }
  }
})(win);

Object.defineProperty(location, 'protocol', {
  value: 'https:',
  writable: false,
});

global.window.ApplePaySession = {
  supportsVersion() {
    return true;
  },
  canMakePayments() {
    return true;
  },
};

global.navigator = {
  userAgent: 'node.js',
};

if (process.argv.includes('headless')) {
  global.testHelpers = require('./testHelpers'); // eslint-disable-line global-require
  global.WithContext = require('./testHelpers/WithContext'); // eslint-disable-line global-require
}
