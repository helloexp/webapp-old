/* eslint-disable react/jsx-sort-props */
import React from 'react';
import reactCookie from 'react-cookie';
import ClientStorage from 'utils/clientStorage';
import { routes, routePatterns } from 'utils/urlPatterns';
import { prependRoot, getCurrentBrand, getUrlWithQueryData, isSecuredConnection, redirectToProtocol } from 'utils/routing';
import { Route, IndexRedirect } from 'react-router';
import { parseRouteRenderRules } from 'helpers/ShouldRender';
import { loadAppCookies } from 'helpers/AppCookies';
import { App, NotFound } from 'containers';
import { isCartNotDefined, shouldForceLogin, isConfirmOrderPageWithOrder } from 'redux/modules/account/selectors';
import {
  forceLogin,
  isAuthenticated,
  isLoaded as isAuthLoaded,
  load as loadAuth,
  saveAndRedirectToLogin,
  fixHttpsLocalStorageIssues,
} from 'redux/modules/account/auth';
import { checkIfApplePayGuestUserInConfirmPage } from 'utils/applePay';
import { getPublicRoutes, getAuthenticatedRoutes } from './appRoutes';
import config from '../config';
import { regions, brandName } from '../config/site/default';

const { localStorageKeys, cookies } = config.app;
const checkoutRegexp = /\/checkout\/./;

/**
 * why it was done:
 * If the order is not successful, bluegate redirects user to payment page (jp/checkout/payment) which is UQ payment,
 * since brand is UQ by default.
 * We check the brand in cof and attaches the correct brand param in query and redirect the user to checkout/payment?brand=gu.
 * This is done in payment page initialise.
 * In certain cases, before this action, the cart defined check in requireLogin() happens and user is taken to uq cart page.
 *
 * what this does:
 * shouldRedirectToGuPayment() is used to skip the redirection to cart page by checking the conditions of the above mentioned redirection,
 * ie (to payment page, during GU checkout, brand is not present in query param)
 */
function shouldRedirectToGuPayment(query, cart, nextPath) {
  const brandPresent = query && query.brand && [brandName.uq, brandName.gu].includes(query.brand);
  const checkoutBrand = reactCookie.load(cookies.checkoutKey) || brandName.uq;
  const isCartDefined = (query && query.from !== 'cart') && cart[checkoutBrand] && cart[checkoutBrand].cartNumber;

  return (!brandPresent && checkoutBrand === brandName.gu && routePatterns.payment.test(nextPath) && isCartDefined);
}

// TODO: This fails randomly as of now.
function autoFixRouteLocale(prevState, nextState, replace) {
  const prev = prevState.params;
  const next = nextState.params;

  if (prev.region !== next.region) {
    const slash = next.splat[0] === '/' ? '' : '/';

    replace(`/${prev.region}${slash}${next.splat}`);
  }
}

// save token here to prevent roundtrips
let cachedToken;

// We need the `request` to get token from the cookies
// it will be used only on the server side.
export default (store, req, res) => {
  const onRootRouteEnter = (nextState, replace, cb) => {
    // Check if the current route requires https or http
    if (!__DEVELOPMENT__) {
      const nextPath = nextState.location.pathname;
      const path = nextPath + nextState.location.search;
      const isLoginPage = routePatterns.login.test(nextPath);
      const isSecured = isSecuredConnection();

      // if is not login page, we need to force https
      if (!isSecured && !isLoginPage) {
        return redirectToProtocol('https', path);
      }
    }

    // initialize isomorphic cookies
    if (req && res) {
      reactCookie.plugToRequest(req, res);
    }

    // Load all the cookies we need in tha app
    loadAppCookies(store);

    // parse route render rules
    parseRouteRenderRules(nextState);

    // USERDIVE - SPA URL changed
    if (typeof ud === 'function') {
      ud('changeVirtualUrl', window.location.toString());  // eslint-disable-line no-undef
    }

    return cb();
  };

  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const globalState = store.getState();
      const { auth: { user }, cart } = globalState;
      const { pathname: nextPath, query, search } = nextState.location;
      const brand = getCurrentBrand(globalState);

      // guest users can place orders using apple-pay
      // they will be shown some details about the order in order confirmation page
      // user need not be redirected to login in this case
      if (!checkIfApplePayGuestUserInConfirmPage(nextPath)) {
        if (!isAuthenticated(user)) {
          // the path from next state should contain the query params also
          const path = nextPath.substring(4) + search;

          // oops, not logged in, so can't be here!
          return store.dispatch(saveAndRedirectToLogin(path));
        }

        // globalState.auth.user will be null if the user token was not detected.
        if (!globalState.auth.user) {
          return store.dispatch(forceLogin(nextPath + search, true));
        }

        if (shouldForceLogin(globalState, { path: nextPath })) {
          return store.dispatch(forceLogin(nextPath + search));
        }
      }

      if (
        checkoutRegexp.test(nextPath) &&
        isCartNotDefined(globalState) &&
        !isConfirmOrderPageWithOrder(globalState, { path: nextPath }) &&
        !shouldRedirectToGuPayment(query, cart, nextPath)
      ) {
        replace(prependRoot(getUrlWithQueryData(routes.cart, { brand })));
      }

      return cb();
    }

    new Promise(
      (resolve) => {
        if (cachedToken) {
          return resolve(cachedToken);
        }

        ClientStorage
          .get(localStorageKeys.authStorage)
          .then((token) => {
            resolve(token);
          });

        return 1;
      }
    )
    .then(token => store.dispatch(fixHttpsLocalStorageIssues(token)))
    .then((token) => {
      // cache fixed token
      cachedToken = token;

      if (token && !isAuthLoaded(store.getState())) {
        store.dispatch(loadAuth()).then(checkAuth);
      } else {
        checkAuth();
      }
    });
  };

  const regionLanguageRoutes = (
    <Route path="/:region" component={App} name="app" onEnter={onRootRouteEnter}>
      <Route onEnter={requireLogin}>
        {getAuthenticatedRoutes(store)}
      </Route>

      {getPublicRoutes(store)}
    </Route>
  );

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" onChange={autoFixRouteLocale}>

      <Route
        path=""
        getChildRoutes={(partialNextState, cb) => {
          // check if the location starts with a valid path prefix.
          const location = partialNextState.location;
          const pathValid = regions.reduce((previousValue, currentValue) => previousValue || location.pathname.indexOf(currentValue.value) === 0, false);

          cb(null, pathValid ? regionLanguageRoutes : []);
        }}
      />

      <Route path="*" component={NotFound} status={404} />

      <IndexRedirect to="/jp/" />
    </Route>
  );
};
