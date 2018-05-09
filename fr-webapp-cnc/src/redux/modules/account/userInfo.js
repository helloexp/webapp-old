import { userInfoApi } from 'config/api';
import constants from 'config/site/default';
import { showAddressBook, saveShippingAddress } from 'redux/modules/checkout/delivery';
import { isAddressComplete } from 'redux/modules/cart';
import { showRegistrationSuccessScreen } from 'redux/modules/checkout/order';
import { constantsGenerator } from 'utils';
import noop from 'utils/noop';
import { routePatterns } from 'utils/urlPatterns';
import { getCurrentBrand } from 'utils/routing';
import { isShippingDeliveryType } from 'utils/deliveryUtils';
import {
  mapCVSUserInfo,
  mapUserInfoAddress,
  mapAllUserAddresses,
  mapAddressToUserInfo,
  mapAddressForRegistration,
} from './mappings/userInfoMapping';

const generateConstants = constantsGenerator('USERINFO');
const RESET_ADDRESS_LOAD_CHECK = 'USERINFO/RESET_ADDRESS_LOAD_CHECK';

export const TOGGLE_SET_BILLING_ADDRESS = 'USERINFO/TOGGLE_SET_BILLING_ADDRESS';

export const {
  LOAD_ALL_USER_INFO_ADDRESSES,
  LOAD_ALL_USER_INFO_ADDRESSES_SUCCESS,
  LOAD_ALL_USER_INFO_ADDRESSES_FAIL,
} = generateConstants('LOAD_ALL_USER_INFO_ADDRESSES');
export const { DELETE_USER_ADDRESS, DELETE_USER_ADDRESS_SUCCESS, DELETE_USER_ADDRESS_FAIL } = generateConstants('DELETE_USER_ADDRESS');
const { REGISTER_GUEST_USER, REGISTER_GUEST_USER_SUCCESS, REGISTER_GUEST_USER_FAIL } = generateConstants('REGISTER_GUEST_USER');
const { PATCH_USER_INFO_ADDRESS, PATCH_USER_INFO_ADDRESS_SUCCESS, PATCH_USER_INFO_ADDRESS_FAIL } = generateConstants('PATCH_USER_INFO_ADDRESS');
const { LOAD_USER_INFO, LOAD_USER_INFO_SUCCESS, LOAD_USER_INFO_FAIL } = generateConstants('LOAD_USER_INFO');
const { ADD_NEW_ADDRESS, ADD_NEW_ADDRESS_SUCCESS, ADD_NEW_ADDRESS_FAIL } = generateConstants('ADD_NEW_ADDRESS');
const { UPDATE_USER_ADDRESS, UPDATE_USER_ADDRESS_SUCCESS, UPDATE_USER_ADDRESS_FAIL } = generateConstants('UPDATE_USER_ADDRESS');
const { GET_USER_ADDRESS, GET_USER_ADDRESS_SUCCESS, GET_USER_ADDRESS_FAIL } = generateConstants('GET_USER_ADDRESS');
const { EDIT_MEMBER_ADDRESS, EDIT_MEMBER_ADDRESS_SUCCESS, EDIT_MEMBER_ADDRESS_FAIL } = generateConstants('EDIT_MEMBER_ADDRESS');

const initialState = {
  allAddressesLoaded: false,
  userAddressLoaded: false,
  userInfoLoaded: false,
  userDefaultDetails: null,
  defaultDetailsLoaded: false,
  userAddressDetails: null,
  cvsLoaded: {
    sevenEleven: false,
    lawson: false,
    familyMart: false,
  },
  cvsAddressSet: false,
  cvsAddress: {
    sevenEleven: null,
    familyMart: null,
    lawson: null,
  },
  shouldSetBillingAddress: true,
};

