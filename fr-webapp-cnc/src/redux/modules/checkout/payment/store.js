import { constantsGenerator } from 'utils';
import { payByCODOrStore } from 'redux/modules/checkout/payment/actions';
import { updateDefaultAddress } from 'redux/modules/account/address';
import { getCurrentBrand } from 'utils/routing';
import {
  loadDefaultDetails,
  resetLoadAddressCheck,
  loadAllAddressesIfNeeded,
} from 'redux/modules/account/userInfo';
import { payment } from 'config/site/default';
import { storesApi } from 'config/api';
import { getStoreDetail } from 'redux/modules/checkout/delivery/store/storeMappings';
import ClientStore from 'utils/clientStorage';

export const SELECT_PAYMENT_STORE = 'PAYMENT/STORE/SELECT_STORE';
export const REMOVE_PAYMENT_STORE = 'PAYMENT/STORE/REMOVE_PAYMENT_STORE';
export const APPLY_PAYMENT_STORE = 'PAYMENT/STORE/APPLY_PAYMENT_STORE';
export const SAVE_CHECK_IN_STORE = 'PAYMENT/STORE/SAVE_CHECK_IN_STORE';

const generateConstants = constantsGenerator('PAYMENT/STORE');
const { STORE_DETAIL_LOAD, STORE_DETAIL_LOAD_SUCCESS, STORE_DETAIL_LOAD_FAIL } = generateConstants('STORE_DETAIL_LOAD');

const initialState = {
  selectedStore: {
    uq: null,
    gu: null,
  },
  paymentStoreDetail: {},
  appliedStore: null,
};

const storeConfig = {
  host: `${storesApi.base}/${storesApi.region}/{%brand%}/${storesApi.version}`,
  headers: {
    'Content-Type': 'text/plain',
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_PAYMENT_STORE:
      const { brand, store } = action;

      return {
        ...state,
        selectedStore: { ...state.selectedStore, [brand]: store },
      };
    case REMOVE_PAYMENT_STORE:
      return {
        ...state,
        appliedStore: null,
      };
    case STORE_DETAIL_LOAD_SUCCESS:
      return {
        ...state,
        paymentStoreDetail: getStoreDetail(action.result.result[0]),
      };
    case APPLY_PAYMENT_STORE:
      return {
        ...state,
        appliedStore: action.store,
      };
    case SAVE_CHECK_IN_STORE:
      return {
        ...state,
        lastCheckInStore: action.storeId,
      };
    case STORE_DETAIL_LOAD_FAIL:
    default:
      return state;
  }
}

export function selectPaymentStore(store) {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    return dispatch({
      type: SELECT_PAYMENT_STORE,
      store,
      brand,
    });
  };
}

/**
*Method to set the applied payment store of current brand to both local storage and global state
* @param {object} store to be applied
**/
function applyPaymentStore(store) {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());
    const currentStore = store && store[brand];

    if (currentStore && currentStore.id) {
      ClientStore.set('selectedStore', store);
    }

    return dispatch({
      type: APPLY_PAYMENT_STORE,
      store: currentStore,
      brand,
    });
  };
}

/**
*Method to load the applied payment store of current brand from local storage into global state
* @public function - Since it is used in payment and review_order
**/
export const restoreSelectedStore = (currentStore = {}) => dispatch =>
  ClientStore.get('selectedStore')
  .then(store => (dispatch(applyPaymentStore({ ...store, ...currentStore })))
);

/**
*Method to reset the applied payment store of current brand from both local storage and global state
* @public function - Since it is used in store_payment page
**/
export function resetPaymentStore() {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    ClientStore.get('selectedStore')
    .then((store) => {
      ClientStore.set('selectedStore', { ...store, [brand]: null });
    });

    return dispatch({
      type: REMOVE_PAYMENT_STORE,
      brand,
    });
  };
}

export function saveCheckInStoreCode(storeId) {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    ClientStore.get('lastCheckInStore')
    .then((store) => {
      let lastCheckInStore = {};

      if (store) {
        lastCheckInStore = { ...store, [brand]: storeId };
      }
      ClientStore.set('lastCheckInStore', lastCheckInStore);
    });

    return dispatch({
      type: SAVE_CHECK_IN_STORE,
      storeId,
      brand,
    });
  };
}

export function restoreCheckInStoreCode() {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    return ClientStore.get('lastCheckInStore')
      .then(store => dispatch({
        type: SAVE_CHECK_IN_STORE,
        storeId: store,
        brand,
      })
    );
  };
}

/**
 * Method to fetch the details of a particular Uniqlo store.
 * @public function - Since it is used in confirm_order and review_order
 * @param {string} storeId of the store to fetch
 * @return {Promise}        Return a promise
 **/
export function getPaymentStoreDetails(storeId, orderBrand) {
  return {
    types: [STORE_DETAIL_LOAD, STORE_DETAIL_LOAD_SUCCESS, STORE_DETAIL_LOAD_FAIL],
    promise: (client, brand) => client.get(storesApi.storeDetail, {
      ...storeConfig,
      host: storeConfig.host.replace('{%brand%}', storesApi.brand[orderBrand || brand]),
      params: {
        store_id: storeId,
        r: storesApi.referrer,
      },
    }),
    errorHandler: { enableReaction: true },
  };
}

/**
 * Method to Set the payment type as pay at UQ-store and set billing address on GDS.
 * > loadAllAddressesIfNeeded - This method calls the addresses saved by user if it's not already loaded.
 * > saveDefaultAddress - This method updates 001
 * The address saved to `billing` is choose as such:
 * If user has valid default address, then choose that.
 * Else if user has a saved billing address in local state, choose that.
 * Else choose the first address in address book.
 * @public function - Since it is used in pay at store.
 * @param {boolean} isGiftCardAvailable Check if gift cards are present for user.
 * @param {object} billingAddressForNewUser Address in form.
 * @param {boolean} isNewUserStoresSelection Check if billing address need to be updated with dummy values.
 * @return {Promise}        Return a promise
 **/
export function setUQPaymentAndRedirect(isGiftCardAvailable, billingAddressForNewUser, isNewUserStoresSelection) {
  return (dispatch, getState) => {
    const saveDefaultAddress = () => (billingAddressForNewUser
      ? dispatch(updateDefaultAddress(billingAddressForNewUser))
        .then(() => dispatch(loadDefaultDetails()))
      : Promise.resolve());

    return saveDefaultAddress()
      .then(() => dispatch(loadAllAddressesIfNeeded()))
      .then(() => {
        const { payment: { billingAddress }, userInfo: { userInfoAddressList, userDefaultDetails } } = getState();
        const isDefaultAddressValid = !!(userDefaultDetails
          && userDefaultDetails.prefecture
          && userDefaultDetails.street
          && userDefaultDetails.city
          && userDefaultDetails.phoneNumber
        );

        const billing = ((isDefaultAddressValid || billingAddressForNewUser) && userDefaultDetails)
          || (Object.keys(billingAddress).length && billingAddress)
          || (userInfoAddressList && userInfoAddressList[0]);

        return dispatch(payByCODOrStore(billing, payment.uniqloStore, isGiftCardAvailable, billingAddressForNewUser, isNewUserStoresSelection))
          .then(() => dispatch(resetLoadAddressCheck()));
      });
  };
}
