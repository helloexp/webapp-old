import AppConfig from 'config';
import formurlencoded from 'form-urlencoded';
import { constantsGenerator } from 'utils';
import { cartApi, apiTypes } from 'config/api';
import { getNativeAppApplePayStatus } from 'helpers/NativeAppHelper';
import { getCurrentBrand, replaceUrlParams, redirect, getUrlWithQueryData } from 'utils/routing';
import { getCart, load as loadCart } from 'redux/modules/cart/cart';
import { saveCheckout } from 'redux/modules/cart/checkout';
import { saveOrderNumber, loadAffiliateCookies, deleteOrder } from 'redux/modules/checkout/order';
import { updateConfig } from 'redux/modules/cart/api';
import constants from 'config/site/default';
import { getJscData } from 'utils/bluegate';
import { getCommonOrderParams } from 'utils/order';
import { getDeliveryReqListParams } from 'utils/deliveryUtils';
import ClientStorage from 'utils/clientStorage';
import { createShippingMethodObject, splitByChar } from 'utils/applePay';
import { getTranslation } from 'i18n';
import { resetReceiptStatus } from 'redux/modules/cart';
import { removeCheckoutStatus } from 'redux/modules/checkout';
import { resetNextDayDeliveryDontCareFlag } from 'redux/modules/checkout/delivery';
import { routes } from 'utils/urlPatterns';

const { cookies, localStorageKeys } = AppConfig.app;
const {
  account: { opBaseUrl },
  deleteOrderErrorCodes, defaultSplitNumber, NULL_TIMEFRAME,
  deliveryTypes: { SHIPPING },
  payment: { applePay },
  deliveryPreferences: { GROUP_DELIVERY },
  brandName: { uq },
  gds: { positive, negative },
} = constants;
const errorHandler = {
  apiType: apiTypes.GDS,
  showMessage: true,
  enableReaction: true,
};

const promiseConfig = {
  host: cartApi.host,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const initialState = {
  showApplePayLoginPopup: false,
  isLoginCookieInvalid: false,
  isNativeAppApplePayAvailable: false,
  deliveryOptions: [],
  shippingMethod: {},
  shippingContact: {},
};

const generateConstants = constantsGenerator('applePay');
const withPrefix = typeStr => `applePay/${typeStr}`;

export const { APPLE_PAY_ORDER, APPLE_PAY_ORDER_SUCCESS, APPLE_PAY_ORDER_FAIL } = generateConstants('APPLE_PAY_ORDER');

const { PIB, PIB_SUCCESS, PIB_FAIL } = generateConstants('PIB');
const { GET_APPLEPAY_SESSION, GET_APPLEPAY_SESSION_SUCCESS, GET_APPLEPAY_SESSION_FAIL } = generateConstants('GET_APPLEPAY_SESSION');
const CREATE_SHIPPING_CONTACT = withPrefix('CREATE_SHIPPING_CONTACT');
const CREATE_SHIPPING_METHOD = withPrefix('CREATE_SHIPPING_METHOD');
const RESET_COOKIE_TIMER = withPrefix('RESET_COOKIE_TIMER');
const SET_APPLE_PAY_COOKIE = withPrefix('SET_APPLE_PAY_COOKIE');
const REMOVE_APPLE_PAY_COOKIE = withPrefix('REMOVE_APPLE_PAY_COOKIE');
const TOGGLE_APPLEPAY_LOGIN_POPUP = withPrefix('TOGGLE_APPLEPAY_LOGIN_POPUP');
const SET_NATIVEAPP_APPLEPAY_STATUS = withPrefix('SET_NATIVEAPP_APPLEPAY_STATUS');

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case RESET_COOKIE_TIMER: {
      return {
        ...state,
        isLoginCookieInvalid: true,
      };
    }

    case CREATE_SHIPPING_CONTACT: {
      return {
        ...state,
        shippingContact: action.shippingContact,
      };
    }

    case CREATE_SHIPPING_METHOD: {
      return {
        ...state,
        shippingMethod: action.shippingMethod,
      };
    }

    case PIB_SUCCESS: {
      if (action.result) {
        const response = action.result;
        const deliveryOptions = response && response.delv_type_list[0] && response.delv_type_list[0].delv_dt_list || [];

        return {
          ...state,
          deliveryOptions,
        };
      }

      return {
        ...state,
      };
    }

    case TOGGLE_APPLEPAY_LOGIN_POPUP: {
      return {
        ...state,
        showApplePayLoginPopup: !state.showApplePayLoginPopup,
      };
    }

    case SET_NATIVEAPP_APPLEPAY_STATUS: {
      return {
        ...state,
        isNativeAppApplePayAvailable: action.status,
      };
    }

    default:
      return state;
  }
}

