import {
  mapShippingAddress,
  mapBillingAddress,
  mapCVSAddressFromQuery,
  mapPickupAddressFromStore,
  mapAddressToAPIResponse,
  mapDeliveryAddress,
} from 'redux/modules/checkout/mappings/deliveryMappings';
import { getCart, bookProvisionalInventory, bookAndLoadDeliveryOptions, getAndSetShipTo } from 'redux/modules/cart';
import { removeCheckoutStatus } from 'redux/modules/checkout';
import { addPickupStoreAddress, editPickupStoreAddress, loadCurrentPickupStoreAddress, setCVSAddress } from 'redux/modules/account/address';
import * as userInfoActions from 'redux/modules/account/userInfo';
import { getStoreDetails } from 'redux/modules/checkout/delivery/store/actions';
import { setPaymentMethod } from 'redux/modules/checkout/payment/actions';
import { getTranslation } from 'i18n';
import { constantsGenerator } from 'utils';
import { routes, routePatterns } from 'utils/urlPatterns';
import noop from 'utils/noop';
import char from 'utils/characters';
import { isShippingDeliveryType, isCVSDeliveryType, getDeliveryReqListParams } from 'utils/deliveryUtils';
import { paddingMobileNumber } from 'utils/format';
import { replaceUrlParams, getCurrentBrand, getUrlWithQueryData, redirect } from 'utils/routing';
import { deliveryApi, apiTypes } from 'config/api';
import constants from 'config/site/default';
import config from 'config';
import { REMOVE_HYPHEN } from 'helpers/regex';
import { SessionStorage } from 'helpers/WebStorage';

const {
  deliveryTypes: { STORE_PICKUP, SEJ, LAWSON, FM, SHIPPING },
  deliveryPreferences: { GROUP_DELIVERY, SPLIT_DELIVERY },
  cvsCancelArgs,
  defaultSplitNumber,
  FM_STORE_TYPE,
  DEFAULT_SHIPPING_ADDRESS_ID,
  payment: paymentConst,
  brandName,
} = constants;

export const SET_SHIPPING_ADDRESS_FIELD = 'DELIVERY/SET_SHIPPING_ADDRESS_FIELD';
export const SET_SHIPPING_ADDRESS_RESULT = 'DELIVERY/SET_SHIPPING_ADDRESS_RESULT';
export const TOGGLE_DELIVERY_EDIT = 'DELIVERY/TOGGLE_DELIVERY_EDIT';
export const TOGGLE_DELIVERY_EDIT_OPTION = 'DELIVERY/TOGGLE_DELIVERY_EDIT_OPTION';
export const LOAD_DELIVERY_METHOD_SUCCESS = 'DELIVERY/LOAD_DELIVERY_METHOD_S';
export const LOAD_DELIVERY_METHOD_FAIL = 'DELIVERY/LOAD_DELIVERY_METHOD_F';
export const LOAD_DELIVERY_METHODS_SUCCESS = 'DELIVERY/LOAD_DELIVERY_METHODS_S';
export const LOAD_DELIVERY_METHODS_FAIL = 'DELIVERY/LOAD_DELIVERY_MES';
export const SAVE_SHIPPING_ADDRESS_SUCCESS = 'DELIVERY/SAVE_SHIPPING_ADDRESS_S';
export const SAVE_SHIPPING_ADDRESS_FAIL = 'DELIVERY/SAVE_SHIPPING_ADDRESS_F';
export const SAVE_SHIPPING_ADDRESS_LOCALLY = 'DELIVERY/SAVE_SHIPPING_ADDRESS_LOCALLY';
export const SAVE_AS_BILLING_ADDRESS_SUCCESS = 'DELIVERY/SAVE_AS_BILLING_ADDRESS_S';
export const SAVE_AS_BILLING_ADDRESS_FAIL = 'DELIVERY/SAVE_AS_BILLING_ADDRESS_F';
export const TOGGLE_SET_BILLING_ADDRESS = 'DELIVERY/TOGGLE_SET_BILLING_ADDRESS';
export const SET_ADDRESS_TO_EDIT = 'DELIVERY/SET_ADDRESS_TO_EDIT';
export const LOAD_SHIPPING_THRESHOLD_SUCCESS = 'DELIVERY/LOAD_SHIPPING_THRESHOLD_S';
export const LOAD_SHIPPING_THRESHOLD_FAIL = 'DELIVERY/LOAD_SHIPPING_THRESHOLD_F';
export const SET_DELIVERY_METHOD_OPTION = 'DELIVERY/SET_DELIVERY_METHOD_OPTION';
export const SET_DELIVERY_PREFERENCE = 'DELIVERY/SET_DELIVERY_PREFERENCE';
export const RELOAD_DELIVERY_METHODS = 'DELIVERY/RELOAD_DELIVERY_METHODS';
export const SET_BILLING_ADDRESS_AS = 'DELIVERY/SET_BILLING_ADDRESS_AS';
export const LOAD_DELIVERY_METHOD = 'DELIVERY/LOAD_DELIVERY_METHOD';

const LOAD_DELIVERY_METHODS = 'DELIVERY/LOAD_DELIVERY_METHODS';
const SAVE_AS_BILLING_ADDRESS = 'DELIVERY/SAVE_AS_BILLING_ADDRESS';
const LOAD_SHIPPING_THRESHOLD = 'DELIVERY/LOAD_SHIPPING_THRESHOLD';
const SAVE_SHIPPING_ADDRESS = 'DELIVERY/SAVE_SHIPPING_ADDRESS';
const DONT_CARE_NEXTDAY_DELV = 'DELIVERY/DONT_CARE_NXTDAY_DELV';
const RESET_NEXTDAY_DELV = 'DELIVERY/RESET_NEXTDAY_DELV';

export const GET_FM_STORE = 'DELIVERY/GET_FM_STORE';
export const GET_FM_STORE_SUCCESS = 'DELIVERY/GET_FM_STORE_S';
export const GET_FM_STORE_FAIL = 'DELIVERY/GET_FM_STORE_F';

