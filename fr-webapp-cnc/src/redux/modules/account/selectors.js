import { createSelector } from 'reselect';
import { getRoutingQuery } from 'redux/modules/selectors';
import { isUniqlo, getCart, getCheckoutBrand } from 'redux/modules/cart/selectors';
import { getOrder } from 'redux/modules/checkout/order/selectors';
import { getDefaultAddress } from 'redux/modules/checkout/delivery/selectors';
import { checkIfApplePayGuestUserInConfirmPage } from 'utils/applePay';
import { routePatterns } from 'utils/urlPatterns';
import AppConfig from 'config';

const { sensitive } = AppConfig.app;

export const getUser = state => state.auth.user;

export const getSavedAddress = state => state.address.address;

export const isLinkedAccount = state => state.address.hasLinkedAccount;

export const isLinkageStatusLoaded = state => state.address && state.address.isLinkageStatusLoaded;

export const getDefaultAddressForMember = createSelector(
  [getDefaultAddress, getSavedAddress],
  (defaultAddress, address) => ({ ...defaultAddress, ...address })
);

export const getAccountActiveTab = createSelector(
    [isUniqlo],
    isUniqloBrand => (isUniqloBrand ? 0 : 1)
);

/**
 * In order to go through the checkout process, it's required to have a cart (number + brand).
 */
export const isCartNotDefined = createSelector(
  [getRoutingQuery, getOrder, getCart, getCheckoutBrand],
  (query, order, cart, checkoutBrand) => (
    (query.from !== 'cart') &&
    !(cart.cartNumber && checkoutBrand)
  )
);

/**
 * Check if the route (passed in props) is confirm order page
 * and also if order info exists.
 */
export const isConfirmOrderPageWithOrder = createSelector(
  [getOrder, (state, props) => props.path],
  (order, path) => (
    order.orderList &&
    order.orderList.length &&
    routePatterns.confirmOrder.test(path)
  ),
);

/**
 * Checks if we need to to force login when visiting a sensitive page.
 */
export const shouldForceLogin = createSelector(
  [getUser, (state, props) => props.path],
  (user, path) => {
    // Guest users can place orders using Apple-Pay.
    // User need not be redirected to login in this case, even thoush order-confirmation is a sensitive page
    const isSensitive = sensitive.pages.find(pattern => pattern.test(path)) && !checkIfApplePayGuestUserInConfirmPage(path);
    const authTime = user ? user.authTime * 1000 : 0;

    if (isSensitive) {
      const now = new Date();
      const initialTime = new Date(authTime);

      return now - initialTime > sensitive.timeToForceLogin;
    }

    return isSensitive;
  }
);

/**
 * This selector checks the time on the token to force login, we use it to check
 * if the auth is valid before making any fetch request on the client middleware.
 */
export function isLoginCookieInValid(state, { path } = {}) {
  const user = getUser(state);
  // Guest users can place orders using Apple-Pay.
  // User need not be redirected to login in this case, even thoush order-confirmation is a sensitive page
  const isSensitive = sensitive.pages.find(pattern => pattern.test(path)) && !checkIfApplePayGuestUserInConfirmPage(path);
  const authTime = user ? ~~user.authTime * 1000 : 0;

  if (!path || isSensitive) {
    const now = new Date();
    const initialTime = new Date(authTime);

    return now - initialTime > sensitive.timeToForceLogin;
  }

  return isSensitive;
}