export function createShippingMethod(shippingMethod) {
  return {
    type: CREATE_SHIPPING_METHOD,
    shippingMethod,
  };
}

export function createShippingContact(shippingContact) {
  return {
    type: CREATE_SHIPPING_CONTACT,
    shippingContact,
  };
}

export function setLoginCookieInvalid() {
  return {
    type: RESET_COOKIE_TIMER,
  };
}

/**
 * Gets a merchant session object for single-time usage (valid for 5 mins).
 * @param {String} validationURL
 */
export function getApplePaySession(validationURL) {
  return dispatch => dispatch({
    types: [GET_APPLEPAY_SESSION, GET_APPLEPAY_SESSION_SUCCESS, GET_APPLEPAY_SESSION_FAIL],
    promise: client => client.post(cartApi.applePayProxy, {
      host: opBaseUrl,
      data: {
        url: validationURL,
      },
    }),
    hideLoading: true,
  });
}

export function setApplePayCookie(brand = uq, guestFlag) {
  const expires = new Date();

  expires.setMinutes(expires.getMinutes() + cookies.applePayCookieExpires);

  return {
    type: SET_APPLE_PAY_COOKIE,
    cookie: {
      domain: cookies.domain,
      key: `${brand}_${cookies.applePayCookie}`,
      expires,
      value: guestFlag,
    },
  };
}

export function removeApplePayCookie(brand = uq) {
  return {
    type: REMOVE_APPLE_PAY_COOKIE,
    cookie: {
      domain: cookies.domain,
      key: `${brand}_${cookies.applePayCookie}`,
      remove: true,
    },
  };
}

/**
 * An ApplePay specific API, which makes provisional inventory booking
 * Requests `PUT /cart/cart_id/booked_item`.
 * @param {String('uq'|'gu')} brand
 * @param {String} zipCode
 * @param {String('1'|'0')} guestFlag - member = '0'; guest = '1'
 */
export function requestApplePayPIB(brand = uq, zipCode, guestFlag) {
  return (dispatch, getState) => {
    const globalState = getState();
    const cart = getCart(globalState, getCurrentBrand(globalState));

    return dispatch({
      types: [PIB, PIB_SUCCESS, PIB_FAIL],
      promise: client => client.post(cartApi.applePayPIB, {
        ...updateConfig,
        host: replaceUrlParams(updateConfig.host, { brand }),
        params: {
          cart_no: cart.cartNumber,
          receiver_zip_cd: zipCode,
          token: cart.token,
          client_id: cartApi.clientId,
          guest_flg: guestFlag,
        },
      }),
      hideLoading: true,
      errorHandler: { ...errorHandler, customErrorKey: 'applePayPIB' },
    });
  };
}

/**
 * Get query parameters required for Simple Order (ApplePay order)
 * @param {Object} globalState
 * @param {Boolean} isGuestUser
 * @param {Object} paymentToken
 * @returns {Object}
 */
function getSimpleOrderParams(globalState, guestFlag, paymentToken) {
  const { applePay: { phoneticGivenName, phoneticFamilyName } } = getTranslation();
  const { applePay: { shippingContact, shippingMethod } } = globalState;
  const jscData = getJscData();
  const selectedDateAndTime = shippingMethod.identifier.split(' ');
  const shipments = [
    {
      deliveryType: SHIPPING,
      splitNo: defaultSplitNumber,
      deliveryReqDate: selectedDateAndTime[0] === NULL_TIMEFRAME ? '' : selectedDateAndTime[0],
      deliveryReqTime: selectedDateAndTime[1],
    },
  ];
  const delvReqList = getDeliveryReqListParams(shipments, true);
  const addressLines = splitByChar(['\\n', '\n'], shippingContact.addressLines);

  /**
   * receiver_title, orderer_title, receiver_mobile_no, orderer_mobile_no,
   * fields are removed form parameters since
   * address form Apple Pay wallet will never have these fields
   */
  return {
    receiver_first_nm: shippingContact.givenName,
    receiver_last_nm: shippingContact.familyName,
    receiver_kana_first_nm: phoneticGivenName,
    receiver_kana_last_nm: phoneticFamilyName,
    receiver_addr_state: shippingContact.administrativeArea,
    receiver_addr_city: shippingContact.locality,
    receiver_addr1: addressLines[0],
    receiver_addr2: addressLines[1],
    receiver_tel_no: shippingContact.phoneNumber,
    orderer_first_nm: shippingContact.givenName,
    orderer_last_nm: shippingContact.familyName,
    orderer_kana_first_nm: phoneticGivenName,
    orderer_kana_last_nm: phoneticFamilyName,
    orderer_addr_state: shippingContact.administrativeArea,
    orderer_addr_city: shippingContact.locality,
    orderer_addr1: addressLines[0],
    orderer_addr2: addressLines[1],
    orderer_zip_cd: shippingContact.postalCode,
    orderer_tel_no: shippingContact.phoneNumber,
    orderer_eml_id: shippingContact.emailAddress,
    split_div: GROUP_DELIVERY,
    payment_type: applePay,
    payment_token: JSON.stringify(paymentToken),
    guest_flg: guestFlag,
    jsc_data: jscData,
    ...delvReqList,
  };
}

