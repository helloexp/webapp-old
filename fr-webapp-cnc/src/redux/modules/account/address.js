import { accountApi, userInfoApi, apiTypes } from 'config/api';
import { UQ_ADDRESS_ID, GU_ADDRESS_ID, brandName } from 'config/site/default';
import { getTranslation } from 'i18n';
import { constantsGenerator } from 'utils';
import { replaceUrlParams, getCurrentBrand } from 'utils/routing';
import { getCVSAddress, getCvsAPIConfigInfo, LOAD_ALL_USER_INFO_ADDRESSES_SUCCESS } from 'redux/modules/account/userInfo';
import { getUserInfoMapped } from './mappings/addressMappings';
import { formatAddressFromQuery } from './Utility/formatAddressObject';
import serializePromises from './Utility/serializePromises';
import { mapAddressToUserInfo, mapPickupStoreAddressToUserInfo } from './mappings/userInfoMapping';

const generateConstants = constantsGenerator('accnt/address');

export const REMOVE_ADDRESS = 'accnt/address/REMOVE_ADDRESS';
export const REMOVE_ADDRESS_SUCCESS = 'accnt/address/REMOVE_ADDRESS_S';
export const REMOVE_ADDRESS_FAIL = 'accnt/address/REMOVE_ADDRESS_F';

export const ADDRESS_SAVE = 'accnt/address/ADDRESS_SAVE';
export const ADDRESS_SAVE_SUCCESS = 'accnt/address/ADDRESS_SAVE_S';
export const ADDRESS_SAVE_FAIL = 'accnt/address/ADDRESS_SAVE_F';

export const ADDRESS_EDIT = 'accnt/address/ADDRESS_EDIT';
export const ADDRESS_EDIT_SUCCESS = 'accnt/address/ADDRESS_EDIT_S';
export const ADDRESS_EDIT_FAIL = 'accnt/address/ADDRESS_EDIT_F';

export const SET_ADDRESS = 'accnt/address/SET_ADDRESS_VALUES';
export const SET_NEWS_LETTER = 'accnt/address/SET_NEWS_LETTER';

export const LOAD_PICKUP_STORE = 'accnt/address/LOAD_PICKUP_STORE';
export const LOAD_PICKUP_STORE_SUCCESS = 'accnt/address/LOAD_PICKUP_STORE_S';
export const LOAD_PICKUP_STORE_FAIL = 'accnt/address/LOAD_PICKUP_STORE_F';

export const REMOVE_STORE_ADDRESS = 'accnt/address/REMOVE_STORE_ADDRESS';
export const REMOVE_STORE_ADDRESS_SUCCESS = 'accnt/address/REMOVE_STORE_ADDRESS_S';
export const REMOVE_STORE_ADDRESS_FAIL = 'accnt/address/REMOVE_STORE_ADDRESS_F';

export const SET_CVS_ADDRESS = 'accnt/address/SET_CVS_ADDRESS';
export const SET_CVS_ADDRESS_SUCCESS = 'accnt/address/SET_CVS_ADDRESS_SUCCESS';
export const SET_CVS_ADDRESS_FAIL = 'accnt/address/SET_CVS_ADDRESS_FAIL';

export const UPDATE_DEFAULT_ADDRESS = 'accnt/address/UPDATE_DEFAULT_ADDRESS';
export const UPDATE_DEFAULT_ADDRESS_S = 'accnt/address/UPDATE_DEFAULT_ADDRESS_S';
export const UPDATE_DEFAULT_ADDRESS_F = 'accnt/address/UPDATE_DEFAULT_ADDRESS_F';

export const SET_ADDRESS_TO_STORE = 'accnt/address/SET_ADDRESS_TO_STORE';

const { RELEASE_APP, RELEASE_APP_SUCCESS, RELEASE_APP_FAIL } = generateConstants('RELEASE_APP');
const { GET_LINKAGE_STATUS, GET_LINKAGE_STATUS_SUCCESS, GET_LINKAGE_STATUS_FAIL } = generateConstants('GET_LINKAGE_STATUS');