export const SET_DELIVERY_METHOD_SUCCESS = 'DELIVERY/SET_DELIVERY_METHOD_SUCCESS';
export const SET_DELIVERY_METHOD_FAIL = 'DELIVERY/SET_DELIVERY_METHOD_FAIL';

export const SHOW_ADDRESS_BOOK = 'DELIVERY/SHOW_ADDRESS_BOOK';
export const SAVE_AND_CONTINUE = 'DELIVERY/SAVE_AND_CONTINUE';

export const SET_PREVIOUS_LOCATION_COOKIE = 'DELIVERY/PREVIOUS_LOCATION_GS';
export const REMOVE_PREVIOUS_LOCATION_COOKIE = 'DELIVERY/PREVIOUS_LOCATION_GR';
export const GET_PREVIOUS_LOCATION_COOKIE = 'DELIVERY/PREVIOUS_LOCATION_GG';

export const LOAD_SAME_DAY_DELIVERY_CHARGE = 'DELIVERY/LOAD_SAME_DAY_DELIVERY_CHARGE';
export const LOAD_SAME_DAY_DELIVERY_CHARGE_SUCCESS = 'DELIVERY/LOAD_SAME_DAY_DELIVERY_CHARGE_S';
export const LOAD_SAME_DAY_DELIVERY_CHARGE_FAIL = 'DELIVERY/LOAD_SAME_DAY_DELIVERY_CHARGE_F';

export const SET_SELECTED_DELIVERY_TYPE = 'DELIVERY/SELECT_DELIVERY_TYPE';
export const TOGGLE_CVS_NAV_MODAL = 'DELIVERY/TOGGLE_CVS_NAV_MODAL';

export const GET_PREFECTURE = 'DELIVERY/GET_PREFECTURE';
export const GET_PREFECTURE_SUCCESS = 'DELIVERY/GET_PREFECTURE_SUCCESS';
export const GET_PREFECTURE_FAIL = 'DELIVERY/GET_PREFECTURE_FAIL';

export const SET_FROM_PICKUP_STORE_AS = 'DELIVERY/SET_FROM_PICKUP_STORE_AS';

const deliveryConstGenerator = constantsGenerator('DELIVERY');

export const {
  SET_DELIVERY_METHODS,
  SET_DELIVERY_METHODS_SUCCESS,
  SET_DELIVERY_METHODS_FAIL,
} = deliveryConstGenerator('SET_DELIVERY_METHODS');
export const {
  LOAD_SPLIT_DETAILS,
  LOAD_SPLIT_DETAILS_SUCCESS,
  LOAD_SPLIT_DETAILS_FAIL,
} = deliveryConstGenerator('LOAD_SPLIT_DETAILS');

const { cookies, sessionStorageKeys: { dontCareNextDayDelvFlag } } = config.app;
const promiseConfig = {
  host: `${deliveryApi.base}/{brand}/${deliveryApi.region}`,
  credentials: 'include',
  headers: {
    'Content-Type': 'text/plain',
  },
};
const promiseConfigPUT = {
  ...promiseConfig,
  host: `${deliveryApi.putUrl}/{brand}/${deliveryApi.region}`,
};

const errorHandler = {
  showMessage: true,
  enableReaction: true,
  apiType: apiTypes.GDS,
};

export function isDeliveryMethodOptionsLoaded(globalState) {
  return globalState.delivery && globalState.delivery.methodOptionsLoaded;
}

export function isDeliveryMethodLoaded(globalState) {
  return globalState.delivery && globalState.delivery.methodLoaded;
}

export function isDeliveryChargesLoaded(globalState) {
  return globalState.delivery && globalState.delivery.chargesLoaded;
}

export function isSameDayDeliveryChargesLoaded(globalState) {
  return globalState.delivery && globalState.delivery.sameDayDeliveryChargesLoaded;
}

export function isSplitDetailsLoaded(globalState) {
  return globalState.delivery && globalState.delivery.splitDetailsLoaded;
}

/**
 * `GET /delivery` GDS API
 * @returns {Promise<*>}
 */
export function loadDeliveryMethod() {
  return (dispatch, getState) => {
    const globalState = getState();
    const cart = getCart(globalState, getCurrentBrand(globalState));
    const isFromDeliveryPage = routePatterns.delivery.test(globalState.routing.locationBeforeTransitions.pathname);

    return dispatch({
      types: [LOAD_DELIVERY_METHOD, LOAD_DELIVERY_METHOD_SUCCESS, LOAD_DELIVERY_METHOD_FAIL],
      promise: (client, brand) => client.get(deliveryApi.deliveryMethod, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.host, { brand }),
        params: {
          cart_no: cart.cartNumber,
          token: cart.token,
          client_id: deliveryApi.clientId,
        },
      }),
      isFromDeliveryPage,
      errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'getDeliveryMethod' },
    });
  };
}

export function setShippingAddress(name, value) {
  return {
    type: SET_SHIPPING_ADDRESS_FIELD,
    name,
    value,
  };
}

export function setShippingSelectedAddress(address) {
  return {
    type: SET_SHIPPING_ADDRESS_RESULT,
    address,
  };
}

export function toggleDeliveryEdit(shouldEditDeliveryTypeApplied = true) {
  return {
    type: TOGGLE_DELIVERY_EDIT,
    shouldEditDeliveryTypeApplied,
  };
}

export function toggleDeliveryEditOption() {
  return {
    type: TOGGLE_DELIVERY_EDIT_OPTION,
  };
}

export function reloadDeliveryMethodOptions() {
  return {
    type: RELOAD_DELIVERY_METHODS,
  };
}

/**
 * Method to set deliveryMethod locally.
 * @param  {String} deliveryType
 * @param  {String} splitNo
 * @param  {Boolean} isEditShippingPreference = true - editing shippingPreference section
 * @param  {String} date
 * @param  {String} time
 * @return {Promise}        Return a promise
 **/
export function setDeliveryMethodOption(deliveryType, splitNo = defaultSplitNumber, isEditShippingPreference, date = '', time = '') {
  return {
    type: SET_DELIVERY_METHOD_OPTION,
    result: deliveryType,
    date: date === 'standard' ? '' : date,
    time,
    isEditShippingPreference,
    isDeliveryStandard: (date === 'standard'),
    splitNo,
  };
}

