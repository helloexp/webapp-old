import formurlencoded from 'form-urlencoded';
import reactCookie from 'react-cookie';
import AppConfig from 'config';
import defaultConfig from 'config/site/default';
import { accountApi, cartApi, userInfoApi, apiTypes } from 'config/api';
import { removeCartCookie, getCart, removeCheckout } from 'redux/modules/cart';
import { removeCheckoutStatus, setCookieToResetCheckout } from 'redux/modules/checkout';
import { removeApplePayCookie } from 'redux/modules/applePay';
import { removeOrderCookie } from 'redux/modules/checkout/order';
import { resetNextDayDeliveryDontCareFlag } from 'redux/modules/checkout/delivery';
import { getRoutingPathName, getRoutingSearch } from 'redux/modules/selectors';
import logger from 'utils/logger';
import { getCurrentBrand, goHome, root } from 'utils/routing';
import { getBaseUrl, getOAuthUrl } from 'utils/authUtils';
import { routes } from 'utils/urlPatterns';
import ClientStorage from 'utils/clientStorage';
import { setNativeAppCart } from 'helpers/NativeAppHelper';
import { getUser, decodeMemberData } from './mappings/authMappings';

logger.enable();

const { cookies, localStorageKeys, sensitive } = AppConfig.app;

const LOAD = 'auth/LOAD';
const LOAD_SUCCESS = 'auth/LOAD_SUCCESS';
const LOAD_FAIL = 'auth/LOAD_FAIL';

export const LOGIN = 'auth/LOGIN';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAIL = 'auth/LOGIN_FAIL';

export const SAVE_TOKEN = 'auth/SAVE_TOKEN';
export const SET_TOKEN = 'auth/SET_TOKEN';
export const SET_LOGIN_STATUS = 'auth/SET_LOGIN_STATUS';

export const SET_REDIRECT = 'auth/SET_REDIRECT';
export const SAVE_REDIRECT = 'auth/SAVE_REDIRECT';
export const REDIRECT_FROM_LOGIN = 'auth/REDIRECT_FROM_LOGIN';
export const REDIRECT_FROM_LOGOUT = 'auth/REDIRECT_FROM_LOGOUT';
export const REDIRECT_TO_LOGIN = 'auth/REDIRECT_TO_LOGIN';
export const REDIRECT_TO_GDS = 'auth/REDIRECT_TO_GDS';
export const REDIRECT_TO_CART = 'auth/REDIRECT_TO_CART';

export const PREPARE_LOGIN = 'auth/PREPARE_LOGIN';
export const PREPARE_LOGIN_SUCCESS = 'auth/PREPARE_LOGIN_S';
export const PREPARE_LOGIN_FAILURE = 'auth/PREPARE_LOGIN_F';

export const LOGOUT = 'auth/LOGOUT';
export const SET_GDS_SESSION = 'auth/SET_GDS_SESSION';
export const SAVE_DISPSITE_SESSION = 'auth/SAVE_DISPSITE_SESSION';
export const CHECK_SENSITIVE = 'auth/CHECK_SENSITIVE';
export const SHOW_FORM = 'auth/SHOW_FORM';
const CONFIRM_LOGOUT = 'auth/CONFIRM_LOGOUT';

export const SET_LOGIN_SUPPORT_STATUS = 'auth/SET_LOGIN_SUPPORT_STATUS';
export const GET_LOGIN_SUPPORT_STATUS = 'auth/GET_LOGIN_SUPPORT_STATUS';

const initialState = {
  gdsSession: null,
  isLoading: true,
  redirectUrl: null,
  user: null,
  showLogoutConfirm: false,
};

