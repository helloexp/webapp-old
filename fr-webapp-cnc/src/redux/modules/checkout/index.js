import config from 'config';
import { SessionStorage } from 'helpers/WebStorage';
import { getCurrentBrand } from 'utils/routing';

const { sessionStorageKeys: { checkoutStatus: checkoutStatusKey }, cookies } = config.app;
const RESET_CHECKOUT_SESSION = 'checkout/RESET_CHECKOUT_SESSION';
const REMOVE_CHECKOUT_SESSION = 'checkout/REMOVE_CHECKOUT_SESSION';

/**
 * Set brand specific checkout status in sessionStorage
 * @param {String} brand - Cart brand 'uq' or 'gu
 * @param {String} status - Checkout progress status
 * If user has chosen delivery type and reached upto payment page the
 * status would be 'delivery' and once he completes payment selection
 * to reach review order page the checkout status becomes 'payment'.
 */
export function setCheckoutStatus(status = '', brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const user = globalState.auth.user || {};
    const cartBrand = getCurrentBrand(globalState, brand);

    if (user.memberHash) {
      const sessionKey = `${user.memberHash}-${cartBrand}-${checkoutStatusKey}`;

      SessionStorage.setItem(sessionKey, status);
    }
  };
}

/**
 * Remove checkout status flag from sessionStorage.
 * Removal is done only if saved session belongs to the current user.
 * @param {String} brand - Cart brand 'uq' or 'gu
 */
export function removeCheckoutStatus(brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const user = globalState.auth.user || {};
    const cartBrand = getCurrentBrand(globalState, brand);
    const sessionKey = `${user.memberHash}-${cartBrand}-${checkoutStatusKey}`;

    SessionStorage.removeItem(sessionKey);
  };
}

/**
 * Get checkout progress status for the current user.
 * @param {String} brand - Cart brand 'uq' or 'gu
 * @param {String} globalState - Global redux state
 * @returns {String} checkout status 'delivery' or 'payment'
 */
export function getCheckoutStatus(globalState = {}, brand) {
  const user = globalState.auth.user || {};
  const cartBrand = getCurrentBrand(globalState, brand);
  const sessionKey = `${user.memberHash}-${cartBrand}-${checkoutStatusKey}`;

  return SessionStorage.getItem(sessionKey);
}

export function setCookieToResetCheckout(brand = 'uq') {
  return {
    type: RESET_CHECKOUT_SESSION,
    cookie: {
      domain: cookies.domain,
      key: `${brand}-${cookies.resetCheckoutSession}`,
      value: 1,
    },
  };
}

export function removeCookieToResetCheckout(brand = 'uq') {
  return {
    type: REMOVE_CHECKOUT_SESSION,
    cookie: {
      domain: cookies.domain,
      key: `${brand}-${cookies.resetCheckoutSession}`,
      remove: true,
    },
  };
}
