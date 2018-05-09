import { BEGIN_GLOBAL_LOAD, END_GLOBAL_LOAD } from 'redux-connect/lib/store';
import { UPDATE_LOCATION } from 'react-router-redux';
import { routePatterns } from 'utils/urlPatterns';
import { redirect, externalRedirect } from 'utils/routing';
import config from 'config';

const NAVIGATION_PROMPT = 'app/nav-prompt';
const NAVIGATION_CONFIRMED = 'app/nav-ok';
const NAVIGATION_CANCELED = 'app/nav-cancel';
const DIRECT_NAVIGATION = 'app/direct-nav';
const CONFIRM_NAVIGATION = 'app/confirmed-nav';
const SET_CMR = 'app/set-cmr';
const REMOVE_CMR = 'app/rm-cmr';
const SET_PREVIOUS_PATHNAME = 'app/prev-path';
const DISABLE_ANALYTICS = 'app/disable-analytics';
const UPDATE_LOADER = 'app/update-loader';

const { cookies } = config.app;
const pagesToShowCMR = [
  routePatterns.cart,
  routePatterns.checkout,
  routePatterns.coupons,
  routePatterns.delivery,
  routePatterns.payment,
  routePatterns.reviewOrder,
];

const navigationAlertDefaultTexts = {
  cancelBtnLabel: '',
  confirmBtnLabel: '',
  warningMessage: '',
};

const initialState = {
  isLoading: false,
  promptNavigation: false,
  confirmNavigateAway: false,
  navigationAlertProps: navigationAlertDefaultTexts,
  /**
   * @prop {String} previousPathname - Contains the value of the previous page
   * We use this field, to find out if calling the `Router.goBack` function will get us
   * back to a valid checkout page.
   */
  previousPathname: '',
  /**
   * @prop {String} cmr - Cart Merger Revival
   * GDS will create a cookie to let us know if the cart was merged, assigned or nothing
   * happened at login.
   */
  cmr: 0,
};

let lastRoutingAction;

export default function appState(state = initialState, action) {
  switch (action.type) {
    case BEGIN_GLOBAL_LOAD:
      if (lastRoutingAction === 'PUSH') {
        return {
          ...state,
          isLoading: true,
        };
      }

      return state;
    case END_GLOBAL_LOAD:
      return {
        ...state,
        isLoading: false,
      };
    case UPDATE_LOCATION:
      lastRoutingAction = action.payload.action;

      return state;
    case NAVIGATION_CONFIRMED:
    case NAVIGATION_CANCELED:
      return {
        ...state,
        promptNavigation: false,
        navigateTo: false,
        navigateRouter: false,
        navigationAlertProps: navigationAlertDefaultTexts,
      };
    case NAVIGATION_PROMPT:
      return {
        ...state,
        promptNavigation: true,
        navigateTo: action.link,
        navigateRouter: !action.noRouter,
        navigationAlertProps: action.navigationAlertProps,
      };
    case CONFIRM_NAVIGATION:
      return {
        ...state,
        confirmNavigateAway: true,
      };
    case DIRECT_NAVIGATION:
      return {
        ...state,
        confirmNavigateAway: false,
      };
    case SET_PREVIOUS_PATHNAME:
      return {
        ...state,
        previousPathname: action.pathname,
      };
    case SET_CMR:
      return {
        ...state,
        cmr: action.cmr,
      };
    case REMOVE_CMR:
      return {
        ...state,
        cmr: 0,
      };
    case UPDATE_LOADER:
    default:
      if (typeof action.isXHr === 'boolean') {
        return {
          ...state,
          isXHr: action.isXHr,
        };
      }

      return state;
  }
}

let confirmOnClick = false;

export function updateLoader() {
  return {
    type: UPDATE_LOADER,
    isXHr: false,
  };
}

// This function logouts the user when user
// confirms logout.
export function confirmNavigate() {
  return (dispatch, getState) => {
    const state = getState().app;

    if (state.navigateTo) {
      if (state.navigateRouter === true) {
        redirect(state.navigateTo);
      } else {
        externalRedirect(state.navigateTo);
      }

      confirmOnClick = false;
    }

    // if Link only has onClick handler then execute it
    if (confirmOnClick) {
      confirmOnClick();
      confirmOnClick = false;
    }

    dispatch({
      type: NAVIGATION_CONFIRMED,
    });
  };
}

// Hides the confirm message
export function cancelNavigate() {
  confirmOnClick = false;

  return {
    type: NAVIGATION_CANCELED,
  };
}

export function maybeNavigate(link, noRouter, onClick, navigationAlertProps) {
  if (typeof onClick === 'function') {
    confirmOnClick = onClick;
  }

  return {
    type: NAVIGATION_PROMPT,
    link,
    noRouter,
    navigationAlertProps,
  };
}

export function toggleConfirmedNav() {
  return {
    type: CONFIRM_NAVIGATION,
  };
}

export function toggleDirectNav() {
  return {
    type: DIRECT_NAVIGATION,
  };
}

export function setPreviousPath(pathname) {
  return {
    type: SET_PREVIOUS_PATHNAME,
    pathname,
  };
}

/**
 * Set's the CMR value to state
 */
export function setCartMergerRevival(cmr) {
  return {
    type: SET_CMR,
    cmr: parseInt(cmr, 10),
  };
}

/**
 * Set's the CMR value to state
 */
export function removeCartMergerRevival() {
  return {
    type: REMOVE_CMR,
    cookie: {
      key: config.app.cookies.cartCMRCookie,
      remove: true,
      domain: cookies.domain,
      path: cookies.cartPath,
    },
  };
}

export function setDisableAnalyticsCookie() {
  return {
    type: DISABLE_ANALYTICS,
    cookie: {
      key: config.app.cookies.disableAnalytics,
      value: '1',
      domain: cookies.domain,
      path: cookies.cartPath,
    },
  };
}

export function isPageToShowCMR(path = '') {
  const queryStrippedPath = path.split('?')[0];

  return !!pagesToShowCMR.find(page => page.test(queryStrippedPath));
}

/**
 * Checks if CMR is greather than 0, this mans there's an alert message we should show.
 * First check if there's a message to check, then check the if the current page is allowed to show messages.
 */
export const isMergerRevivalVisible = state => (
  state.app.cmr > 0 && isPageToShowCMR(state.routing.locationBeforeTransitions.pathname)
);