export default function reducer(state = initialState, action = {}) {
  let response;

  switch (action.type) {
    case LOAD_SUCCESS:
      // Getting data from API response
      const user = getUser(action.result);

      return {
        ...state,
        user: {
          ...state.user,
          ...user,
        },
      };
    case SAVE_TOKEN:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.localStorageValue,
        },
      };
    case SET_TOKEN:
      // if ACPF OP.LGN cookie is present and local storage has value as well, check if they match.
      // local storage without memberHash is definitely outdated
      if (action.cookie.value && action.localStorageValue) {
        const now = new Date();
        const initialTime = new Date(action.localStorageValue.authTime * 1000);
        const shouldIgnoreToken = !action.localStorageValue.memberHash
          || action.localStorageValue.memberHash !== action.cookie.value
          || now - initialTime > sensitive.timeToForceLogin;

        if (shouldIgnoreToken) {
          ClientStorage.remove(localStorageKeys.authStorage);

          return state;
        }
      }

      return {
        ...state,
        user: {
          ...state.user,
          ...action.localStorageValue,
        },
      };
    case SET_LOGIN_STATUS:
      return {
        ...state,
        user: {
          ...state.user,
          loginStatus: !!action.cookie.value,
        },
      };
    case LOGIN_SUCCESS:
      response = action.result;

      if (response.id_token) {
        const data = decodeMemberData(response);

        return {
          ...state,
          user: {
            gdsSession: state.user.gdsSession,
            accessToken: response.access_token,
            authTime: data.auth_time,
            tokenExpiresIn: response.expires_in,
            memberId: data.gdsmemberid.UQ,
          },
        };
      }

      // If there's not id_token in the response, it means
      // the user is already logged in and we should keep the current token
      return state;
    case CONFIRM_LOGOUT:
      return {
        ...state,
        showLogoutConfirm: action.show,
      };
    case SET_GDS_SESSION:
      return {
        ...state,
        user: {
          ...state.user,
          gdsSession: action.gdsSession,
        },
      };
    case LOGOUT:
      return {
        ...initialState,
        loginSupportStatus: state.loginSupportStatus,
      };
    case SHOW_FORM:
      return {
        ...state,
        isLoading: false,
      };
    case PREPARE_LOGIN_FAILURE:
    case LOGIN_FAIL:
      logger.error(action);

      return {
        ...state,
        error: action.error,
        // isLoading: false,
      };
    case SET_REDIRECT:
      return {
        ...state,
        redirectUrl: action.url,
      };
    case PREPARE_LOGIN:
    case LOGIN:
      return {
        ...state,
        isLoading: true,
      };
    case SET_LOGIN_SUPPORT_STATUS:
    case GET_LOGIN_SUPPORT_STATUS:
      return {
        ...state,
        loginSupportStatus: action.cookie.value === '1',
      };
    default:
      return state;
  }
}

const promiseConfig = {
  host: `${accountApi.base}/${accountApi.brand}/${accountApi.region}`,
  putHost: `${accountApi.putBase}/${accountApi.brand}/${accountApi.region}`,
  credentials: 'include',
  headers: {
    'Content-Type': 'text/plain',
  },
};

// To check authentication
export function isAuthenticated(user) {
  return user && user.accessToken && user.gdsSession;
}

export function getAuthenticated(state) { return !!isAuthenticated(state.auth.user); }

// To check OP.LGN cookie status
export function isLoggedIn(user) {
  return user && user.loginStatus;
}

export const getLoginStatus = state => !!isLoggedIn(state.auth.user) || getAuthenticated(state);

export function isLoaded(globalState) {
  const { auth } = globalState;
  // User is fully loaded if there's an access token and gds session

  return auth && auth.user && auth.user.accessToken && auth.user.gdsSession;
}

export function getAccessToken(globalState) {
  return globalState.auth && globalState.auth.user && globalState.auth.user.accessToken;
}

export function getLoginUrl(config) {
  const { opBaseUrl, auth, clientId } = config;
  const url = getOAuthUrl();

  return [
    `${opBaseUrl}${auth}${auth}?`,
    'response_type=code&',
    `client_id=${clientId}&`,
    `redirect_uri=${url}&`,
    'scope=openid address accountdata&',
    'from=gds_order',
  ].join('');
}

/**
 * @deprecated
 * This function is not been used anymore on SPA, Account platform
 * is handling the create account. Leaving this action here in case
 * requirements change again and we need to show a button or link
 * to create a new user.
 **/
export function getRegistrationUrl(config) {
  const { opBaseUrl, memberRegistry } = config;
  const loginUrl = getOAuthUrl();

  return `${opBaseUrl}${memberRegistry}?return_uri=${loginUrl}?account=true`;
}

export function showButtons() {
  return {
    type: SHOW_FORM,
  };
}

export function setTokenFromCookie() {
  return dispatch => ClientStorage
    .get(localStorageKeys.authStorage)
    .then(localStorageValue => dispatch({
      type: SET_TOKEN,
      localStorageValue,
      cookie: {
        key: cookies.accountPlatformCookie,
        domain: cookies.domain,
      },
    }));
}

/**
 * We use this action to find out if the user is logged or not.
 * If there's a OP.LGN cookie present, this user is logged in, otherwise is not.
 * This action is called everytime we enter a new route, then we set a flag on the state: `auth.user.loginStatus`
 */
export function setLoginStatusFromCookie() {
  return {
    type: SET_LOGIN_STATUS,
    cookie: {
      key: cookies.accountPlatformCookie,
      domain: cookies.domain,
    },
  };
}