export function resetDeliveryMethodOption() {
  return {
    type: SET_DELIVERY_METHOD_OPTION,
    result: '',
  };
}

export function setLocalDeliveryMethodTypeAndSelection(deliveryType, shouldResetDeliveryApplied) {
  return (dispatch) => {
    dispatch({
      type: SET_DELIVERY_METHOD_SUCCESS,
      deliveryType,
      shouldResetDeliveryApplied,
    });

    return Promise.resolve();
  };
}

export function setNextDayDeliveryDontCareFlag(brand) {
  return (dispatch, getState) => {
    const { auth: { user } } = getState();

    // Setting 'user.memberHash' as the sessionStorage flag value so we can compare the value of
    // OP.LGN cookie against the value of the flag to check whether it is the same user session.
    SessionStorage.setItem(
      `${brand}-${dontCareNextDayDelvFlag}`,
      user.memberHash,
    );

    return { type: DONT_CARE_NEXTDAY_DELV };
  };
}

export function resetNextDayDeliveryDontCareFlag(brand) {
  SessionStorage.removeItem(`${brand}-${dontCareNextDayDelvFlag}`);

  return { type: RESET_NEXTDAY_DELV };
}

/**
 * Requests `GET /split` GDS API to fetch split details for products in cart.
 * @returns {Promise<*>}
 */
export function loadSplitDetails() {
  return (dispatch, getState) => {
    const globalState = getState();
    const currentBrand = getCurrentBrand(globalState);
    const cart = getCart(globalState, currentBrand);

    return dispatch({
      types: [LOAD_SPLIT_DETAILS, LOAD_SPLIT_DETAILS_SUCCESS, LOAD_SPLIT_DETAILS_FAIL],
      promise: (client, brand) => client.get(deliveryApi.split, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.host, { brand }),
        params: {
          client_id: deliveryApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
        },
      }),
      errorHandler: { ...errorHandler, customErrorKey: 'loadSplitDetails' },
    });
  };
}

export function loadDeliveryMethodOptions(brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const currentBrand = brand || getCurrentBrand(globalState);
    const cart = getCart(globalState, currentBrand);

    return dispatch({
      types: [LOAD_DELIVERY_METHODS, LOAD_DELIVERY_METHODS_SUCCESS, LOAD_DELIVERY_METHODS_FAIL],
      promise: client => client.get(deliveryApi.deliverMethod, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.host, { brand: currentBrand }),
        params: {
          client_id: deliveryApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
        },
      }),
      errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'loadDeliveryOptions' },
    });
  };
}

export function loadDeliveryCharges() {
  return {
    types: [LOAD_SHIPPING_THRESHOLD, LOAD_SHIPPING_THRESHOLD_SUCCESS, LOAD_SHIPPING_THRESHOLD_FAIL],
    promise: (client, brand) => client.get(deliveryApi.shippingThreshold, {
      ...promiseConfig,
      host: replaceUrlParams(promiseConfig.host, { brand }),
      params: {
        client_id: deliveryApi.clientId,
        client_secret: deliveryApi.clientSecret,
        cd_id: deliveryApi.cdId,
      },
    }),
    errorHandler: { enableReaction: true },
  };
}

function getFamilyMartStoreDetails(storeNo) {
  return {
    types: [GET_FM_STORE, GET_FM_STORE_SUCCESS, GET_FM_STORE_FAIL],
    promise: (client, brand) => client.get(deliveryApi.receivestore, {
      ...promiseConfig,
      host: replaceUrlParams(promiseConfig.host, { brand }),
      params: {
        store_no: storeNo,
        client_id: deliveryApi.clientId,
        client_secret: deliveryApi.clientSecret,
        store_type: FM_STORE_TYPE,
      },
    }),
    errorHandler: { ...errorHandler, customErrorKey: 'cvsNotFound' },
  };
}

/**
 * @typedef {Object} DelvMethodObj
 * @property {String} splitNo
 * @property {String} deliveryType
 * @property {String} deliveryReqDate
 * @property {String} deliveryReqTime
 */

/**
 * Requests `PUT /delivery` GDS API to set delivery preferences.
 * [TODO] Also resets the flag that ignored next day availablity. (?)
 * @param {Array.<DelvMethodObj>} shipments
 * @param {String('C'|'S')} splitDiv
 * @returns {Promise<*>}
 */
export function setDeliveryMethods(
  shipments = [{ deliveryType: '', splitNo: defaultSplitNumber }],
  splitDiv = GROUP_DELIVERY,
  updateState = true,
) {
  const delvReqList = getDeliveryReqListParams(shipments);

  return (dispatch, getState) => {
    const globalState = getState();
    const currentBrand = getCurrentBrand(globalState);
    const cart = getCart(globalState, currentBrand);

    return dispatch({
      types: [SET_DELIVERY_METHODS, SET_DELIVERY_METHODS_SUCCESS, SET_DELIVERY_METHODS_FAIL],
      promise: (client, brand) => client.post(deliveryApi.deliveryMethod, {
        ...promiseConfigPUT,
        host: replaceUrlParams(promiseConfigPUT.host, { brand }),
        params: {
          cart_no: cart.cartNumber,
          token: cart.token,
          client_id: deliveryApi.clientId,
          split_div: splitDiv,
          ...delvReqList,
        },
      }),
      splitDiv,
      shipments,
      updateState,
      errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'setDeliveryType' },
    })
    .then(() => {
      if (
        splitDiv !== SPLIT_DELIVERY &&
        shipments[0].deliveryType === ''
      ) {
        return dispatch(resetNextDayDeliveryDontCareFlag(currentBrand));
      }

      return Promise.resolve();
    });
  };
}

/**
* Redux method to save ship_to address in state.
 * @return {Object} action.data will have the currentShippingAddress.
 **/
