import config from 'config';
import { couponApi, cartApi, barcodeApi, apiTypes } from 'config/api';
import { getCurrentBrand, replaceUrlParams } from 'utils/routing';
import { getCart, load as loadCart, checkCartExists } from 'redux/modules/cart';
import { getCoupons, getCartCoupon } from './mappings/couponMappings.js';

export const COUPONS_LOAD = 'coupon/COUPONS_LOAD';
export const COUPONS_LOAD_SUCCESS = 'coupon/COUPONS_LOAD_S';
export const COUPONS_LOAD_FAIL = 'coupon/COUPONS_LOAD_F';
export const REMOVE_COUPON = 'coupon/REMOVE_COUPON';
export const REMOVE_COUPON_SUCCESS = 'coupon/REMOVE_COUPON_S';
export const REMOVE_COUPON_FAIL = 'coupon/REMOVE_COUPON_F';
export const SET_CODE = 'coupon/SET_CODE';
export const GET_COUPON_DETAILS_SUCCESS = 'coupon/GET_COUPON_DETAILS_S';
export const SELECT_STORE_COUPON_TOGGLE = 'coupon/SELECT_STORE_COUPON_TOGGLE';
export const DESELECT_ALL_STORE_COUPONS = 'coupon/DESELECT_ALL_STORE_COUPONS';
export const USE_SELECTED_STORE_COUPONS = 'coupon/USE_SELECTED_STORE_COUPONS';
export const GET_SELECTED_STORE_COUPON_DETAIL_LIST = 'coupon/GET_SELECTED_STORE_COUPON_DETAIL_LIST';
export const SAVE_STORE_COUPONS = 'coupon/SAVE_STORE_COUPONS';
export const SET_STORE_COUPONS = 'coupon/SET_STORE_COUPONS';
export const REMOVE_STORE_COUPONS = 'coupon/REMOVE_STORE_COUPONS';
export const ADD_A_COUPON = 'coupon/ADD_A_COUPON';
export const ADD_A_COUPON_SUCCESS = 'coupon/ADD_A_COUPON_S';
export const ADD_A_COUPON_FAIL = 'coupon/ADD_A_COUPON_F';
export const GET_CART_COUPON = 'coupon/GET_CART_COUPON';
export const GET_CART_COUPON_SUCCESS = 'coupon/GET_CART_COUPON_S';
export const GET_CART_COUPON_FAIL = 'coupon/GET_CART_COUPON_F';
export const SET_COUPON_SUCCESS_AS = 'coupon/SET_COUPON_SUCCESS_AS';
export const INIT_COUPON_CODE = 'coupon/INIT_COUPON_CODE';
export const CLEAR_CART_COUPON = 'coupon/CLEAR_CART_COUPON';
export const CONSUME_A_STORE_COUPON = 'coupon/CONSUME_A_STORE_COUPON';
export const CONSUME_A_STORE_COUPON_SUCCESS = 'coupon/CONSUME_A_STORE_COUPON_S';
export const CONSUME_A_STORE_COUPON_FAIL = 'coupon/CONSUME_A_STORE_COUPON_F';

const VALIDATE_COUPON = 'coupon/VALIDATE_COUPON';
const VALIDATE_COUPON_SUCCESS = 'coupon/VALIDATE_COUPON_S';
const VALIDATE_COUPON_FAIL = 'coupon/VALIDATE_COUPON_F';

const SELECT_A_COUPON_TO_USE = 'coupon/SELECT_A_COUPON_TO_USE';
const SHOW_CONFIRMATION_POPUP = 'coupon/SHOW_CONFIRMATION_POPUP';
const SHOW_FOOTER_MESSAGE = 'coupon/SHOW_FOOTER_MESSAGE';

export const couponBarcodeApi = `${barcodeApi.base}/${barcodeApi.brand}/${barcodeApi.region}${barcodeApi.url}`;
const { cookies } = config.app;