export function loadUserData() {
  const { userInfo, base } = userInfoApi;

  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: client =>
      client.get(`${userInfo}`, {
        ...promiseConfig,
        host: base,
        tokenType: 'Bearer',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    errorHandler: { enableReaction: true },
  };
}

export function load() {
  return (dispatch, getState) => {
    // 1.- Set token form cookie if user is logged in
    const promise = dispatch(setTokenFromCookie());

    // 2.- load additional data from API if there's a token
    const { user } = getState().auth;

    if (user && user.accessToken) {
      return dispatch(loadUserData());
    }

    dispatch(setLoginStatusFromCookie());

    return promise;
  };
}

export function saveToken(result) {
  const data = decodeMemberData(result);
  const localStorageValue = {
    accessToken: result.access_token,
    authTime: data.auth_time,
    memberId: data.gdsmemberid.UQ,
    memberHash: reactCookie.load(cookies.accountPlatformCookie),
    tokenExpiresIn: result.expires_in,
  };
  const now = Date.now();
  // set local storage expiry time to number of minutes till token expiry
  const localStorageExpiry = (result.expires_in * 1000 - now) / 1000 / 60;

  return dispatch => ClientStorage
    .set(localStorageKeys.authStorage, localStorageValue, localStorageExpiry)
    .then(dispatch({ type: SAVE_TOKEN, localStorageValue }));
}

export function getGDSAccess() {
  return {
    type: REDIRECT_TO_GDS,
    redirect: {
      location: `${accountApi.gdsHost}/${accountApi.region}${accountApi.gdsAccess}`,
    },
  };
}

export function requestToken(code) {
  const config = defaultConfig.account;
  const url = getOAuthUrl();
  const body = {
    grant_type: 'authorization_code',
    redirect_uri: url,
    code,
  };

  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: client => client.post(accountApi.requestToken, {
      host: `${config.proxyUrl}${config.auth}`,
      body: formurlencoded(body),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }),
    errorHandler: { showMessage: true, apiType: apiTypes.ACPF, customErrorKey: 'requestToken' },
  };
}

export function removeTokenStore() {
  return dispatch => ClientStorage
    .remove(localStorageKeys.authStorage)
    .then(dispatch({ type: LOGOUT }));
}

export function removeGDSCookie() {
  return (dispatch) => {
    // GDS is setting the cookie on this specific path
    const path = cookies.gdsCookiePath;

    dispatch({
      type: LOGOUT,
      cookie: {
        key: cookies.gdsCookie,
        remove: true,
        domain: cookies.domain,
        path,
      },
    });

    return Promise.resolve();
  };
}

export function setGDSSession(gdsSession) {
  return {
    type: SET_GDS_SESSION,
    gdsSession,
  };
}

// GDS expects this cookie to be set, sometimes it's not present,
// we need to make sure it's always present.
function saveDispSiteCookie() {
  return {
    type: SAVE_DISPSITE_SESSION,
    cookie: {
      key: cookies.dispSiteCookie,
      value: 'SP',
      path: cookies.cartPath,
      domain: cookies.domain,
    },
  };
}

/**
 * When API calls fail, we need to get a new token,
 * therefore we need to send the user to the login page
 * on account platform.
 */
export function redirectToAccountLogin() {
  return (dispatch) => {
    const loginUrl = getLoginUrl(defaultConfig.account);
    const location = `${loginUrl}&max_age=${sensitive.timeToForceLogin / 1000}`;

    dispatch(removeTokenStore());

    return dispatch({
      type: REDIRECT_TO_LOGIN,
      redirect: {
        location,
      },
    });
  };
}

export function redirectToChangePassword() {
  const account = defaultConfig.account;

  return `${account.opBaseUrl}${account.changePassword}`;
}

export function redirectToLogout() {
  const base = getBaseUrl();
  const redirect = `${base}/logout`;

  return {
    type: LOGOUT,
    redirect: {
      location: `${accountApi.gdsHost}/${accountApi.region}${accountApi.logout}?redirect_uri=${redirect}&client_id=${defaultConfig.account.clientId}`,
    },
  };
}

// Hides the confirm message
export function cancelLogout() {
  return {
    type: CONFIRM_LOGOUT,
    show: false,
  };
}

// This actions starts the logout process, first it shows
// a confirmation message, if user cancels then nothing happens
// if user confirms remove cookies and redirect to logout con account platform
export function logout() {
  return {
    type: CONFIRM_LOGOUT,
    show: true,
  };
}