function saveShippingAddressLocally(mappedAddress) {
  return (dispatch, getState) =>
    dispatch({
      type: SAVE_SHIPPING_ADDRESS_LOCALLY,
      data: mappedAddress ? mapDeliveryAddress(mappedAddress) : mapAddressToAPIResponse(getState().delivery.shippingAddress),
    });
}

/**
 * Redux method to save Shipping address to GDS-ShipTo for Shipping , CVS and Uniqlo.
 * Public Function - Since saveShippingAddress() is using in /redux/modules/cart/checkout.js
 * @param  {String} fromCVS=null - To save CVS address
 * @param  {String} fromStore = null - To Save Uniqlo address.
 * @param  {Boolean} isEditShipTo = true - To edit ship_to first name and last name for new user.
 * @param  {Boolean} loadOnSuccess = true - Avoid unnecessary GET /ship_to.
 * @param  {Boolean} doPIBCall = true - Avoid unnecessary PIB call to GDS.
 * @return {Promise}        Return a promise
 **/
export function saveShippingAddress(fromCVS = null, fromStore, isEditShipTo, doPIBCall = true) {
  return (dispatch, getState) => {
    const globalState = getState();
    const cartBrand = getCurrentBrand(globalState);
    const cart = getCart(globalState, cartBrand);
    const {
      delivery: {
        shippingAddress,
        currentShippingAddress,
        deliveryMethod,
      },
      userInfo: {
        userDefaultDetails,
        userInfoAddressList,
      },
      deliveryStore: {
        pickupStoreData,
      },
    } = globalState;
    let mappedAddress;
    let address;
    const {
      delivery: { sevenEleven, sevenElevenText, lawson, familyMart, uniqloStore, ministop },
      address: { prefectureList },
    } = getTranslation();

    let defaultAddress;

    if (userDefaultDetails.firstName && userDefaultDetails.lastName) {
      defaultAddress = userDefaultDetails;
    }

    if (!defaultAddress && userInfoAddressList) {
      defaultAddress = userInfoAddressList.find(item => item.isDefaultShippingAddress);
    }

    if (fromCVS) {
      // Use Seven-Eleven (with hyphen) for receiver_corporate_nm : ASS-993
      const cvsStores = {
        sevenEleven: {
          withHyphen: sevenEleven,
          withoutHyphen: sevenElevenText,
        },
        lawson,
        familyMart,
        ministop,
      };

      mappedAddress = mapCVSAddressFromQuery(fromCVS, defaultAddress, cvsStores, prefectureList);
    } else if (fromStore) {
      mappedAddress = mapPickupAddressFromStore(pickupStoreData, defaultAddress, uniqloStore, cartBrand);
    } else if (isEditShipTo) {
      const deliveryType = deliveryMethod[0] && deliveryMethod[0].deliveryType;

      const mobileNumber = (!currentShippingAddress.cellPhoneNumber
       || currentShippingAddress.cellPhoneNumber === 'undefined'
       || currentShippingAddress.cellPhoneNumber === 'null'
      ) ? '' : currentShippingAddress.cellPhoneNumber;

      address = {
        ...currentShippingAddress,
        firstName: userDefaultDetails.firstName,
        lastName: userDefaultDetails.lastName,
        firstNameKatakana: userDefaultDetails.firstNameKatakana,
        lastNameKatakana: userDefaultDetails.lastNameKatakana,
        // receiver-mobile-number is stripped of the padding in the response.
        cellPhoneNumber: (deliveryType === STORE_PICKUP && cartBrand === brandName.gu)
          ? paddingMobileNumber(mobileNumber)
          : mobileNumber,
      };

      const delvType = deliveryMethod[0] && deliveryMethod[0].deliveryType;

      if (isCVSDeliveryType(delvType)) {
        // For CVS we need to make sure to send 'receiver_addr1' with a fake value if is empty
        address.street = address.street || char['. '];
      }

      mappedAddress = mapShippingAddress(address, isEditShipTo);
    } else {
      mappedAddress = mapShippingAddress(shippingAddress.postalCode ? shippingAddress : userDefaultDetails);
    }

    return dispatch({
      types: [SAVE_SHIPPING_ADDRESS, SAVE_SHIPPING_ADDRESS_SUCCESS, SAVE_SHIPPING_ADDRESS_FAIL],
      promise: (client, brand) => client.post(deliveryApi.deliveryAddress, {
        ...promiseConfigPUT,
        host: replaceUrlParams(promiseConfigPUT.host, { brand }),
        params: {
          client_id: deliveryApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
          ...mappedAddress,
        },
      }),
      errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'saveShippingAddress' },
    })
    .then(() => (doPIBCall ? dispatch(bookProvisionalInventory(cartBrand)) : Promise.resolve()))
    .then(() => dispatch(saveShippingAddressLocally(mappedAddress)));
  };
}

export function saveAndContinue(preserveSelection) {
  return {
    type: SAVE_AND_CONTINUE,
    preserveSelection,
  };
}

/**
* Redux method to save ship_to address and delivery_type for user in state.
* @param {String} type - delivery type selected
* @param {String} date - delivery date selected
* @param {String} time - delivery time selected
**/
function setDefaultAsShipToAddressLocally(type) {
  return (dispatch) => {
    dispatch(setDeliveryMethodOption(type, defaultSplitNumber, false));
    dispatch(saveShippingAddressLocally());
    dispatch(saveAndContinue());
  };
}

/**
 * Redux method to save an address to shippingAddress key.
 * @param {Object} address - this will be loaded to the above said shippingAddress key
 * @return {Object}
 **/
export function setAddressToEdit(address) {
  return {
    type: SET_ADDRESS_TO_EDIT,
    address,
  };
}

/**
 * Get defaultShippingAddress from address list and 001
 **/
export function getDefaultShippingAddress(state) {
  const {
    userInfo: {
      userInfoAddressList,
      userDefaultDetails,
    },
  } = state;

  let defaultShippingAddress;

  if (userInfoAddressList && userInfoAddressList.length) {
    defaultShippingAddress = userInfoAddressList.find(item => item.isDefaultShippingAddress);
  }

  if (!defaultShippingAddress) {
    defaultShippingAddress = userDefaultDetails;
  }

  return defaultShippingAddress;
}