const infoPromiseConfig = {
  host: userInfoApi.base,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

const promiseConfig = {
  host: userInfoApi.base,
  headers: {
    'Content-Type': 'application/json',
  },
  tokenType: 'Bearer',
};

const {
  cvsStoreNames,
  SEJ_ADDRESS_ID,
  LAWSON_ADDRESS_ID,
  FM_ADDRESS_ID,
  deliveryTypes: {
    SEJ,
    FM,
    LAWSON,
  },
} = constants;
const [SEVEN_ELEVEN_CVS, FAMILY_MART_CVS, LAWSON_CVS] = cvsStoreNames;

export function isUserDefaultDetailsLoaded(globalState) {
  return globalState.userInfo && globalState.userInfo.defaultDetailsLoaded;
}

export function isAllUserInfoAddressesLoaded(globalState) {
  return globalState.userInfo && globalState.userInfo.allAddressesLoaded;
}

export function isUserAddressLoaded(globalState) {
  return globalState.userInfo && globalState.userInfo.userAddressLoaded;
}

export function isUserInfoLoaded(globalState) {
  return globalState.userInfo && globalState.userInfo.userInfoLoaded;
}

export function isCVSLoaded(globalState, cvsBrand) {
  return globalState.userInfo && globalState.userInfo.cvsLoaded[cvsBrand];
}

function getCvsBrandForId(id) {
  switch (id) {
    case SEJ_ADDRESS_ID:
      return SEVEN_ELEVEN_CVS;
    case FM_ADDRESS_ID:
      return FAMILY_MART_CVS;
    case LAWSON_ADDRESS_ID:
      return LAWSON_CVS;
    default:
      return null;
  }
}

export function getCvsAPIConfigInfo(cvsBrand) {
  switch (cvsBrand) {
    case SEVEN_ELEVEN_CVS:
      return {
        apiName: 'sejCvs',
        userAddressId: SEJ_ADDRESS_ID,
        type: SEJ,
      };
    case FAMILY_MART_CVS:
      return {
        apiName: 'fmCvs',
        userAddressId: FM_ADDRESS_ID,
        type: FM,
      };
    case LAWSON_CVS:
      return {
        apiName: 'lawsonCvs',
        userAddressId: LAWSON_ADDRESS_ID,
        type: LAWSON,
      };
    default:
      return null;
  }
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_USER_INFO_SUCCESS:
      const defaultAddress = mapUserInfoAddress(action.result);

      return {
        ...state,
        userDefaultDetails: defaultAddress,
        defaultDetailsLoaded: true,
      };
    case DELETE_USER_ADDRESS:
    case GET_USER_ADDRESS:
      return {
        ...state,
        addressId: action.userAddressId,
      };

    case GET_USER_ADDRESS_SUCCESS:
      const userAddress = action.result;

      if ([SEJ_ADDRESS_ID, LAWSON_ADDRESS_ID, FM_ADDRESS_ID].includes(userAddress.id)) {
        const cvsBrand = getCvsBrandForId(userAddress.id);
        const cvsAddressDetails = mapCVSUserInfo(userAddress);

        return {
          ...state,
          cvsAddress: {
            ...state.cvsAddress,
            [cvsBrand]: cvsAddressDetails,
          },
          cvsLoaded: {
            ...state.cvsLoaded,
            [cvsBrand]: true,
          },
        };
      }

      return {
        ...state,
        userAddressDetails: action.result,
        userAddressLoaded: true,
      };
    case LOAD_ALL_USER_INFO_ADDRESSES_SUCCESS:
      const reqdAddress = action.result.filter(item => parseInt(item.id, 10) >= 2 && parseInt(item.id, 10) <= 100);
      const sortedAddressList = reqdAddress.sort((first, second) => second.updateTimestamp - first.updateTimestamp);

      if (action.sortList) {
        const isDefaultIndex = sortedAddressList.findIndex(item => item.isDefaultShippingAddress === true);
        const isDefaultItem = isDefaultIndex !== -1 && sortedAddressList.splice(isDefaultIndex, 1);

        if (isDefaultItem && isDefaultItem.length) {
          sortedAddressList.splice(0, 0, isDefaultItem[0]);
        }
      }

      const cvsAddress = state.cvsAddress;
      const cvsLoaded = state.cvsLoaded;

      action.result.forEach((addressResult) => {
        if ([SEJ_ADDRESS_ID, LAWSON_ADDRESS_ID, FM_ADDRESS_ID].includes(addressResult.id)) {
          const cvsBrand = getCvsBrandForId(addressResult.id);
          const cvsAddressDetails = mapCVSUserInfo(addressResult);

          cvsAddress[cvsBrand] = cvsAddressDetails;
          cvsLoaded[cvsBrand] = true;
        }
      });

      return {
        ...state,
        userInfoAddressList: mapAllUserAddresses(sortedAddressList),
        allAddressesLoaded: true,
        cvsAddress,
        cvsLoaded,
      };
    case LOAD_ALL_USER_INFO_ADDRESSES_FAIL:
      return {
        ...state,
        userInfoAddressList: [],
      };
    case TOGGLE_SET_BILLING_ADDRESS:
      return {
        ...state,
        shouldSetBillingAddress: !state.shouldSetBillingAddress,
      };
    case GET_USER_ADDRESS_FAIL:
      if ([SEJ_ADDRESS_ID, LAWSON_ADDRESS_ID, FM_ADDRESS_ID].includes(action.userAddressId)) {
        const cvsBrand = getCvsBrandForId(action.userAddressId);

        return {
          ...state,
          cvsAddress: {
            ...state.cvsAddress,
            [cvsBrand]: null,
          },
        };
      }

      return {
        ...state,
      };
    case RESET_ADDRESS_LOAD_CHECK:
      return {
        ...state,
        allAddressesLoaded: false,
        defaultDetailsLoaded: false,
      };
    case DELETE_USER_ADDRESS_FAIL:
    case ADD_NEW_ADDRESS_SUCCESS:
    case EDIT_MEMBER_ADDRESS_SUCCESS:
    case PATCH_USER_INFO_ADDRESS_SUCCESS:
    case UPDATE_USER_ADDRESS_SUCCESS:
    case LOAD_USER_INFO_FAIL:
    case ADD_NEW_ADDRESS_FAIL:
    case PATCH_USER_INFO_ADDRESS_FAIL:
    case UPDATE_USER_ADDRESS_FAIL:
    case EDIT_MEMBER_ADDRESS_FAIL:
    case DELETE_USER_ADDRESS_SUCCESS:
    case REGISTER_GUEST_USER_SUCCESS:
    default:
      return {
        ...state,
      };
  }
}