// Prepares GDS for login, by sending the current carts
// that will be merged.
function prepareLogin() {
  return (dispatch, getState) => {
    const globalState = getState();
    const guCart = getCart(globalState, 'gu');
    const uqCart = getCart(globalState, 'uq');
    const loginUrl = getOAuthUrl();
    const guParams = guCart.cartNumber
      ? { gu_token: guCart.token, gu_cart_no: guCart.cartNumber }
      : null;
    const uqParams = uqCart.cartNumber
      ? { uq_token: uqCart.token, uq_cart_no: uqCart.cartNumber }
      : null;

    return dispatch({
      types: [PREPARE_LOGIN, PREPARE_LOGIN_SUCCESS, PREPARE_LOGIN_FAILURE],
      promise: client => client.post(accountApi.loginPreparation, {
        ...promiseConfig,
        host: promiseConfig.putHost,
        params: {
          client_id: cartApi.clientId,
          client_secret: cartApi.clientSecret,
          redirect_url_afterlogin: loginUrl,
          ...uqParams,
          ...guParams,
        },
      }),
      errorHandler: { showMessage: true, enableReaction: true, apiType: apiTypes.GDS, customErrorKey: 'prepareLogin' },
    });
  };
}

/*
* Remove Apple Pay guest cookie after login
*/
export function removeGuestCookie() {
  const { applePay: { guestFlag }, brandName: { uq, gu } } = defaultConfig;

  return (dispatch) => {
    [uq, gu].forEach((brand) => {
      if (reactCookie.load(`${brand}_${cookies.applePayCookie}`) === guestFlag) {
        dispatch(removeApplePayCookie(brand));
      }
    });
  };
}

/**
 * @private
 * Removes the redirect cookie
 */
function removeRedirect() {
  return {
    type: SET_REDIRECT,
    url: null,
    cookie: {
      key: cookies.redirectCookie,
      remove: true,
      domain: cookies.domain,
    },
  };
}

/**
 * @private
 * Handle the redirections after the user is logged in.
 * If there's a redirect cookie, this action will redirect to that value
 * otherwise it will redirect to home page.
 */
function redirectAfterLogin() {
  return (dispatch, getState) => {
    const { auth } = getState();

    // 1.- Check if we have token and GDS session
    if (isAuthenticated(auth.user)) {
      dispatch(removeGuestCookie());
      const location = auth.redirectUrl;

      // 2.- Remove the current redirectUrl
      dispatch(removeRedirect());

      if (location) {
        // 3.- Redirect to the new URL
        return dispatch({
          type: REDIRECT_FROM_LOGIN,
          redirect: {
            location,
          },
        });
      }
    }

    // 4.- Redirect home in case there's not redirect defined
    // or if user go to login page.
    goHome();

    return null;
  };
}

/**
 * @private
 * Checks for error code `2308`, if pressent just ignore the error
 * otherwhise pass it to the next catch (Cart redirection).
 */
function handleGDSFailure(error) {
  return (dispatch) => {
    // Error code `2308` means the user is already logged in
    // Therefore there's nothing else to do here.
    if (error.resultCode !== '2308') {
      return Promise.reject(error);
    }

    return dispatch(redirectAfterLogin());
  };
}

export function loginOnGDS() {
  return dispatch => dispatch(prepareLogin())
  .then(() => dispatch(getGDSAccess()))
  .catch(error => dispatch(handleGDSFailure(error)));
}

// This function get's called once the user has login on account platform,
// we recive the code and then use it to get the token and GDS cookies.
export function login(code) {
  return (dispatch) => {
    dispatch(saveDispSiteCookie());

    return dispatch(requestToken(code))
    .then(tokenResponse => dispatch(saveToken(tokenResponse)));
  };
}

// Set a given URL to state, we use this URL to
// redirect the user after login.
export function setRedirectUrl(url) {
  return {
    type: SET_REDIRECT,
    url,
  };
}

// Saves the given URL to a cookie for 10 mins
// we use it to redirect the user after successfully login
export function saveRedirectUrl(url) {
  const expires = new Date();

  expires.setMinutes(expires.getMinutes() + cookies.redirectCookieExpires);

  return {
    type: SAVE_REDIRECT,
    cookie: {
      key: cookies.redirectCookie,
      value: url,
      expires,
      domain: cookies.domain,
    },
  };
}