const initialState = {
  code: '',
  isOnlineCouponsLoaded: { uq: false, gu: false },
  isStoreCouponsLoaded: { uq: false, gu: false },
  isCartCouponAdded: false,
  list: [],
  storeCouponList: [],
  selectedStoreCoupons: [],
  selectedStoreCouponDetails: [],
  myCoupons: [],
  myCouponValid: true,
  couponDetails: {},
  addedCoupon: {
    uq: {},
    gu: {},
  },
  isredirectToPage: false,

  // coupon code selected for consuming
  selectedCoupon: '',

  // Boolean to show or hide footer message
  isFooterVisible: false,

  // Boolean to show or hide confirmation message
  isConfirmationPopupVisible: false,
};

export default function reducer(state = initialState, action = {}) {
  let coupon;
  const { result } = action;

  switch (action.type) {
    case SET_CODE:
      return {
        ...state,
        code: action.code,
      };
    case COUPONS_LOAD_SUCCESS:
      const { coupons } = result;
      const brand = action.currentBrand;
      const onlineCoupons = coupons.filter(obj => obj.coupon.environments.includes('ec'));
      const storeCoupons = coupons.filter(obj => obj.coupon.environments.includes('store'));

      return {
        ...state,
        isOnlineCouponsLoaded: {
          [brand]: true,
        },
        isStoreCouponsLoaded: {
          [brand]: true,
        },
        list: getCoupons(onlineCoupons),
        storeCouponList: getCoupons(storeCoupons),
      };
    case COUPONS_LOAD_FAIL:
      return {
        ...state,
        error: action.error,
      };

    // Add a coupon to cart
    case ADD_A_COUPON_SUCCESS:
      return {
        ...state,
        myCouponValid: true,
        isCartCouponAdded: false,
        isredirectToPage: true,
      };
    case ADD_A_COUPON_FAIL:
      if (action.isMyCoupon) {
        return {
          ...state,
          myCouponValid: false,
          error: action.error,
          isredirectToPage: false,
        };
      }

      return {
        ...state,
        error: action.error,
        isredirectToPage: false,
      };

    // Remove a coupon from cart
    case REMOVE_COUPON_SUCCESS:
      const currentCouponList = state.list;

      currentCouponList.forEach((item) => { item.selected = false; });

      return {
        ...state,
        list: currentCouponList,
        addedCoupon: {
          ...state.addedCoupon,
          [action.currentBrand]: {},
        },
        isCartCouponAdded: false,
      };
    case REMOVE_COUPON_FAIL:
      return {
        ...state,
        error: action.error,
      };

    // Get the details of the coupon added to cart
    case GET_CART_COUPON_SUCCESS:
      coupon = action.result;
      const currentBrand = action.brand;

      const addedCoupon = getCartCoupon(coupon);
      const couponList = state.list;

      couponList.forEach((item) => { item.selected = false; });
      const selectedCouponIndex = couponList.findIndex(item => item.code === (addedCoupon && addedCoupon.couponId));

      if (selectedCouponIndex !== -1) {
        couponList[selectedCouponIndex].selected = true;
      }

      return {
        ...state,
        isCartCouponAdded: true,
        list: couponList,
        addedCoupon: {
          ...state.addedCoupon,
          [currentBrand]: addedCoupon,
        },
      };
    case GET_CART_COUPON_FAIL:
      return {
        ...state,
        addedCoupon: {
          ...state.addedCoupon,
          [action.brand]: {},
        },
        error: action.error,
      };
    case SELECT_STORE_COUPON_TOGGLE:
      const current = state.storeCouponList.find(item => item.internalId === action.coupon.internalId);

      // If user is selecting a coupon, we need to do several validations
      if (!current.selected) {
        // Get all current selections, we will need it to validate the curren coupon
        const selections = state.storeCouponList.filter(item => item.selected);
        // If there's a coupon already selected and is not combinable, we should not allow selecting a new coupon
        const isNotCombinable = selections.find(item => item.combinable === false);

        // We need to check if the selected coupon can be used with other coupons
        // `combinable` means this coupon can be used with other coupons.
        // and make sure there's not a not combinable coupon selected already
        if (current.combinable && isNotCombinable === undefined) {
          const sameCoupons = selections.filter(item => item.id === action.coupon.id);

          // If this coupon can be combined, we need to check how many times we can select
          // the same coupon.
          // `nCombinable` means how many this coupon can be used at the same time.
          if (sameCoupons.length > 0) {
            sameCoupons.push(current);
            const leastCount = Math.min(...sameCoupons.map(item => item.nCombinable));

            current.selected = sameCoupons.length <= leastCount;
          } else {
            // This is the first coupon, for sure we can select it!
            current.selected = true;
          }
        } else if (selections.length === 0) {
          // If can not be used with other coupons, we can select it only if there's
          // no other coupon selected.
          current.selected = true;
        } else {
          // If this coupon is not combinable, we can't select it. Let's return the same state to avoid
          // re-rendering the view if there are not changes.
          return state;
        }
      } else {
        // Just deselect the coupon, no need to validate anything else.
        current.selected = false;
      }

      return {
        ...state,
        storeCouponList: [...state.storeCouponList],
      };
    case DESELECT_ALL_STORE_COUPONS:
      return {
        ...state,
        storeCouponList: state.storeCouponList.map(storeCoupon => ({
          ...storeCoupon,
          selected: false,
        })),
      };
    case USE_SELECTED_STORE_COUPONS:
      const selectedCouponIds = [];

      state.storeCouponList.forEach((storeCoupon) => {
        if (storeCoupon.selected) {
          selectedCouponIds.push(storeCoupon.internalId);
        }
      });

      return {
        ...state,
        selectedStoreCoupons: selectedCouponIds,
      };
    case GET_SELECTED_STORE_COUPON_DETAIL_LIST:
      const couponDetailList = state.storeCouponList.filter(storeCoupon => state.selectedStoreCoupons.includes(storeCoupon.internalId));

      return {
        ...state,
        isStoreCouponsLoaded: { uq: false, gu: false },
        selectedStoreCouponDetails: couponDetailList,
      };
    case SET_STORE_COUPONS:
      const data = action.cookie.value;

      if (data) {
        const selectedCouponDetails = state.storeCouponList.filter(item =>
        data.includes(item.internalId));

        return {
          ...state,
          selectedStoreCoupons: data,
          selectedStoreCouponDetails: selectedCouponDetails,
        };
      }

      return {
        ...state,
        selectedStoreCoupons: [],
        selectedStoreCouponDetails: [],
      };
    case REMOVE_STORE_COUPONS:
      return {
        ...state,
        selectedStoreCoupons: [],
        selectedStoreCouponDetails: [],
      };
    case GET_COUPON_DETAILS_SUCCESS:
      return {
        ...state,
        couponDetails: action.coupon,
      };
    case SET_COUPON_SUCCESS_AS:
      return {
        ...state,
        isredirectToPage: action.value,
      };
    case INIT_COUPON_CODE:
      return {
        ...state,
        code: action.code,
        myCouponValid: true,
      };
    case CLEAR_CART_COUPON:
      return {
        ...state,
        list: state.list.map(onlineCoupon => ({
          ...onlineCoupon,
          selected: false,
        })),
        addedCoupon: {
          ...state.addedCoupon,
          [action.brand]: {},
        },
        isCartCouponAdded: false,
      };
    case CONSUME_A_STORE_COUPON_SUCCESS:
      const code = action.code;
      const selectedCoupons = state.selectedStoreCoupons.filter(item => item !== code);
      const selectedCouponDetails = state.selectedStoreCouponDetails.filter(item => item.code !== code);

      return {
        ...state,
        selectedStoreCoupons: selectedCoupons,
        selectedStoreCouponDetails: selectedCouponDetails,
        isFooterVisible: false,
        isConfirmationPopupVisible: true,
      };
    case SELECT_A_COUPON_TO_USE:
      return {
        ...state,
        selectedCoupon: action.code,
        isFooterVisible: true,
      };
    case SHOW_CONFIRMATION_POPUP:
      return {
        ...state,
        isConfirmationPopupVisible: action.value,
      };
    case SHOW_FOOTER_MESSAGE:
      return {
        ...state,
        isFooterVisible: action.value,
      };
    case CONSUME_A_STORE_COUPON_FAIL:
    default:
      return state;
  }
}