const RESET_ADDRESS = 'accnt/address/RESET_ADDRESS';

const initialState = {
  selectedAddress: {},
  addressList: [],
  currentPickupStore: {
    uq: null,
    gu: null,
  },
  loaded: false,
  defaultAddressLoaded: false,
  defaultAddress: null,
  address: {
    newsLetter: [],
  },
  isLinkageStatusLoaded: false,
  hasLinkedAccount: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REMOVE_ADDRESS_SUCCESS:
      if (action.result) {
        return {
          ...state,
          addressRemoved: 'success',
        };
      }

      return {
        ...state,
      };
    case SET_ADDRESS:
      const fields = {};

      fields[action.name] = action.value;
      const address = {
        ...state.address,
        ...fields,
      };

      if (['year', 'month', 'day'].includes(action.name) && address.year && address.month && address.day) {
        address.dob = address.year + address.month + address.day;
      }

      return {
        ...state,
        address,
      };
    case LOAD_ALL_USER_INFO_ADDRESSES_SUCCESS:
      const currentUQStoreFound = action.result.find(addressResult => addressResult.id === UQ_ADDRESS_ID);
      const currentGUStoreFound = action.result.find(addressResult => addressResult.id === GU_ADDRESS_ID);
      let currentPickupStore = {};

      if (currentUQStoreFound || currentGUStoreFound) {
        currentPickupStore = {
          [brandName.uq]: currentUQStoreFound || null,
          [brandName.gu]: currentGUStoreFound || null,
        };
      }

      return {
        ...state,
        currentPickupStore,
      };
    case LOAD_PICKUP_STORE_SUCCESS:
      const { brand, result } = action;

      return {
        ...state,
        currentPickupStore: {
          ...state.currentPickupStore,
          [brand]: result,
        },
      };
    case REMOVE_STORE_ADDRESS_SUCCESS:
      return {
        ...state,
        currentPickupStore: {
          ...state.currentPickupStore,
          [action.brand]: null,
        },
      };
    case ADDRESS_EDIT_SUCCESS:
      const storePickupAddress = [UQ_ADDRESS_ID, GU_ADDRESS_ID].includes(action.result.id) && action.result;
      const currentStoreResult = storePickupAddress
        ? { ...state.currentPickupStore, [action.brand]: storePickupAddress }
        : state.currentPickupStore;

      if (action.result) {
        return {
          ...state,
          addressSaved: 'success',
          currentPickupStore: currentStoreResult,
        };
      }

      return {
        ...state,
      };
    case ADDRESS_SAVE_SUCCESS:
      if (action.result) {
        return {
          ...state,
          addressSaved: 'success',
        };
      }

      return {
        ...state,
      };
    case SET_NEWS_LETTER:
      let newsLetters = state.address.newsLetter;

      if (action.allValue && action.checked) {
        newsLetters = action.allValue;
      } else if (action.allValue && !action.checked) {
        newsLetters = [];
      } else {
        const newsLetter = newsLetters.find(item => item === action.value);

        if (!newsLetter && action.checked) {
          newsLetters.push(action.value);
        } else {
          const newsLetterIndex = newsLetters.indexOf(action.value);

          newsLetters.splice(newsLetterIndex, 1);
        }
      }

      const newAddress = {
        ...state.address,
        newsLetter: newsLetters,
      };

      return {
        ...state,
        address: newAddress,
      };
    case RELEASE_APP_SUCCESS:
      return {
        ...state,
        isLinkageStatusLoaded: false,
      };
    case UPDATE_DEFAULT_ADDRESS:
      return {
        ...state,
        updating: true,
      };
    case UPDATE_DEFAULT_ADDRESS_S:
      return {
        ...state,
        updating: false,
        updated: true,
        updateResponse: action.result,
      };
    case UPDATE_DEFAULT_ADDRESS_F:
      return {
        ...state,
        updating: false,
        updated: false,
        updateError: action.error,
      };
    case SET_ADDRESS_TO_STORE:
      return {
        ...state,
        address: action.address,
      };
    case RESET_ADDRESS:
      return {
        ...state,
        address: initialState.address,
      };
    case GET_LINKAGE_STATUS_SUCCESS:
      const memberIds = action.result.filter(item => item.channelkey !== 'gds-jp') || [];

      return {
        ...state,
        memberIds,
        hasLinkedAccount: !!memberIds.length,
      };
    case RELEASE_APP_FAIL:
    case GET_LINKAGE_STATUS_FAIL:
    case SET_CVS_ADDRESS_FAIL:
    case SET_CVS_ADDRESS_SUCCESS:
    default:
      return state;
  }
}