/**
  * For apple-pay error handling:
  * ＜Case1＞ If 「ord_no」「upd_date」「hash_key」 are not included in API response. →Nothing.(Auto cancel)
  * ＜Case2＞  Others.  →Delete /order_id
  */
function cancelOrderAndNoop(error = {}) {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    if (deleteOrderErrorCodes.includes(error.resultCode) && error.order_info_list) {
      const { order_info_list } = error;

      if (order_info_list[0] && order_info_list[0].ord_no && order_info_list[0].hash_key && order_info_list[0].upd_date) {
        return dispatch(deleteOrder(order_info_list[0]))
          .then(() => redirect(getUrlWithQueryData(routes.cart, { brand })));
      }
    }

    redirect(getUrlWithQueryData(routes.cart, { brand }));

    return Promise.resolve();
  };
}

/**
 * Makes `POST /simple_order` request to GDS
 * and save `order_no` and `hash_hey` in cookie.
 * Used for ApplePay order
 * @returns {Promise<*>}
 */
export function processApplePayOrder(guestFlag = negative, paymentToken, currentBrand) {
  return (dispatch, getState) => {
    const placeApplePayOrder = () => {
      const globalState = getState();
      const orderParams = getCommonOrderParams(globalState);
      const applePayOrderParams = getSimpleOrderParams(globalState, guestFlag, paymentToken);

      return dispatch({
        types: [APPLE_PAY_ORDER, APPLE_PAY_ORDER_SUCCESS, APPLE_PAY_ORDER_FAIL],
        promise: client => client.post(cartApi.applePayOrder, {
          ...promiseConfig,
          host: replaceUrlParams(promiseConfig.host, { brand: currentBrand }),
          body: formurlencoded({
            ...orderParams,
            ...applePayOrderParams,
          }),
        }),
        hideLoading: true,
        value: { applePayOrderParams, cart: globalState.cart, routing: globalState.routing },
        errorHandler: { ...errorHandler, customErrorKey: 'applePayOrder' },
      })
      .catch(error => dispatch(cancelOrderAndNoop(error)));
    };

    return dispatch(loadAffiliateCookies())
    .then(() => dispatch(removeApplePayCookie(currentBrand)))
    .then(() => dispatch(placeApplePayOrder))
    .then(result => dispatch(saveOrderNumber(result)))
    .then(() => {
      dispatch(saveCheckout(currentBrand));
      dispatch(removeCheckoutStatus(currentBrand));
      dispatch(resetNextDayDeliveryDontCareFlag(currentBrand));
      // Remove receipt_flg cookie
      dispatch(resetReceiptStatus(currentBrand));
      ClientStorage.set(localStorageKeys.orderPlacedFlag, 'y');
    })
    .then(() => {
      if (guestFlag === positive) {
        ClientStorage.set(localStorageKeys.applePayFlag, true);
      }
      redirect(getUrlWithQueryData(routes.confirmOrder, { brand: currentBrand }));

      return Promise.resolve();
    });
  };
}

/**
 * A method to book inventory and load latest cart information.
 * Also returns new shipping methods available.
 * @param {String('0'|'1')} guestFlag
 * @param {String} postalCode
 * @returns {Promise.<Array.<{label: String, amount: String, identifier: String, detail: String}>>}
 */
export function updateShippingMethods(guestFlag, postalCode) {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    return dispatch(requestApplePayPIB(brand, postalCode, guestFlag))
    .then(() => dispatch(loadCart(brand)))
    .then(() => {
      const { applePay: { deliveryOptions }, cart } = getState();
      const shippingCost = cart[brand].orderSummary.shippingCost;
      const fetchedShippingMethods = createShippingMethodObject(deliveryOptions, shippingCost);

      dispatch(createShippingMethod(fetchedShippingMethods[0]));

      return fetchedShippingMethods;
    });
  };
}

export function toggleApplePayLoginPopup() {
  return {
    type: TOGGLE_APPLEPAY_LOGIN_POPUP,
  };
}

export function setNativeAppApplePayStatus(supportedNetworks) {
  return dispatch => getNativeAppApplePayStatus(supportedNetworks)
    .then(status => dispatch({
      type: SET_NATIVEAPP_APPLEPAY_STATUS,
      status,
    }));
}