/**
 * Redux method to save shipping preferences.
 * Public function - Since it is used in /src/pages/Delivery/Methods/AddressBook.js.
 * @return {Promise}        Return a promise
 **/
export function saveShippingPreferences() {
  return (dispatch, getState) => {
    const globalState = getState();
    const { delivery: { deliveryMethod, deliveryPreference } } = globalState;
    const currentBrand = getCurrentBrand(globalState);

    return dispatch(setDeliveryMethods(deliveryMethod, deliveryPreference))
      .then(() => dispatch(bookAndLoadDeliveryOptions(currentBrand)))
      .then(() => dispatch(saveAndContinue()));
  };
}

/**
 * Save billing address
 * @param optional billing Address
 * @usage delivery page & payment page & account-creditcard page
 */
export function saveAsBillingAddress(billingAddress) {
  return (dispatch, getState) => {
    const globalState = getState();
    const cart = getCart(globalState, getCurrentBrand(globalState));
    const { auth, delivery: { shippingAddress, currentShippingAddress }, userInfo: { userDefaultDetails } } = globalState;
    const currentAddress = billingAddress || currentShippingAddress.firstName && currentShippingAddress || shippingAddress;
    const mail = (userDefaultDetails && userDefaultDetails.email) || auth.user.email || '';

    // To make sure proper email is taken.
    const addressToPass = {
      ...currentAddress,
      email: mail || currentAddress.email,
    };

    return dispatch({
      types: [SAVE_AS_BILLING_ADDRESS, SAVE_AS_BILLING_ADDRESS_SUCCESS, SAVE_AS_BILLING_ADDRESS_FAIL],
      promise: (client, brand) => client.post(deliveryApi.billingAddress, {
        ...promiseConfigPUT,
        host: replaceUrlParams(promiseConfigPUT.host, { brand }),
        params: {
          client_id: deliveryApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
          ...mapBillingAddress(addressToPass),
        },
      }),
      errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'setBillingAddress' },
    });
  };
}

/**
* Redux Method to set delivery method with default delivery preference.
* @param {Boolean} resetDelivery - true if we have to reset delivery with default preference
*/
export function setDeliveryWithDefaultPreferenceIfNeeded(resetDelivery = false) {
  return (dispatch, getState) => {
    const {
      delivery: {
        deliveryPreference,
        deliveryMethod,
        deliveryTypeApplied,
        defaultDeliveryPreference,
        deliveryMethodList,
        splitCount,
        deliveryTypes,
      },
     } = getState();
    const deliveryType = !deliveryTypes.includes(SHIPPING)
      ? deliveryTypes.find(item => isShippingDeliveryType(item))
      : SHIPPING;
    const isPreferenceAvailable = deliveryMethodList[defaultSplitNumber][deliveryPreference]
      && deliveryMethodList[defaultSplitNumber][deliveryPreference].deliveryTypes.includes(deliveryType);
    let shipmentDelvDetails = [];
    let preference;

    if (isShippingDeliveryType(deliveryTypeApplied) && !resetDelivery && isPreferenceAvailable) {
      shipmentDelvDetails = deliveryMethod;
      preference = deliveryPreference;
    } else {
      preference = defaultDeliveryPreference;

      const shipmentsCount = preference === GROUP_DELIVERY ? defaultSplitNumber : splitCount;

      for (let index = 1; index <= shipmentsCount; index++) {
        shipmentDelvDetails.push({
          splitNo: index.toString(),
          deliveryType: resetDelivery ? '' : deliveryType,
          deliveryReqDate: '',
          deliveryReqTime: '',
        });
      }
    }

    return dispatch(setDeliveryMethods(shipmentDelvDetails, preference, false));
  };
}

/**
 * A thunk that couples the following GDS APIs requests
 *  -> PUT /delivery (set delivery methods with delivery preference)
 *  -> PUT /cart_id (provisional inventory booking)
 *  -> GET /delivery_selectable (load delivery options)
 * @param {Array} deliveryMethods
 * @param {String('C'|'S')} deliveryPreference
 */
export function setDelvMethodsDoPIBAndLoadDelvOptions(deliveryMethods, deliveryPreference) {
  return (dispatch, getState) => {
    const globalState = getState();
    const currentBrand = getCurrentBrand(globalState);

    return dispatch(setDeliveryMethods(deliveryMethods, deliveryPreference))
      .then(() => dispatch(bookAndLoadDeliveryOptions(currentBrand)));
  };
}

export function setShipToAndContinue() {
  return (dispatch, getState) => {
    const globalState = getState();
    const defaultShippingAddress = getDefaultShippingAddress(globalState);
    const { delivery: { deliveryTypes } } = globalState;
    const deliveryType = !deliveryTypes.includes(SHIPPING)
      ? deliveryTypes.find(item => isShippingDeliveryType(item))
      : SHIPPING;

    dispatch(setAddressToEdit(defaultShippingAddress));
    dispatch(setDefaultAsShipToAddressLocally(deliveryType));

    // @TODO: this action should be in the then of the previous.

    return dispatch(setDeliveryWithDefaultPreferenceIfNeeded())
      .then(() => dispatch(saveShippingAddress()))
      .then(() => dispatch(loadDeliveryMethodOptions()))
      .then(() => {
        const { delivery: { isSplitDeliveryAvailable } } = getState();

        return isSplitDeliveryAvailable
          ? dispatch(loadSplitDetails())
          : Promise.resolve();
      });
  };
}

/**
 * Redux method to set deliveryMethod and call PIB if required.
 * @private
 * @param  {String} deliveryType
 * @param  {Boolean} callProvisionalInventory
 * @return {Promise} Returns a promise
 **/
function setDeliveryMethod(deliveryType, callProvisionalInventory = false) {
  return dispatch => (callProvisionalInventory
    ? dispatch(setDelvMethodsDoPIBAndLoadDelvOptions({ deliveryType, splitNo: defaultSplitNumber }))
    : dispatch(setDeliveryMethods([{ deliveryType, splitNo: defaultSplitNumber }]))
  );
}