/**
 * Method to reset address_loaded flags.
 * resets allAddressesLoaded - check for load of 002 to 100 address,
 * resets defaultDetailsLoaded - check for load of registered address of user.
 **/
export function resetLoadAddressCheck() {
  return {
    type: RESET_ADDRESS_LOAD_CHECK,
  };
}

export function loadDefaultDetails() {
  return {
    types: [LOAD_USER_INFO, LOAD_USER_INFO_SUCCESS, LOAD_USER_INFO_FAIL],
    promise: client => client.get(userInfoApi.userInfo, {
      ...promiseConfig,
    }),
    errorHandler: { enableReaction: true },
  };
}

export function loadAllUserInfoAddresses(sortList) {
  return dispatch => dispatch({
    types: [LOAD_ALL_USER_INFO_ADDRESSES, LOAD_ALL_USER_INFO_ADDRESSES_SUCCESS, LOAD_ALL_USER_INFO_ADDRESSES_FAIL],
    promise: client => client.get(userInfoApi.userInfoAddresses, {
      ...promiseConfig,
    }),
    errorHandler: { enableReaction: true },
    sortList,
  }).catch(noop);
}

export function loadAddressBook() {
  return dispatch => dispatch(loadAllUserInfoAddresses()).then(dispatch(showAddressBook()));
}

/**
 * Redux method to load all address saved for user.
 * This includes registered address also.
 * @return {Promise}        Return a promise
 **/
export function loadAllAddresses() {
  return dispatch => dispatch(loadDefaultDetails())
    .then(() => dispatch(loadAllUserInfoAddresses()));
}

/**
 * Redux method to load all address saved for user, only if they are not already loaded.
 * This includes registered address also.
 * @return {Promise}        Return a promise
 **/
export function loadAllAddressesIfNeeded() {
  return (dispatch, getState) =>
  (!isAllUserInfoAddressesLoaded(getState()) ? dispatch(loadAllUserInfoAddresses(true)) : Promise.resolve())
  .then(() => (!isUserDefaultDetailsLoaded(getState()) ? dispatch(loadDefaultDetails()) : Promise.resolve()));
}

function addUserAddress() {
  return (dispatch, getState) => {
    const { delivery } = getState();

    return dispatch({
      types: [ADD_NEW_ADDRESS, ADD_NEW_ADDRESS_SUCCESS, ADD_NEW_ADDRESS_FAIL],
      promise: client => client.post(userInfoApi.userInfoAddresses, {
        ...promiseConfig,
        data: mapAddressToUserInfo(delivery.shippingAddress),
      }),
      errorHandler: { enableReaction: true, showMessage: true, customErrorKey: 'addUserAddress' },
    });
  };
}

export function addAndLoadUserAddresses() {
  return dispatch => dispatch(addUserAddress())
    .then(() => dispatch(loadAllAddresses()));
}

