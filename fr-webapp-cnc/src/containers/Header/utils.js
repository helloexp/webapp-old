import { createSelector } from 'reselect';
import { prependRoot, getCurrentHost } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import createBranchedSelector from 'utils/branchedSelector';
import getSiteConfig from 'config/site';
import { getBrand } from 'redux/modules/cart/selectors';
import { getRoutingPathName } from 'redux/modules/selectors';

import uqLogo from 'images/logo-uq.svg';
import guLogo from 'images/logo-gu.svg';
import uqguLogo from 'images/logo-uqgu.svg';
import uqHeaderLogo from 'images/header-logo-e.png';
/**
 * Header types
 * @export
 * @readonly
 * @enum {string}
 * @constant
 */
export const headerTypes = {
  A: 'Uniqlo Logo',
  B: 'Uniqlo&GU Logo',
  C: 'No Header',
  D: 'GU Logo',
};

/**
 * Header brands
 * @export
 * @readonly
 * @enum {string}
 * @constant
 */
export const headerBrands = {
  uq: 'uq',
  gu: 'gu',
};

/**
 * A: L1, Checkout(UQ brand), Membership, My Size, Purchase history, Wish List, Visual Search,
 * Store Locator, Keyword Search
 */
function isHeaderOfTypeA(path, brand) {
  // TODO: Add missed urls
  return (brand === headerBrands.uq && (
      path.includes(prependRoot(routes.checkout))
    )) ||
    path.includes(prependRoot('mysize'));
}

/**
 * B:  Shopping bag(both brands), Login, Temporary Account Registration, New Account Registration, Members Information, Edit Member Information,
 * Release the connection of Member's Information, Withdrawal, Shipping Address Book, Credit Card, Password Edit,
 * Reset Password, Order History
 */
function isHeaderOfTypeB(path) {
  // TODO: Add missed urls
  return path.includes(prependRoot('account')) ||
    path.includes(prependRoot(routes.cart)) ||
    path.includes(prependRoot(routes.orderHistory));
}

/**
 * C: L2, L3, L4, Editorial Pages, Inventory Search, Write a Review, Add to Cart, Outfit view, Filter
 */
function isHeaderOfTypeC(path) {
  // TODO: Add missed urls
  return path.includes(prependRoot(routes.addToCart));
}

/**
 * D: Checkout(GU brand)
 */
function isHeaderOfTypeD(path, brand) {
  return brand === headerBrands.gu && (
      path.includes(prependRoot(routes.checkout))
    );
}

/**
 * Header Logo changes depending on logo and page path.
 * Using these two in branchedSelector diff check gives us maximum cache liverage.
 */
const headerTypeKey = createSelector(
  [getRoutingPathName, getBrand],
  (path, brand) => path.replace(/(\?.*)?$/, `?brand=${brand}`)
);

/**
 * Get header type based on current page
 * https://frit.rickcloud.jp/wiki/display/TEST/ID:+SPA-A+%7C+Header+JP
 * A: L1, Shopping bag (UQ brand), Checkout(UQ brand), Membership, My Size, Purchase history, Wish List, Visual Search,
 * Store Locator, Keyword Search
 * B: Login, Temporary Account Registration, New Account Registration, Members Information, Edit Member Information,
 * Release the connection of Member's Information, Withdrawal, Shipping Address Book, Credit Card, Password Edit,
 * Reset Password, Order History
 * C: L2, L3, L4, Editorial Pages, Inventory Search, Write a Review, Add to Cart, Outfit view, Filter
 * D: Shopping bag(GU brand), Checkout(GU brand)
 * @param {Object} state - redux global state
 * @returns {string}
 */
export const getHeaderType = createBranchedSelector(
  'getHeaderType',
  headerTypeKey,
  () => createSelector(
    [getRoutingPathName, getBrand],
    (path, brand) => {
      if (isHeaderOfTypeA(path, brand)) {
        return headerTypes.A;
      } else if (isHeaderOfTypeB(path, brand)) {
        return headerTypes.B;
      } else if (isHeaderOfTypeC(path, brand)) {
        return headerTypes.C;
      } else if (isHeaderOfTypeD(path, brand)) {
        return headerTypes.D;
      }

      return headerTypes.C;
    }
  )
);

/**
 * Check if whole header section should be shown
 * @param {Object} state - redux global state
 * @returns {boolean}
 */
export const isHeaderShown = createBranchedSelector(
  'isHeaderShown',
  headerTypeKey,
  () => createSelector(
    [getHeaderType],
    headerType => headerType !== headerTypes.C
  )
);

/**
 * Check if GU logo should be shown
 * @param {Object} state - redux global state
 * @returns {boolean}
 */
export const isGULogo = createBranchedSelector(
  'isGULogo',
  headerTypeKey,
  () => createSelector(
    [getHeaderType],
    headerType => headerType === headerTypes.D
  )
);

/**
 * Get header logo image depending on current page
 * @param {Object} state - redux global state
 * @returns {string}
 */
export const getHeaderLogoImage = createBranchedSelector(
  'getHeaderLogoImage',
  headerTypeKey,
  () => createSelector(
    [getHeaderType],
    (headerType) => {
      if (headerType === headerTypes.A) {
        return uqLogo;
      } else if (headerType === headerTypes.B) {
        return uqHeaderLogo;
      } else if (headerType === headerTypes.D) {
        return guLogo;
      }

      return uqguLogo;
    }
  )
);

/**
 * Get header GU logo image depending on current page
 * @param {Object} state - redux global state
 * @returns {string}
 */
export const getGuHeaderLogo = createBranchedSelector(
  'getGuHeaderLogo',
  headerTypeKey,
  () => createSelector(
    [getHeaderType],
    (headerType) => {
      if (headerType === headerTypes.B) {
        return guLogo;
      }

      return null;
    }
  )
);

/**
 * Get links for the header logo images depending on current page
 * @param {Object} state - redux global state
 * @returns {Object}
 */
export const getHeaderLogoLinks = createBranchedSelector(
  'getHeaderLogoLinks',
  headerTypeKey,
  () => createSelector(
    [getHeaderType],
    (headerType) => {
      const { UQ_LINK_TO_TOP_PAGE, GU_LINK_TO_TOP_PAGE } = getSiteConfig();
      const logoLinks = { firstLogoLink: UQ_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(true)), secondLogoLink: '' };

      if (headerType === headerTypes.B) {
        logoLinks.secondLogoLink = GU_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(false, 'gu'));
      } else if (headerType === headerTypes.D) {
        logoLinks.firstLogoLink = GU_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(false, 'gu'));
      }

      return logoLinks;
    }
  )
);