const cartConfig = {
  host: cartApi.host,
  headers: {
    'Content-Type': 'text/plain',
  },
};

const cartDeleteConfig = {
  host: cartApi.hostForRemove,
  headers: {
    'Content-Type': 'text/plain',
  },
};

const errorHandler = { apiType: apiTypes.GDS, showMessage: true, enableReaction: true };

const actions = {
  add: {
    types: [ADD_A_COUPON, ADD_A_COUPON_SUCCESS, ADD_A_COUPON_FAIL],
    method: 'post',
    config: cartConfig,
  },
  delete: {
    types: [REMOVE_COUPON, REMOVE_COUPON_SUCCESS, REMOVE_COUPON_FAIL],
    method: 'get',
    config: cartDeleteConfig,
  },
};

export function isOnlineCouponsLoaded(globalState) {
  return globalState.coupons && globalState.coupons.isOnlineCouponsLoaded[getCurrentBrand(globalState)];
}

export function isStoreCouponsLoaded(globalState) {
  return globalState.coupons && globalState.coupons.isStoreCouponsLoaded[getCurrentBrand(globalState)];
}

export function isCartCouponLoaded(globalState) {
  return globalState.coupons && globalState.coupons.isCartCouponAdded;
}

export function load() {
  return (dispatch, getState) => {
    const currentBrand = getCurrentBrand(getState());

    return dispatch({
      types: [COUPONS_LOAD, COUPONS_LOAD_SUCCESS, COUPONS_LOAD_FAIL],
      promise: (client, brand) =>
        client.get(couponApi.url, {
          host: replaceUrlParams(couponApi.base, { brand }),
          params: {
            validate: 1,
          },
          tokenType: 'access_token',
        }),
      errorHandler: { enableReaction: true, showMessage: true, customErrorKey: 'couponLoad' },
      currentBrand,
    });
  };
}

