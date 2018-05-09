import noop from 'utils/noop';

// in milliseconds
const retryInterval = 100;
// retries will finish in ((retryInterval * maxRetries) / 1000) seconds.
const maxRetries = 75;

let retryCount = 0;
let timerId;
let nativeAppClientInstance;
let pendingQueue = [];

/**
 * A decorator function to ensure native-app instance before native-app APIs are invoked.
 * If native-app instance is not available yet, we enqueue our native-app API calls and
 * they will get dequeued once the native-app instance is available for API calls.
 * @param {Function} fn - native-app API which returns a promise
 * @returns {Promise<*>}
 */
function ensureNativeAppInstance(fn = noop) {
  return (...args) => new Promise((resolve) => {
    if (!nativeAppClientInstance) {
      // enqueue API calls
      pendingQueue.push(
        ensureNativeAppInstance(() => {
          resolve(fn.apply(this, args));
        })
      );
    } else {
      resolve(fn.apply(this, args));
    }
  });
}

/**
 * Gets called when the mobile app client was found in a global variable.
 * This function does a one time initialisation of the mobileApp global instance.
 */
function initNativeAppClient() {
  const appAPI = UQ_MOBILEAPP_PRESENT ? UQ_MOBILEAPP : GU_MOBILEAPP; // eslint-disable-line no-undef
  const baseUrl = UQ_MOBILEAPP_PRESENT ? 'uniqloapp://api' : 'gu-japan://api'; // eslint-disable-line no-undef

  const nativeAppClient = appAPI.MobileAppApiClient({
    baseUrl,
    iframeId: self === window.top ? null : 'some-iframe-id',
  });

  nativeAppClientInstance = appAPI.MobileAppApi(nativeAppClient); // eslint-disable-line no-undef

  // dequeue pending API calls
  if (nativeAppClientInstance && pendingQueue.length > 0) {
    pendingQueue.forEach(fn => fn());
    pendingQueue = [];
  }
}

/**
 * This function uses the global NativeApp client instance to pass on cart parameters used by the cnc pages.
 * This function is presently called when cart page is loaded, when user changes cart quantity
 * and when cart is removed (like on order confirmation page).
 * Cart parameters are in { cart_no, token, cart_num } format.
 * If cart is not present, set cart_num as 0 and leave out others.
 * @param {Object} cartParams cart parameters as a single object
 */
export const setNativeAppCart = ensureNativeAppInstance(
  (cartParams) => {
    if (nativeAppClientInstance.setCart) {
      nativeAppClientInstance.setCart({ ...cartParams }, noop);
    }
  }
);

/**
 * This function returns a promise that resolves with a falsy value or a store ID.
 * The value becomes falsy if the native app API is not active or if the user is not inside a store.
 *
 * @return {Promise}
 */
export const getStoreNumberFromStoreMode = ensureNativeAppInstance(
  () => new Promise((resolve) => {
    if (nativeAppClientInstance.getStoreNoInStoreMode) {
      nativeAppClientInstance.getStoreNoInStoreMode((response) => {
        let storeId = '';

        if (response.status === 200 && response.store_no) {
          storeId = response.store_no;
        }

        resolve(storeId);
      });
    }

    resolve('');
  })
);

/**
 * Checks whether Native-App ApplePay is available.
 * @param {Array} supportedNetworks
 * @returns {Promise<Boolean>}
 */
export const getNativeAppApplePayStatus = ensureNativeAppInstance(
  supportedNetworks => new Promise((resolve) => {
    nativeAppClientInstance.getCanMakePayments(
      { supportedNetworks },
      response => resolve(response && response.status === 200 && response.updated)
    );
  })
);

/**
 * WKWebView method to communicate from JavaScript to iOS
 * @param {String} callerName - name of the caller function
 * @param {Object} data
 */
export function sendDataToNativeApp(callerName, data) {
  if (UQ_MOBILEAPP_PRESENT) { // eslint-disable-line no-undef
    const msgHandler = webkit && webkit.messageHandlers[callerName]; // eslint-disable-line no-undef

    if (msgHandler && typeof msgHandler.postMessage === 'function') {
      msgHandler.postMessage(data);
    }
  } else if (GU_MOBILEAPP_PRESENT && nativeAppClientInstance && nativeAppClientInstance.postMessage) { // eslint-disable-line no-undef
    nativeAppClientInstance.postMessage(callerName, data);
  }
}

/**
 * @typedef {Object} ApplePayConfigObj
 * @property {String} merchantIdentifier
 * @property {String} countryCode
 * @property {String} currencyCode
 * @property {Array<String>} supportedNetworks
 * @property {Array<String>} merchantCapabilities
 * @property {Array<String>} requiredShippingAddressFields
 */

/**
 * Initiliaze ApplePaySession by supplying initial configuration data.
 * This method will present payment sheet to user.
 * @param {ApplePayConfigObj} config
 */
export const initNativeAppApplePay = ensureNativeAppInstance(
  (config) => {
    if (nativeAppClientInstance) {
      nativeAppClientInstance.presentPaymentSheet(config);
    }
  }
);

/**
 * Waits for the UQ_MOBILEAPP global variable to become avialable
 * and then initialises the mobile app module variable
 */
function waitAndLoad() {
  if (retryCount < maxRetries && typeof UQ_MOBILEAPP === 'undefined' && typeof GU_MOBILEAPP === 'undefined') { // eslint-disable-line no-undef
    retryCount++;
  } else {
    if (typeof UQ_MOBILEAPP !== 'undefined' || typeof GU_MOBILEAPP !== 'undefined') { // eslint-disable-line no-undef
      initNativeAppClient();
    }

    window.clearInterval(timerId);
  }
}

// native app detection when native_app=uqapp cookie is present
export function checkUQNativeApp() {
  return (typeof UQ_MOBILEAPP_PRESENT !== 'undefined' && UQ_MOBILEAPP_PRESENT); // eslint-disable-line no-undef
}

// native app detection when native_app=guapp cookie is present
export function checkGUNativeApp() {
  return (typeof GU_MOBILEAPP_PRESENT !== 'undefined' && GU_MOBILEAPP_PRESENT); // eslint-disable-line no-undef
}

if (checkUQNativeApp() || checkGUNativeApp()) {
  timerId = window.setInterval(waitAndLoad, retryInterval);
}
