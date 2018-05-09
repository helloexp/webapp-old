import { createSelector } from 'reselect';
import { getTranslation } from 'i18n';
import { routePatterns } from 'utils/urlPatterns';
import { isStoreStaffEmail } from 'utils/validation';
import { getDefaultAddress } from 'redux/modules/checkout/delivery/selectors.js';

/**
 * Get the states lists
 **/
export const getStoreStatesList = state => state.deliveryStore.states;

/**
 * Get the uniqlo stores
 **/
export const getUniqloStores = state => state.deliveryStore.stores;

/**
 * Get the selected store
 **/
const getSelectedUQStore = (state, props) => props.selectedStore;

/**
 * Get the selected state code
 **/
export const getStateCode = state => state.deliveryStore.stateCode;

/**
 * Get location
 **/
export const getLocation = state => state.deliveryStore.location;

/**
 * Get if state list displayed
 **/
export const getIsShowStates = state => state.deliveryStore.showStates;

/**
 * Get selected delivery store
 **/
export const getSelectedDeliveryStore = state => state.deliveryStore.selected;

/**
 * Get total store count
 **/
export const getStoreCount = state => state.deliveryStore.storeTotal;

/**
 * Get the reset filter status
 **/
export const getResetStatus = state => state.deliveryStore.resetFilter;

/**
 * Get the filter status
 **/
export const getFilter = state => state.deliveryStore.filters;
/**
 * Get the search query string
 **/
export const getSearchQuery = state => state.deliveryStore.searchQuery;

/**
 * Check if the current page is paymentStore
 **/
export const checkIfPaymentStore = state => routePatterns.paymentStore.test(state.routing.locationBeforeTransitions.pathname);

/**
 * Get autocomplete
 **/
export const getAutoComplete = state => state.deliveryStore.autocomplete;

/**
 * Get Store pickup error message
 **/
export const getStorePickupError = state => ({ saveShippingAddress: state.errorHandler.customErrors.saveShippingAddress });

/**
 * Get store details
 **/
export const getStoreDetails = state => state.deliveryStore.storeDetail;

/**
 * Check if load more button should be loaded
 **/
export const shouldViewLoadMore = (state, props) => props.items.length < props.total;

/**
 * Check gps allow status
 **/
export const isGpsAvailable = state => state.deliveryStore.gpsAvailable;

/**
 * Get store state code
 **/
export const getStateCodes = createSelector(
 [getStoreStatesList], states =>
   Object.keys(states)
);

/**
 * Get store markers
 **/
export const getStoreMarkers = createSelector(
  [getUniqloStores, getSelectedUQStore],
  (stores, selectedStore) => (
    selectedStore ? [selectedStore] : stores
  )
);

/**
 * Get available prefectures
 **/
export const getPrefectureAvaliable = createSelector(
 [getStateCode, getStoreStatesList], (stateCode, states) => stateCode !== '0' && states[stateCode]
);

/**
 * Get prefecture
 **/
export const getPrefecture = createSelector(
  [getPrefectureAvaliable], prefectureAvaliable => (
    prefectureAvaliable ? prefectureAvaliable.name : getTranslation().deliveryStore.searchByState
  )
);

export const isStoreStaff = createSelector(
  [getDefaultAddress], userDefaultDetails => isStoreStaffEmail(userDefaultDetails.email)
);

// Check if we have to show pickup store history
export const shouldShowPickupStore = createSelector(
  [getStoreDetails, isStoreStaff], (storeDetail, isStoreStaffEmailId) =>
    !!(isStoreStaffEmailId || (storeDetail && storeDetail.clickAndCollectFlag === 1))
);
