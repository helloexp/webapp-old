import { createSelector } from 'reselect';
import { prependRoot } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { brandName } from 'config/site/default';
import { getBrand, isCartEmpty } from 'redux/modules/cart/selectors';
import { getRoutingPathName } from 'redux/modules/selectors';

/**
 * Footer types
 * @export
 * @readonly
 * @enum {string}
 * @constant
 */
export const footerTypes = {
  A: 'Uniqlo Footer',
  B: 'Uniqlo Copyright',
  C: 'Uniqlo&GU Copyright',
  D: 'Uniqlo&GU Common Footer',
  E: 'Including Global Nav Menu',
  F: 'No Footer',
};

/**
 * Get footer type based on current page
 * A: L1, L2, L3, L4, Inventory Search, Shopping bag, Outfit view, My Size, Purchase history, Wishlist, Keyword Search
 * B: Editorial Pages, Write a Review, Checkout, Membership(Coupon), Store Locater, Styling Book
 * C: Login, Temporary Account Registration, New Account Registration, Withdrawal, Shipping Address Book, Credit Card, Password Edit, Reset Password
 * D: Members Information, Edit Member Information, Order history
 * E: Visual Search
 * F: Add to Cart, Release the connection of Member's Information, Filter
 * @param {Object} state - redux global state
 * @returns {string}
 */
export const getFooterType = createSelector(
  [getRoutingPathName],
  (path) => {
    if (
      path.includes(prependRoot(routes.cart)) ||
      path.includes(prependRoot('mysize')) ||
      path === prependRoot(routes.memberInfo)
    ) {
      return footerTypes.A;
    } else if (path.includes(prependRoot(routes.checkout)) || path.includes(prependRoot(routes.membershipCoupon))) {
      return footerTypes.B;
    } else if (path.includes(prependRoot(routes.creditCard))) {
      return footerTypes.C;
    } else if (path.includes(prependRoot(routes.memberInfo))) {
      return footerTypes.D;
    }

    return footerTypes.F;
  });

/**
 * Check if whole footer section should be shown
 * @param {Object} state - redux global state
 * @returns {boolean}
 */
export const isFooterShown = createSelector(
  [getFooterType],
  footerType => footerType !== footerTypes.F);

/**
 * Check if brand tabs should be shown
 * @param {Object} state - redux global state
 * @returns {boolean}
 */
export const isBrandTabsShown = createSelector(
  [getFooterType],
  footerType => footerType === footerTypes.D);

/**
 * Check if links section should be shown
 * @param {Object} state - redux global state
 * @returns {boolean}
 */
export const isLinksSectionShown = createSelector(
  [getFooterType],
  footerType => (footerType === footerTypes.A || footerType === footerTypes.D || footerType === footerTypes.E));

/**
 * Check if bold border at the top of links section should be shown
 * @param {Object} state - redux global state
 * @returns {boolean}
 */
export const isLinksTopBorderShown = createSelector(
  [getFooterType],
  footerType => footerType === footerTypes.A);

/**
 * Check if padding below footer should be shown
 * This padding is needed for copyright section not been overlapped by sticky total section
 * @param {Object} state - redux global state
 * @returns {boolean}
 */
export const isBottomPaddingAdded = createSelector(
  [getRoutingPathName, isCartEmpty],
  (path, cartIsEmpty) =>
    path.includes(prependRoot(routes.cart)) && !cartIsEmpty);

/**
 * Returns array of brands for copyright text
 * @param {Object} state - redux global state
 * @returns {Array<string>}
 */
export const getCopyrightBrands = createSelector(
  [getFooterType, getBrand],
  (footerType, brand) =>
    (footerType === footerTypes.C
      ? [brandName.uq, brandName.gu]
      : [brand]));