const promiseConfig = {
  host: `${accountApi.base}/{brand}/${accountApi.region}`,
  headers: {
    'Content-Type': 'text/plain',
  },
};

const userInfoPromiseConfig = {
  host: userInfoApi.base,
  headers: {
    'Content-Type': 'application/json',
  },
  tokenType: 'Bearer',
};

export function isLoaded(globalState) {
  return globalState.address && globalState.address.loaded;
}

export function isCurrentPickupStoreLoaded(globalState) {
  const brand = getCurrentBrand(globalState);

  return globalState.address && globalState.address.currentPickupStore[brand];
}

/**
 * returns the store ID of curent UQ/GU store. Strangely, this is saved in the "phoneNumber" field.
 * @param  {Object} globalState redux global state
 * @return {String}             store ID as string
 */
export function getCurrentPickupStoreId(globalState) {
  const brand = getCurrentBrand(globalState);

  return isCurrentPickupStoreLoaded(globalState) && globalState.address.currentPickupStore[brand].phoneNumber;
}

export function isDefaultAddressLoaded(globalState) {
  return globalState.address && globalState.address.defaultAddressLoaded;
}

export function removeAddress(addressNumber) {
  const addressHost = `${accountApi.addresses}/${addressNumber}`;

  return {
    types: [REMOVE_ADDRESS, REMOVE_ADDRESS_SUCCESS, REMOVE_ADDRESS_FAIL],
    promise: (client, brand) => client.delete(addressHost, {
      host: replaceUrlParams(promiseConfig.host, { brand }),
      tokenType: 'accesstoken',
    }),
    errorHandler: { apiType: apiTypes.ACPF, enableReaction: true },
  };
}

export function setNewAddress(name, value) {
  return {
    type: SET_ADDRESS,
    name,
    value,
  };
}

export function setNewsLetter(value, checked, allValue) {
  return {
    type: SET_NEWS_LETTER,
    value,
    checked,
    allValue,
  };
}

export function setAddressToStore(rawAddress) {
  return {
    type: SET_ADDRESS_TO_STORE,
    address: getUserInfoMapped(rawAddress),
  };
}

// @private
// Edit CVS Address - PATCH
export function editCVSAddress(params, cvsBrand) {
  const { apiName, userAddressId } = getCvsAPIConfigInfo(cvsBrand);
  const { address: { prefectureList: prefectures }, delivery } = getTranslation();
  let defaultCVSValue = cvsBrand === 'sevenEleven' ? delivery.sevenElevenText : delivery[cvsBrand];

  if (params.name1 && params.name5 === delivery.ministop) {
    defaultCVSValue = delivery.ministop;
  }

  const addressData = formatAddressFromQuery(params, prefectures, defaultCVSValue, userAddressId);

  return dispatch => dispatch({
    types: [SET_CVS_ADDRESS, SET_CVS_ADDRESS_SUCCESS, SET_CVS_ADDRESS_FAIL],
    promise: (client, brand) => {
      const patch = client.PATCH;

      return patch(userInfoApi[apiName], {
        ...userInfoPromiseConfig,
        host: replaceUrlParams(userInfoPromiseConfig.host, { brand }),
        data: addressData,
      });
    },
    errorHandler: { enableReaction: true },
  });
}