export function setCode(code) {
  return {
    type: SET_CODE,
    code,
  };
}

export function getDetails(coupon) {
  return {
    type: GET_COUPON_DETAILS_SUCCESS,
    coupon,
  };
}

export function selectStoreCouponToggle(coupon) {
  return {
    type: SELECT_STORE_COUPON_TOGGLE,
    coupon,
  };
}

export function deselectAllStoreCoupons() {
  return {
    type: DESELECT_ALL_STORE_COUPONS,
  };
}

export function useSelectedStoreCoupons() {
  return {
    type: USE_SELECTED_STORE_COUPONS,
  };
}

export function getSelectedStoreCouponDetails() {
  return {
    type: GET_SELECTED_STORE_COUPON_DETAIL_LIST,
  };
}

export function saveSelectedStoreCoupons() {
  return (dispatch, getState) => {
    const expires = new Date();
    const state = getState();
    const couponList = state.coupons.selectedStoreCoupons;

    expires.setTime(expires.getTime() + cookies.cartExpires);

    dispatch({
      type: SAVE_STORE_COUPONS,
      cookie: {
        key: cookies.couponIds,
        value: couponList,
        domain: cookies.domain,
        format: 'json',
        expires,
      },
    });
  };
}

export function setSelectedStoreCoupons() {
  return {
    type: SET_STORE_COUPONS,
    cookie: {
      key: cookies.couponIds,
      format: 'json',
    },
  };
}

export function removeSelectedStoreCoupons() {
  return {
    type: REMOVE_STORE_COUPONS,
    cookie: {
      key: cookies.couponIds,
      remove: true,
      domain: cookies.domain,
    },
  };
}