export function patchUserInfoAddress() {
  return (dispatch, getState) => {
    const delivery = getState().delivery;

    return dispatch({
      types: [PATCH_USER_INFO_ADDRESS, PATCH_USER_INFO_ADDRESS_SUCCESS, PATCH_USER_INFO_ADDRESS_FAIL],
      promise: (client) => {
        const patch = client.PATCH;

        return patch(`${userInfoApi.updateAddress}${delivery.shippingAddress.id}.json`, {
          ...promiseConfig,
          data: mapAddressToUserInfo(delivery.shippingAddress),
        });
      },
      errorHandler: { enableReaction: true },
    });
  };
}

export function setDefaultUserAddressCallBack() {
  return (dispatch) => {
    dispatch(showAddressBook());
    dispatch(loadAllAddresses());
  };
}

export function setDefaultUserAddress(userAddressId, isFromMember = false) {
  const body = userAddressId ? { id: userAddressId } : {};

  return dispatch => dispatch({
    types: [UPDATE_USER_ADDRESS, UPDATE_USER_ADDRESS_SUCCESS, UPDATE_USER_ADDRESS_FAIL],
    promise: client => client.put(userInfoApi.defaultShipping, {
      ...promiseConfig,
      data: body,
    }),
    errorHandler: { enableReaction: true },
  })
  .then(() => !isFromMember &&
    dispatch(setDefaultUserAddressCallBack())
  )
  .catch(() => !isFromMember &&
    dispatch(setDefaultUserAddressCallBack())
  );
}

// Load address based on the Id.
export function getUserAddress(userAddressId) {
  return dispatch => dispatch({
    types: [GET_USER_ADDRESS, GET_USER_ADDRESS_SUCCESS, GET_USER_ADDRESS_FAIL],
    promise: client => client.get(`${userInfoApi.updateAddress}${userAddressId}.json`, {
      ...promiseConfig,
    }),
    errorHandler: { enableReaction: true },
    userAddressId,
  });
}

// Load CVS address.
export function getCVSAddress(cvsBrand) {
  const { apiName, userAddressId } = getCvsAPIConfigInfo(cvsBrand);

  return dispatch => dispatch({
    types: [GET_USER_ADDRESS, GET_USER_ADDRESS_SUCCESS, GET_USER_ADDRESS_FAIL],
    promise: client => client.get(userInfoApi[apiName], promiseConfig),
    errorHandler: { enableReaction: true },
    userAddressId,
  });
}

function setNextDefaultShippingAddress(userAddressId) {
  return (dispatch, getState) => {
    const { userInfoAddressList, userDefaultDetails } = getState().userInfo;
    let newDefaultShipping;

    if (isAddressComplete(userDefaultDetails)) {
      return Promise.resolve();
    } else if (userInfoAddressList && userInfoAddressList.length) {
      newDefaultShipping = userInfoAddressList.find(item => item.id !== userAddressId);

      if (newDefaultShipping) {
        return dispatch(setDefaultUserAddress(newDefaultShipping.id, true));
      }
    }

    const { routing: { locationBeforeTransitions: { pathname } }, delivery: { deliveryMethod } } = getState();
    const saveShipTo = !routePatterns.account.test(pathname) &&
      deliveryMethod.length &&
      !(deliveryMethod.length > 1) &&
      isShippingDeliveryType(deliveryMethod[0].deliveryType);

    return (saveShipTo ? dispatch(saveShippingAddress()) : Promise.resolve());
  };
}

/**
 * Method to delete a saved user address in  addressBook.
 * @param {string} userAddressId - Id of address to delete
 * @param {boolean} isDefaultAddress - Is the address to be deleted the default_shipping_address selected by user
 * @param {boolean} shouldLoad - Load the addresses after edit
 * @param {boolean} checkShippingOptions - Flag to check shipping options
 * @return {Promise}        Return a promise
 **/
export function deleteUserAddress(userAddressId, isDefaultAddress, shouldLoad = true, checkShippingOptions = false) {
  return (dispatch, getState) => {
    const { deliveryMethod } = getState().delivery;
    const setNextDefault = checkShippingOptions
      ? isShippingDeliveryType(deliveryMethod.deliveryType)
      : true;

    return dispatch({
      types: [DELETE_USER_ADDRESS, DELETE_USER_ADDRESS_SUCCESS, DELETE_USER_ADDRESS_FAIL],
      promise: client => client.delete(`${userInfoApi.updateAddress}${userAddressId}.json`, promiseConfig),
      errorHandler: { enableReaction: true },
    })
    .then(() => {
      if (isDefaultAddress) {
        const setNextDefaultPromise = setNextDefault
          ? dispatch(setNextDefaultShippingAddress(userAddressId))
          : Promise.resolve();

        return setNextDefaultPromise
          .then(() => dispatch(loadDefaultDetails()))
          .then(() => dispatch(loadAddressBook()));
      }

      return shouldLoad ? dispatch(loadAddressBook()) : Promise.resolve();
    });
  };
}