// @private
// Add CVS Address - PUT
function addCVSAddress(query, cvsBrand) {
  const { apiName, userAddressId } = getCvsAPIConfigInfo(cvsBrand);
  const { address: { prefectureList: prefectures }, delivery } = getTranslation();
  let defaultCVSValue = cvsBrand === 'sevenEleven' ? delivery.sevenElevenText : delivery[cvsBrand];

  if (query.name1 && query.name5 === delivery.ministop) {
    defaultCVSValue = delivery.ministop;
  }

  const addressData = formatAddressFromQuery(query, prefectures, defaultCVSValue, userAddressId);

  return dispatch => dispatch({
    types: [SET_CVS_ADDRESS, SET_CVS_ADDRESS_SUCCESS, SET_CVS_ADDRESS_FAIL],
    promise: (client, brand) => client.put(userInfoApi[apiName], {
      ...userInfoPromiseConfig,
      host: replaceUrlParams(userInfoPromiseConfig.host, { brand }),
      data: addressData,
    }),
    errorHandler: { enableReaction: true },
  });
}

/**
 * Saves the CVS address on account platform, first checks if there's
 * an existing address already, then edit or add the new address.
 * @param {Object} params The query parameters from CVS redirect containing the data to be saved
 *
*/

export function setCVSAddress(query, cvsBrand) {
  return dispatch => dispatch(getCVSAddress(cvsBrand))
    .then(() => dispatch(editCVSAddress(query, cvsBrand)), () => dispatch(addCVSAddress(query, cvsBrand)))
    .then(() => dispatch(getCVSAddress(cvsBrand)));
}

export function getAccountLinkageStatus() {
  return {
    types: [GET_LINKAGE_STATUS, GET_LINKAGE_STATUS_SUCCESS, GET_LINKAGE_STATUS_FAIL],
    promise: (client, brand) =>
      client.get(accountApi.linkage, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.host, { brand }),
        tokenType: 'accesstoken',
      }),
    errorHandler: { apiType: apiTypes.ACPF, enableReaction: true },
  };
}

export function releaseAppConnection() {
  return (dispatch, getState) => {
    const { address } = getState();

    function removeLinkageForMemberId(value) {
      return dispatch({
        types: [RELEASE_APP, RELEASE_APP_SUCCESS, RELEASE_APP_FAIL],
        promise: (client, brand) => client.delete(accountApi.linkage, {
          ...promiseConfig,
          host: replaceUrlParams(promiseConfig.host, { brand }),
          tokenType: 'accesstoken',
          params: {
            memberid: value.memberid,
          },
        }),
        errorHandler: { apiType: apiTypes.ACPF, enableReaction: true },
      });
    }

    return serializePromises(address.memberIds, removeLinkageForMemberId)
     .then(() => dispatch(getAccountLinkageStatus()));
  };
}

export function updateDefaultAddress(address) {
  return (dispatch) => {
    const data = mapAddressToUserInfo(address);

    return dispatch({
      types: [UPDATE_DEFAULT_ADDRESS, UPDATE_DEFAULT_ADDRESS_S, UPDATE_DEFAULT_ADDRESS_F],
      promise: (client) => {
        const patch = client.PATCH;

        return patch(userInfoApi.userInfo, {
          ...userInfoPromiseConfig,
          data,
        });
      },
      errorHandler: { enableReaction: true },
    });
  };
}

/**
 * Redux method to PATCH the address ID 980/970 to UserInfo Addresses API for the delivery method Uniqlo store.
 * Public function - Since it is using in /redux/modules/checkout/delivery.js
 * @param  {Object} address - To save the address
 * @return {Promise}        Return a promise
 **/