export function clearCartCoupon(brand) {
  return {
    type: CLEAR_CART_COUPON,
    brand,
  };
}

/**
 * Get the information of the coupon applied for the current cart
 *@name getCartCouponInformation
 *
 * @param {String} currentBrand - specify coupons of which brand cart to be loaded(needed when both cart is loaded in cart page)
 * @return {ActionCreator} - not then-able
 */
export function getCartCouponInformation(currentBrand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const brand = currentBrand || getCurrentBrand(globalState);
    const cart = getCart(globalState, brand);

    if (cart.couponFlag === '1') {
      return dispatch({
        types: [GET_CART_COUPON, GET_CART_COUPON_SUCCESS, GET_CART_COUPON_FAIL],
        promise: client => client.get(cartApi.coupon, {
          ...cartConfig,
          host: replaceUrlParams(cartConfig.host, { brand }),
          params: {
            client_id: `${cartApi.clientId}`,
            cart_no: cart.cartNumber,
            token: cart.token,
          },
          credentials: 'include',
        }),
        errorHandler: { ...errorHandler, customErrorKey: 'getCartCouponInfo' },
        brand,
      });
    }

    return dispatch(clearCartCoupon(brand));
  };
}

/**
 * Adds / removes the coupon code from the cart
 * @private
 * @name couponAbstractAction
 *
 * @param {String} action - should be one of 'add', 'delete'
 * @param {String} code - coupon code
 * @param {Boolean} isMyCoupon
 * @return {Promise} - Promise object returned by load cart Action
 */
function couponAbstractAction(action, code, isMyCoupon) {
  const currentAction = actions[action];

  return (dispatch, getState) => {
    const globalState = getState();
    const currentBrand = getCurrentBrand(globalState);
    const cart = getCart(globalState, currentBrand);

    return dispatch({
      types: currentAction.types,
      promise: (client, brand) => client[currentAction.method](cartApi.coupon, {
        ...currentAction.config,
        host: replaceUrlParams(currentAction.config.host, { brand }),
        params: {
          client_id: `${cartApi.clientId}`,
          cart_no: cart.cartNumber,
          coupon_id: code,
          token: cart.token,
        },
        credentials: 'include',
      }),
      currentBrand,
      isMyCoupon,
      errorHandler: { ...errorHandler, customErrorKey: 'coupon' },
    });
  };
}

/**
 * Adds the coupon code from the cart
 * @exports addACoupon
 * @see couponAbstractAction
 *
 * @param {String} code - coupon code
 * @param {Boolean} isMyCoupon
 * @return {Promise} - Promise returned by inner call
 */
export function addACoupon(coupon, isMyCoupon) {
  return couponAbstractAction('add', coupon.code, isMyCoupon);
}

/**
 * removes the coupon code from the cart
 * @exports removeACoupon
 * @see couponAbstractAction
 *
 * @param {String} code - coupon code
 * @return {Promise} - Promise returned by inner call
 */
export function removeACoupon(coupon) {
  return couponAbstractAction('delete', coupon.code);
}

export function setCouponSuccessAs(value) {
  return {
    type: SET_COUPON_SUCCESS_AS,
    value,
  };
}

/**
 * Initialize the coupon code to be displayed in page
 * @name initCouponCode
 */
export function initCouponCode() {
  return (dispatch, getState) => {
    const globalState = getState();
    const brand = getCurrentBrand(globalState);
    const { coupons: { addedCoupon, list } } = globalState;
    let appliedCouponCode = addedCoupon[brand] && addedCoupon[brand].couponId || '';
    const shouldClearCode = !!(list.find(item => !item.isUsed && item.code === appliedCouponCode));

    if (shouldClearCode) {
      appliedCouponCode = '';
    }

    return dispatch({
      type: INIT_COUPON_CODE,
      code: appliedCouponCode,
    });
  };
}

/**
 * Validates a coupon
 * @name validateCoupon
 *
 * @param {String} code - coupon code
 * @return {ActionCreator} - not then-able
 */