export function removeDeliverySelected() {
  return dispatch => dispatch(setDeliveryWithDefaultPreferenceIfNeeded(true))
    .then(() => dispatch(toggleDeliveryEditOption()));
}

export function onSetBillingAddress() {
  return {
    type: TOGGLE_SET_BILLING_ADDRESS,
  };
}

function setCVSShippingMethod(cvsBrand, params) {
  const { type } = userInfoActions.getCvsAPIConfigInfo(cvsBrand);

  return dispatch => dispatch(setDeliveryMethod(type))
   .then(() => dispatch(userInfoActions.loadAllAddresses()))
    .then(() => dispatch(saveShippingAddress(params)));
}

/**
 * Redux method to get prefecture with zipcode.
 * @public
 * @param  {String} zipCode - zipcode to get prefecture
 * @return {Promise} Returns a promise
 **/
export function getPrefectureWithZipcode(zipCode) {
  return {
    types: [GET_PREFECTURE, GET_PREFECTURE_SUCCESS, GET_PREFECTURE_FAIL],
    promise: client => client.get(deliveryApi.getPref, {
      ...promiseConfig,
      host: deliveryApi.storeBase,
      params: {
        KeyPressed: deliveryApi.keyPressed,
        zipCode,
      },
    }),
  };
}

export function setCvsShipToAccount(cvsBrand, params) {
  const { type } = userInfoActions.getCvsAPIConfigInfo(cvsBrand);
  let queryParam = params;
  let defaultPromise = Promise.resolve();

  return (dispatch, getState) => {
    if (type === FM) {
      defaultPromise = dispatch(getFamilyMartStoreDetails(params.fmshop_id))
        .then(() => {
          const { delivery: { fmStoreDetails } } = getState();

          queryParam = {
            ...params,
            zip_cd: fmStoreDetails.zip_cd,
            depot_cd: fmStoreDetails.depot_cd,
            area_cd: fmStoreDetails.area_cd,
          };

          return Promise.resolve();
        });
    } else if (type === SEJ) {
      const { address: { prefectureList } } = getTranslation();
      const regexp = new RegExp(prefectureList.join('|'), 'g');
      const prefecture = queryParam.mise_jusho.match(regexp) || '';

      // If prefecture not available, we should take it from another API with zipcode.
      if (!prefecture) {
        const zipCode = queryParam.X_mise_post && queryParam.X_mise_post.replace(REMOVE_HYPHEN, '');

        defaultPromise = dispatch(getPrefectureWithZipcode(zipCode))
          .then((result) => {
            // If prefecture ie. 'addr_state' in the result available, then apending it to 'mise_jusho'.
            if (result.addr_state) {
              queryParam.mise_jusho = `${result.addr_state}${queryParam.mise_jusho}`;
            }

            return Promise.resolve();
          }, () => Promise.resolve());
      }
    }

    return defaultPromise
      .then(() => dispatch(setCVSAddress(queryParam, cvsBrand)))
      .then(() => dispatch(setCVSShippingMethod(cvsBrand, queryParam)));
  };
}

/**
 * Invoked once user has confirmed UQ/GU store as delivery method
 *  - If there's an existing 980/970 address for the given user, then it updates the address, otherwise it adds a new record.
 * @return {Promise} - Return a promise
 **/
function setPickupStoreAddressToAccount() {
  return dispatch => dispatch(loadCurrentPickupStoreAddress()).catch(noop)
    .then(result => (result ? dispatch(editPickupStoreAddress()) : dispatch(addPickupStoreAddress())));
}

/**
 * Invoked when user selects a particular store from the list.
 *  - Fetch store details from getStoreDetails API for saving uniqlo/GU address to ShipTo.
 *  - Loads default address (UserInfo-001) as UQ/GU store address doesn't has firstName and lastName
 * @return {Promise} - Return a promise
 **/
function getPickupStoreDetails(storeId) {
  return (dispatch, getState) => dispatch(getStoreDetails(storeId))
    .then(() => (userInfoActions.isUserDefaultDetailsLoaded(getState())
      ? Promise.resolve()
      : dispatch(userInfoActions.loadDefaultDetails())
    ))
    .then(() => (userInfoActions.isAllUserInfoAddressesLoaded(getState())
      ? Promise.resolve()
      : dispatch(userInfoActions.loadAllUserInfoAddresses())
    ));
}

/**
 * Invoked when confirms delivery type as UQ/GU store in delivery page (has already selected UQ/GU Store)
 * Save Uniqlo/GU store address to ShipTo and UserInfo addresses (980/970).
 * POST method to save DeliveryMethod as 'STORE_PICKUP'.
 * @public function - Since it is being used in /src/pages/Checkout/Delivery/PickupStore/index.js
 * @return {Promise}
 */
export function confirmStorePickupShippingMethod(storeId) {
  return dispatch => dispatch(getPickupStoreDetails(storeId))
    .then(() => dispatch(setPickupStoreAddressToAccount()))
    .then(() => dispatch(setDeliveryMethod(STORE_PICKUP)))
    // fromCVS = false, fromStore = true
    .then(() => dispatch(saveShippingAddress(false, true)))
    .then(() => dispatch(loadDeliveryMethodOptions()));
}

export function showAddressBook() {
  return {
    type: SHOW_ADDRESS_BOOK,
  };
}

// Handling the previous location set in cookie
export function setPreviousLocation() {
  const domain = config.isProduction ? cookies.domain : null;
  const expires = new Date();

  expires.setTime(expires.getTime() + cookies.cvsredirectCookieExpires);

  return dispatch => dispatch({
    type: SET_PREVIOUS_LOCATION_COOKIE,
    cookie: {
      key: cookies.cvsRedirectKey,
      value: cookies.cvsRedirectCookie,
      expires,
      domain,
      path: cookies.cvsRedirectCookiePath,
    },
  });
}