export function editOtherAddress(address) {
  return (dispatch, getState) => {
    const data = mapAddressToUserInfo(address);
    const brand = getCurrentBrand(getState());

    return dispatch({
      types: [ADDRESS_EDIT, ADDRESS_EDIT_SUCCESS, ADDRESS_EDIT_FAIL],
      promise: (client) => {
        const patch = client.PATCH;

        return patch(`${userInfoApi.updateAddress}${address.id}.json`, {
          ...userInfoPromiseConfig,
          data,
        });
      },
      brand,
      errorHandler: { enableReaction: true },
    });
  };
}

/**
 * Loads the current 980/970 store address, which corresponds to Uniqlo/GU store based on current brand,
 * once request is completed it adds the `currentPickupStore` to the state.
 */
export function loadCurrentPickupStoreAddress() {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    return dispatch({
      types: [LOAD_PICKUP_STORE, LOAD_PICKUP_STORE_SUCCESS, LOAD_PICKUP_STORE_FAIL],
      promise: client => client.get(userInfoApi.storeAddress[brand], userInfoPromiseConfig),
      brand,
      errorHandler: { enableReaction: true },
    });
  };
}

/**
 * Adds / Edits the pickup store address in 980/970
  * @private
 * @name addOrEditPickupStoreAddress
 *
 * @param {String} action - should be one of 'add', 'edit'
 * @return {Promise} - Promise object returned by load cart Action
 */
function addOrEditPickupStoreAddress(action) {
  return (dispatch, getState) => {
    const globalState = getState();
    const {
      deliveryStore: { pickupStoreData },
      userInfo: { userDefaultDetails },
    } = globalState;
    const brand = getCurrentBrand(globalState);
    const data = mapPickupStoreAddressToUserInfo(pickupStoreData, userDefaultDetails, brand);

    return dispatch({
      types: [ADDRESS_EDIT, ADDRESS_EDIT_SUCCESS, ADDRESS_EDIT_FAIL],
      promise: (client) => {
        const method = action === 'edit' ? client.PATCH : client.put;

        return method(userInfoApi.storeAddress[brand], {
          ...userInfoPromiseConfig,
          data,
        });
      },
      brand,
      errorHandler: { enableReaction: true, showMessage: true, customErrorKey: 'uqAccPfError' },
    });
  };
}

/**
 * Sends the Uniqlo/GU address on state (user selected store) to save it as 980/970 store address,
 * this action should be executed when there's already an existing address on 980/970.
 * @see addOrEditPickupStoreAddress
 */
export function editPickupStoreAddress() {
  return addOrEditPickupStoreAddress('edit');
}

/**
 * Adds a new address to 980/970 (Uniqlo/GU Store), this action it's called when there's not
 * an existing address on 980/970 based on the current brand.
 * @see addOrEditPickupStoreAddress
 */
export function addPickupStoreAddress() {
  return addOrEditPickupStoreAddress('add');
}

/**
 * Removes an existing 980/970 (Uniqlo/GU Store) address.
 */
export function removePickupStoreAddress() {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    return dispatch({
      types: [REMOVE_STORE_ADDRESS, REMOVE_STORE_ADDRESS_SUCCESS, REMOVE_STORE_ADDRESS_FAIL],
      promise: client => client.delete(userInfoApi.storeAddress[brand], {
        ...userInfoPromiseConfig,
      }),
      brand,
      errorHandler: { enableReaction: true },
    });
  };
}

export function addNewAddress(address) {
  return dispatch => dispatch({
    types: [ADDRESS_SAVE, ADDRESS_SAVE_SUCCESS, ADDRESS_SAVE_FAIL],
    promise: client => client.post(userInfoApi.userInfoAddresses, {
      ...userInfoPromiseConfig,
      data: mapAddressToUserInfo(address),
    }),
    errorHandler: { enableReaction: true, showMessage: true, customErrorKey: 'addUserAddress' },
  });
}

export function resetAddress() {
  return {
    type: RESET_ADDRESS,
  };
}