export function validateCoupon(code) {
  return {
    types: [VALIDATE_COUPON, VALIDATE_COUPON_SUCCESS, VALIDATE_COUPON_FAIL],
    promise: (client, brand) =>
      client.get(`/${code}${couponApi.validate}/${couponApi.store}`, {
        host: replaceUrlParams(couponApi.base, { brand }),
        headers: {
          'Content-Type': 'text/plain',
        },
        tokenType: 'access_token',
      }),
    errorHandler: { enableReaction: true },
  };
}

export function consumeAStoreCoupon(code) {
  return {
    types: [CONSUME_A_STORE_COUPON, CONSUME_A_STORE_COUPON_SUCCESS, CONSUME_A_STORE_COUPON_FAIL],
    promise: (client, brand) =>
      client.put(`/${code}${couponApi.consume}/${couponApi.store}`, {
        host: replaceUrlParams(couponApi.base, { brand }),
        tokenType: 'access_token',
      }),
    code,
  };
}

/**
 * Validates a coupons and consumes the coupon if it is valid
 * @name validateAndConsumeAStoreCoupon
 *
 * @return {Promise} - Promise object returned by consumeAStoreCoupon Action
 */
export function validateAndConsumeAStoreCoupon() {
  return (dispatch, getState) => {
    const code = getState().coupons.selectedCoupon;

    return dispatch(validateCoupon(code))
    .then((result) => {
      if (result.is_valid === 1) {
        return dispatch(consumeAStoreCoupon(code))
        .then(() => dispatch(saveSelectedStoreCoupons()));
      }

      return null;
    });
  };
}

/**
 * Saves the code of the coupon selcted for consuming
 * @name selectACouponToUse
 *
 * @param {String} code - coupon code
 * @return {ActionCreator} - not then-able
 */
export function selectACouponToUse(code) {
  return {
    type: SELECT_A_COUPON_TO_USE,
    code,
  };
}

/**
 * Hides / Show store coupon use coupon confirmation popup
 * @name showConfirmationPopup
 *
 * @param {Boolean} value - is confirmation popup visible
 * @return {ActionCreator} - not then-able
 */
export function showConfirmationPopup(value) {
  return {
    type: SHOW_CONFIRMATION_POPUP,
    value,
  };
}

/**
 * Hides / Show store coupon use coupon footer message
 * @name showFooterMessage
 *
 * @param {Boolean} value - is footer message visible
 * @return {ActionCreator} - not then-able
 */
export function showFooterMessage(value) {
  return {
    type: SHOW_FOOTER_MESSAGE,
    value,
  };
}

/**
 * Initialize the coupon page
 * @name initCouponPage
 *
 * @param {Object} store - The redux store
 */
export function initCouponPage({ store: { dispatch, getState } }) {
  const globalState = getState();
  const brand = getCurrentBrand(globalState);
  const loadCouponsIfNeeded = () => (!isOnlineCouponsLoaded(globalState) ? dispatch(load()) : Promise.resolve());

  return dispatch(checkCartExists())
  .then(() => dispatch(loadCart(brand)))
  .then(() => loadCouponsIfNeeded())
  .then(() => dispatch(getCartCouponInformation()))
  .then(() => dispatch(initCouponCode()));
}

/**
 * Initialize the barcode page
 * @name initCouponBarcode
 *
 * @param {Object} store - The redux store
 */
export function initCouponBarcode({ store: { dispatch, getState } }) {
  const globalState = getState();
  let couponLoadPromise = Promise.resolve();

  if (!isStoreCouponsLoaded(globalState)) {
    couponLoadPromise = dispatch(load());
  }

  return (couponLoadPromise
    .then(() => {
      if (!globalState.coupons.selectedStoreCoupons.length) {
        dispatch(setSelectedStoreCoupons());
      }

      return Promise.resolve();
    })
    .then(dispatch(getSelectedStoreCouponDetails()))
  );
}