export function removePreviousLocation() {
  const domain = config.isProduction ? cookies.domain : null;

  return dispatch => dispatch({
    type: REMOVE_PREVIOUS_LOCATION_COOKIE,
    cookie: {
      key: cookies.cvsRedirectKey,
      remove: true,
      domain,
      path: cookies.cvsRedirectCookiePath,
    },
  });
}

export function getPreviousLocation() {
  const domain = config.isProduction ? cookies.domain : null;

  return dispatch => dispatch({
    type: GET_PREVIOUS_LOCATION_COOKIE,
    cookie: {
      key: cookies.cvsRedirectKey,
      domain,
      path: cookies.cvsRedirectCookiePath,
    },
  });
}

/**
 * load default details and save that to ship to while editting delivery method from review order.
 * @param  {Boolean} doPIBCall = true - Avoid unnecessary PIB call to GDS.
 * @return {Promise}        Return a promise
 **/
export function getDefaultShippingAddressAndSavePostalCodeToShipTo(doPIBCall = true) {
  return (dispatch, getState) => {
    const defaultShippingAddress = { postalCode: getDefaultShippingAddress(getState()).postalCode };

    dispatch(setAddressToEdit(defaultShippingAddress));

    // fromCVS = false, fromStore = false, isEditShipTo = false, doPIBCall
    return dispatch(saveShippingAddress(false, false, false, doPIBCall));
  };
}

/**
 * save user's delivery type selection to state so that it can be loaded even after a get cart_id call.
 */
export function setSelectedDeliveryType(deliveryType) {
  return {
    type: SET_SELECTED_DELIVERY_TYPE,
    deliveryType,
  };
}

/**
 *  This action runs all the required sequence to reset
 *  the delivery method and set's the payment to credit card
 *  if current payment is Pay at Uniqlo store or Cash on Delivery.
 *  It will be called from several places, basically anywhere
 *  there's a "edit delivery method" button.
 *  @param {boolean} isFromReviewOrPayment - flag to check if it is called from review order or payment page
 */
export function editDeliveryMethod(isFromReviewOrPayment) {
  return (dispatch, getState) => {
    const state = getState();
    const { payment } = state;
    const brand = getCurrentBrand(state);

    return dispatch(removeDeliverySelected())
      .then(() => {
        dispatch(setSelectedDeliveryType());

        if (isFromReviewOrPayment) {
          return dispatch(userInfoActions.loadDefaultDetails())
            .then(() => dispatch(userInfoActions.loadAllUserInfoAddresses()))
            .then(() => (dispatch(getDefaultShippingAddressAndSavePostalCodeToShipTo())));
        }

        return Promise.resolve();
      })
      .then(() => {
        let setCreditCardPayment = Promise.resolve();

        if ([
          paymentConst.uniqloStore,
          paymentConst.cashOnDelivery,
          paymentConst.postPay,
        ].includes(payment.paymentMethod)) {
          setCreditCardPayment = dispatch(setPaymentMethod(''));
        }

        setCreditCardPayment
          .then(() => dispatch(loadDeliveryMethodOptions()))
          .then(() => {
            dispatch(toggleDeliveryEditOption());
            dispatch(removeCheckoutStatus());
            redirect(getUrlWithQueryData(routes.delivery, { brand }));
          });
      });
  };
}

export function loadSameDayDeliveryCharges() {
  return {
    types: [LOAD_SAME_DAY_DELIVERY_CHARGE, LOAD_SAME_DAY_DELIVERY_CHARGE_SUCCESS, LOAD_SAME_DAY_DELIVERY_CHARGE_FAIL],
    promise: (client, brand) => client.get(deliveryApi.shippingThreshold, {
      ...promiseConfig,
      host: replaceUrlParams(promiseConfig.host, { brand }),
      params: {
        client_id: deliveryApi.clientId,
        client_secret: deliveryApi.clientSecret,
        cd_id: deliveryApi.deliverTodayFeeCode,
      },
    }),
    errorHandler: { enableReaction: true },
  };
}

/**
 * Save or update an address.
 * - This action it's called from the address book to update an existing address
 * - This action it's called to save a new address from the address form
 **/
export function saveEditedAddress(type, id) {
  return (dispatch, getState) => {
    const {
      delivery: {
        setOption,
        shippingAddress,
      },
    } = getState();

    const saveShipToAndLoadDeliveryMethods = () => dispatch(setDeliveryWithDefaultPreferenceIfNeeded())
      .then(() => dispatch(saveShippingAddress()))
      .then(() => dispatch(loadDeliveryMethodOptions()))
      .then(() => {
        const { delivery: { isSplitDeliveryAvailable } } = getState();

        return isSplitDeliveryAvailable
          ? dispatch(loadSplitDetails())
          : Promise.resolve();
      });

    if (type === 'newAddress') {
      // On saving a new address, that needs to be set as SHIP_TO. This is necessary to judge
      // whether input address can be chosen for "same day delivery".
      return dispatch(userInfoActions.saveUserAddress())
       .then(() => saveShipToAndLoadDeliveryMethods());
    } else if (id === DEFAULT_SHIPPING_ADDRESS_ID) {
      // Save address as billingAddress if user wishes to
      const saveBillingAddressPromise = setOption.shouldSetBillingAddress
        ? dispatch(saveAsBillingAddress(shippingAddress))
        : Promise.resolve();

      // Edit function for Registered address of user
      return saveBillingAddressPromise
        .then(() => dispatch(userInfoActions.editMemberAddress()))
        .then(() => {
          const { userInfo: { userDefaultDetails } } = getState();

          return userDefaultDetails.isDefaultShippingAddress
            ? dispatch(userInfoActions.loadDefaultDetails())
            : dispatch(userInfoActions.setDefaultUserAddress(''));
        });
    }

    // Edit function for address of user
    return dispatch(userInfoActions.updateUserInfoAddress(id))
      .then(() => {
        const { userInfo: { userInfoAddressList } } = getState();
        const address = userInfoAddressList && userInfoAddressList.find(item => item.id === id);

        return (address && address.isDefaultShippingAddress)
          ? Promise.resolve()
          : dispatch(userInfoActions.setDefaultUserAddress(id));
      });
  };
}