export function editMemberAddress(address, noCAS) {
  return (dispatch, getState) => {
    const delivery = getState().delivery;
    const updateAddress = address || delivery.shippingAddress;

    return dispatch({
      types: [EDIT_MEMBER_ADDRESS, EDIT_MEMBER_ADDRESS_SUCCESS, EDIT_MEMBER_ADDRESS_FAIL],
      promise: (client) => {
        const patch = client.PATCH;

        return patch(userInfoApi.userInfo, {
          ...promiseConfig,
          data: mapAddressToUserInfo(updateAddress, noCAS),
        });
      },
      errorHandler: { enableReaction: true },
    });
  };
}

export function deleteCVSUserAddress(cvsBrand) {
  const { apiName, userAddressId } = getCvsAPIConfigInfo(cvsBrand);

  return dispatch => dispatch({
    types: [DELETE_USER_ADDRESS, DELETE_USER_ADDRESS_SUCCESS, DELETE_USER_ADDRESS_FAIL],
    promise: client => client.delete(userInfoApi[apiName], promiseConfig),
    errorHandler: { enableReaction: true },
    userAddressId,
  }).then(() => dispatch(getCVSAddress(cvsBrand)));
}

/**
 * Redux method to save ship_to address for user and add the new address.
 * Public function - Since it is used in /src/pages/Delivery/index.js.
 * @return {Promise}        Return a promise
 **/
export function saveUserAddress() {
  return dispatch => dispatch(addUserAddress())
    .then(address => dispatch(setDefaultUserAddress(address.id)));
}

/**
 * In case of COD and Pay_At_Store, for a user without 001, we update the current_shipping_address as 001 too.
 * This ensures that a user that completes an order will have a fully registered 001.
 * After 001 update, the duplicate address, if any, need to be deleted from the address list.
 * @param {Object} address - Address to be updated as 001.
 * @return {Promise}        Return a promise
 **/
export function updateDefaultAddressAndDeleteDuplicate(address) {
  return (dispatch, getState) => dispatch(editMemberAddress(address, true))
  .then(() => {
    const addressList = getState().userInfo.userInfoAddressList;

    // delete the latest shipping address and it is copied to 001
    return addressList && addressList.length
      ? dispatch(deleteUserAddress(addressList[0].id, false, false, true))
      : Promise.resolve();
  });
}

export function updateUserInfoAddress(id) {
  return dispatch => dispatch(patchUserInfoAddress(id))
    .then(() => dispatch(loadAllUserInfoAddresses()));
}

export function onSetBillingAddress() {
  return {
    type: TOGGLE_SET_BILLING_ADDRESS,
  };
}

/**
 * Checks if the default address is set properly for delivery page requirements.
 * @param  {Object}  state redux global state
 * @return {Boolean}       true if default address is complete. false otherwise.
 */
export function isDefaultDetailsComplete(state) {
  const { userDefaultDetails } = state.userInfo;

  return !!(userDefaultDetails
    && userDefaultDetails.prefecture
    && userDefaultDetails.street
    && userDefaultDetails.city
    && userDefaultDetails.lastName
    && userDefaultDetails.firstName
    && userDefaultDetails.lastNameKatakana
    && userDefaultDetails.firstNameKatakana
    && userDefaultDetails.phoneNumber);
}

/**
 * Guest user registration
 */
export function register(formAddress) {
  return (dispatch, getState) => {
    const { applePay } = getState();
    const currentBrand = getCurrentBrand(getState());

    return dispatch({
      types: [REGISTER_GUEST_USER, REGISTER_GUEST_USER_SUCCESS, REGISTER_GUEST_USER_FAIL],
      promise: client => client.post(userInfoApi.userInfo, {
        ...infoPromiseConfig,
        data: mapAddressForRegistration(formAddress, applePay, currentBrand),
      }),
      errorHandler: { enableReaction: true, showMessage: true, customErrorKey: 'registerUserAddress' },
    })
    .then(() => dispatch(showRegistrationSuccessScreen()));
  };
}
