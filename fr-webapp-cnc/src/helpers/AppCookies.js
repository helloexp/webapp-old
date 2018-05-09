import reactCookie from 'react-cookie';
import config from 'config';
import { prependRoot, getUrlWithQueryData, getCurrentBrand } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { setGDSSession, setRedirectUrl, setLoginStatusFromCookie } from 'redux/modules/account/auth';
import {
  isCreated as isCartCreated,
  setCartNumber,
  isCheckoutCookieLoaded,
  getCheckout,
} from 'redux/modules/cart';
import { isOrderLoaded, setOrderNumber } from 'redux/modules/checkout/order';
import { setCartMergerRevival, isPageToShowCMR } from 'redux/modules/app';
import { MATCH_BRAND } from 'helpers/regex';

const { cookies } = config.app;

export function loadAppCookies(store) {
  const globalState = store.getState();

  // Load cmr cookie to state
  const cmr = reactCookie.load(cookies.cartCMRCookie);

  // If there's a redirect cookie, set it to state
  const redirectPath = reactCookie.load(cookies.redirectCookie);

  if (cmr) {
    store.dispatch(setCartMergerRevival(cmr));
  }

  if (redirectPath) {
    const brand = redirectPath.match(MATCH_BRAND) ? redirectPath.match(MATCH_BRAND)[1] : getCurrentBrand(globalState);
    const path = cmr && isPageToShowCMR(redirectPath)
      ? prependRoot(getUrlWithQueryData(routes.cart, { brand }))
      : redirectPath;

    store.dispatch(setRedirectUrl(path));
  }

  // set the GDS session to state, this is neccesary to make
  // sure to redirect the user only when login proccess is completed.
  const gdsSession = reactCookie.load(cookies.gdsCookie);

  if (gdsSession) {
    store.dispatch(setGDSSession(gdsSession));
  }

  // Load UQ cookies to state
  if (!isCartCreated(globalState, 'uq')) {
    const uqCartNumber = reactCookie.load(cookies.cartNumberUqCookie);

    if (uqCartNumber) {
      store.dispatch(setCartNumber('uq'));
    }
  }

  // Load GU cookies to state
  if (!isCartCreated(globalState, 'gu')) {
    const guCartNumber = reactCookie.load(cookies.cartNumberGuCookie);

    if (guCartNumber) {
      store.dispatch(setCartNumber('gu'));
    }
  }

  // Load order cookie to state
  if (!isOrderLoaded(globalState)) {
    const orderNumber = reactCookie.load(cookies.orderCookie);

    if (orderNumber) {
      store.dispatch(setOrderNumber());
    }
  }

  if (!isCheckoutCookieLoaded(globalState)) {
    store.dispatch(getCheckout());
  }

  // Check if the user is logged or not
  store.dispatch(setLoginStatusFromCookie());
}