/**
 * case 1) When a fresh user checkouts for the first time using the Uniqlo Store as shipping option,
 * he wouldn't initially have 001 address with a katakana name in it.
 * This action checks for that special case and then triggers an update of ship_to and inventory_api.
 * - This action is pesently called from payment page credit card save and gift card save.
 * - Not needed on COD case because stores don't support COD option.
 *
 * case 2) For a new user that chooses CVS delivery option,  update ship_to first name and last name using billingAddress.
 **/
export function updateShipToName() {
  const { delivery: { sevenEleven, lawson, familyMart, uniqloStore, ministop } } = getTranslation();

  return (dispatch, getState) => {
    const globalState = getState();
    const brand = getCurrentBrand(globalState);
    const {
      delivery: {
        deliveryMethod,
      },
      cart: {
        [brand]: {
          shippingAddress: {
            firstName,
            lastName,
          },
        },
      },
    } = globalState;

    const deliveryType = deliveryMethod[0] && deliveryMethod[0].deliveryType;
    const shouldUpdateShipToStorePickup = (deliveryType === STORE_PICKUP) && [firstName, lastName].includes(uniqloStore);
    const shouldUpdateShipToCvs = isCVSDeliveryType(deliveryType)
      && ([sevenEleven, lawson, familyMart, ministop].includes(firstName)
      || [sevenEleven, lawson, familyMart, ministop].includes(lastName));
    const shouldUpdateShipTo = shouldUpdateShipToStorePickup || shouldUpdateShipToCvs;

    // fromCVS = false, fromStore = false, isEditShipTo = shouldUpdateShipTo
    return shouldUpdateShipTo ? dispatch(saveShippingAddress(false, false, shouldUpdateShipTo)) : Promise.resolve();
  };
}

/**
 * When user cancels the UQ/GU store pickup popup on delivery page,
 * these calls must be made to send the user back to delivery page.
 */
export function resetDeliveryTypeAndPIB() {
  return (dispatch, getState) => dispatch(setDeliveryWithDefaultPreferenceIfNeeded(true))
    .then(() => dispatch(getAndSetShipTo()))
    .then(() => dispatch(bookProvisionalInventory(getCurrentBrand(getState()))));
}

export function setFromPickupStoreAs(isFromPickupStore) {
  return {
    type: SET_FROM_PICKUP_STORE_AS,
    isFromPickupStore,
  };
}

function isFromCVS(query) {
  if (query.X_finish_arg === cvsCancelArgs.SEJ) {
    return SEJ;
  } else if (query.status === cvsCancelArgs.FM) {
    return FM;
  } else if (query.p_s1 && query.p_s1.includes(routes.payment)) {
    return LAWSON;
  }

  return null;
}

/**
 * Preserve user's delivery selection even after a get cart_id call.
 * The user's selection is set via an extra state in cart state.
 */
export function loadSelectedDeliveryType(location) {
  return (dispatch, getState) => {
    const { cart: { selectedDeliveryType }, delivery: { isFromPickupStore } } = getState();
    const promises = [];
    const cvsOption = (location && location.query) && isFromCVS(location.query);

    const setStorePickupCvsPromise = () => {
      if (cvsOption) {
        dispatch(setDeliveryMethodOption(cvsOption));
      }

      if (isFromPickupStore) {
        dispatch(setDeliveryMethodOption(STORE_PICKUP));
        dispatch(setFromPickupStoreAs(false));
      }
    };

    setStorePickupCvsPromise().then(() => {
      const { delivery: { deliveryMethod, isEditDeliveryAddress, isEditDeliveryOption } } = getState();

      if (!(isEditDeliveryAddress || isEditDeliveryOption)) {
        const deliveryType = deliveryMethod[0] && deliveryMethod[0].deliveryType;

        promises.push(dispatch(setLocalDeliveryMethodTypeAndSelection(deliveryType, true)));
      }
    });

    if (selectedDeliveryType !== 'none') {
      promises.push(dispatch(setLocalDeliveryMethodTypeAndSelection(selectedDeliveryType, isFromPickupStore)));
    }

    return Promise.all(promises);
  };
}

export function toggleCvsNavigationModal() {
  return { type: TOGGLE_CVS_NAV_MODAL };
}

export function setBillingAddressCheckBox(shouldSetBilling) {
  return {
    type: SET_BILLING_ADDRESS_AS,
    shouldSetBilling,
  };
}

/**
 * Set delivery preference locally (C, S)
 *  @param {String} value - preference selected by user
 *  @param {Array} deliveryMethod
 */
function setDeliveryPreferenceLocally(value, deliveryMethod) {
  return (dispatch) => {
    dispatch({
      type: SET_DELIVERY_PREFERENCE,
      value,
      deliveryMethod,
    });

    return Promise.resolve();
  };
}

/**
 * If delivery type is set, set delivery preference locally (C, S).
 * If delivery type is not set, set delivery preference at server side (C, S).
 * If splitDetails are not loaded, call get/split (C, S).
 *  @param {String} value - preference selected by user
 */
export function setDeliveryPreference(deliveryPreference) {
  return (dispatch, getState) => {
    const { delivery: { splitCount, splitDetailsLoaded, deliveryMethod } } = getState();
    const shipmentDelvDetails = [];
    const shipmentsCount = deliveryPreference === GROUP_DELIVERY ? 1 : splitCount;
    const hasDeliveryType = deliveryMethod.length && deliveryMethod[0].deliveryType;

    for (let index = 1; index <= shipmentsCount; index++) {
      shipmentDelvDetails.push({
        splitNo: index.toString(),
        deliveryType: SHIPPING,
        deliveryReqDate: '',
        deliveryReqTime: '',
      });
    }

    return dispatch(setDeliveryPreferenceLocally(deliveryPreference, (hasDeliveryType && shipmentDelvDetails)))
      .then(() => (!splitDetailsLoaded ? dispatch(loadSplitDetails()) : Promise.resolve()));
  };
}

export function resetSplitDetailsLoaded() {
  return {
    type: LOAD_SPLIT_DETAILS_FAIL,
  };
}