// This function logouts the user when user
// confirms logout.
export function confirmLogout() {
  return (dispatch, getState) => {
    const globalState = getState();
    const pathname = getRoutingPathName(globalState);
    const search = getRoutingSearch(globalState);
    const { uq, gu } = defaultConfig.brandName;

    dispatch(resetNextDayDeliveryDontCareFlag(uq));
    dispatch(resetNextDayDeliveryDontCareFlag(gu));
    dispatch(setCookieToResetCheckout(uq));
    dispatch(setCookieToResetCheckout(gu));
    dispatch(removeCheckoutStatus(uq));
    dispatch(removeCheckoutStatus(gu));
    dispatch(removeGDSCookie());
    dispatch(removeTokenStore());
    dispatch(removeCartCookie(uq));
    dispatch(removeCartCookie(gu));
    setNativeAppCart({ cart_no: null, token: null });
    dispatch(removeOrderCookie());
    dispatch(saveRedirectUrl(`${pathname}${search}`));
    dispatch(removeCheckout());

    return dispatch(redirectToLogout());
  };
}

// Handle the redirection after the user logout
export function redirectAfterLogout() {
  return (dispatch, getState) => {
    const globalState = getState();
    const { auth: { redirectUrl } } = globalState;
    const selectedBrand = getCurrentBrand(globalState);

    dispatch(removeRedirect());

    if (redirectUrl) {
      // Redirect to the previous URL on cookie
      dispatch({
        type: REDIRECT_FROM_LOGOUT,
        redirect: {
          location: redirectUrl,
        },
      });
    } else {
      // Redirect home in case there's not redirect defined
      goHome(selectedBrand);
    }
  };
}

/**
 * This actions redirects the user to the login page, forcing to login again
 */
export function forceLogin(path, useMaxAge = false) {
  return (dispatch) => {
    const url = getLoginUrl(defaultConfig.account);
    // timeToForceLogin comes from configuration in milliseconds. convert that to seconds for account platform.
    const forceMethod = useMaxAge ? `&max_age=${sensitive.timeToForceLogin / 1000}` : '&prompt=login';

    dispatch(saveRedirectUrl(path));
    dispatch(removeTokenStore());
    dispatch(removeGDSCookie());

    return dispatch({
      type: CHECK_SENSITIVE,
      redirect: {
        location: `${url}${forceMethod}`,
      },
    });
  };
}

/**
 * This action saves the given or current path in a cookie and redirects
 * to the login page on account platform.
 * After a successfull login, user will be redirected to the given path, if not
 * path is provided, the current path will be saved.
 *
 * @param  {String} path  The path to save.
 **/
export function saveAndRedirectToLogin(path) {
  return (dispatch, getState) => {
    const globalState = getState();
    const pathname = getRoutingPathName(globalState);
    const search = getRoutingSearch(globalState);

    if (path) {
      dispatch(saveRedirectUrl(`${root}/${path}`));
    } else {
      dispatch(saveRedirectUrl(`${pathname}${search}`));
    }

    return dispatch(redirectToAccountLogin());
  };
}

/**
 * Account platform returns OP.LGN cookie to let us know if the current user is logged or not,
 * however we are using http and https and the local storage is different depending
 * on the protocol. When logout from http, the local storage on https doen't clear and
 * the user is still authenticated. We need to clear the local storage when there's no OP.LGN cookie.
 * More info: https://redmine.fastretailing.com/issues/44710
 */
export function fixHttpsLocalStorageIssues(token) {
  return (dispatch, getState) => {
    const { auth: { user } } = getState();

    // If there's an access token but the user shouldn't be logged in
    // we need to remove this token!!
    if (token && token.accessToken && !isLoggedIn(user)) {
      dispatch(removeTokenStore());

      return Promise.resolve();
    }

    return Promise.resolve(token);
  };
}

/**
 * When there's an error while requesting any of the
 * APIs at login, we will redirect the user to cart page
 * to display an error messag there.
 */
function redirectToPublicPage() {
  return {
    type: REDIRECT_TO_CART,
    redirect: {
      location: routes.cart,
    },
  };
}

/**
 * This action initializes the login page, based on the query params
 * we decide whether we get the token or redirect the user back to the original page.
 **/
export function initializeLoginPage() {
  return (dispatch, getState) => {
    const {
      auth: { user },
      routing: { locationBeforeTransitions: { query } },
    } = getState();

    if (query.code && !isAuthenticated(user)) {
      // Get the access token from account platform and login to GDS
      return dispatch(login(query.code))
        .then(() => dispatch(loginOnGDS()))
        .catch(() => dispatch(redirectToPublicPage()));
    } else if (isAuthenticated(user)) {
      // Redirect the user whether to home page or
      // to the redirectUrl on the cookie.
      return dispatch(redirectAfterLogin());
    }

    // Account platform redirects to this page after a new
    // account has been created, therefore we need to authenticate
    // the new user.
    return dispatch(redirectToAccountLogin());
  };
}
