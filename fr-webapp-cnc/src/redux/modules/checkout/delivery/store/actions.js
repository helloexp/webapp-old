import * as Location from 'helpers/Location';
import { storesApi, storeDetailApi } from 'config/api';
import { routePatterns } from 'utils/urlPatterns';
import { isStoreStaffEmail } from 'utils/validation';
import { isUserDefaultDetailsLoaded, loadDefaultDetails } from 'redux/modules/account/userInfo';
import { payment } from 'config/site/default';

export const ALLOW_LOCATION_ACCESS = 'DELIVERY/STORE/ALLOW_LOCATION_ACCESS';
export const RESET_STATE_CODE = 'DELIVERY/STORE/RESET_STATE_CODE';
export const SELECT_STORE = 'DELIVERY/STORE/SELECT_STORE';
export const SWITCH_LOCATION_VIEW = 'DELIVERY/STORE/SWITCH_LOCATION_VIEW';
export const SET_CURRENT_LOCATION = 'DELIVERY/STORE/SET_CURRENT_LOCATION';

export const STORES_LOAD = 'DELIVERY/STORE/STORES_LOAD';
export const STORES_LOAD_SUCCESS = 'DELIVERY/STORE/STORES_LOAD_S';
export const STORES_LOAD_FAILURE = 'DELIVERY/STORE/STORES_LOAD_F';

export const STORES_STATUS = 'DELIVERY/STORE/STORE_STATUS';
export const STORES_STATUS_SUCCESS = 'DELIVERY/STORE/STORES_STATUS_S';
export const STORES_STATUS_FAILURE = 'DELIVERY/STORE/STORES_STATUS_F';

export const STORES_SEARCH = 'DELIVERY/STORE/STORES_SEARCH';
export const STORES_SEARCH_SUCCESS = 'DELIVERY/STORE/STORES_SEARCH_S';
export const STORES_SEARCH_FAILURE = 'DELIVERY/STORE/STORES_SEARCH_F';

export const STORES_LOAD_MORE = 'DELIVERY/STORE/STORES_LOAD_MORE';
export const STORES_LOAD_MORE_SUCCESS = 'DELIVERY/STORE/STORES_LOAD_MORE_S';
export const STORES_LOAD_MORE_FAILURE = 'DELIVERY/STORE/STORES_LOAD_MORE_F';
export const STORES_DETAIL_LOAD = 'DELIVERY/STORE/STORES_DETAIL_LOAD';
export const STORES_DETAIL_LOAD_SUCCESS = 'DELIVERY/STORE/STORES_DETAIL_LOAD_S';
export const STORES_DETAIL_LOAD_FAIL = 'DELIVERY/STORE/STORES_DETAIL_LOAD_F';
export const CLEAR_STORE_LIST = 'DELIVERY/STORE/CLEAR_STORE_LIST';
export const RESET_STORE_FILTER = 'DELIVERY/STORE/RESET_STORE_FILTER';

// TODO Queue requests
const promiseConfig = {
  host: `${storesApi.base}/${storesApi.region}/{%brand%}/${storesApi.version}`,
  headers: {
    'Content-Type': 'text/plain',
  },
  params: {
    r: storesApi.referrer,
    max_distance: 100,
  },
};

const detailConfig = {
  host: `${storeDetailApi.base}/${storeDetailApi.version}/{%brand%}/${storeDetailApi.region}`,
  headers: {
    'Content-Type': 'text/plain',
  },
  params: {
    client_id: storesApi.referrer,
  },
};

const storeConfig = {
  host: `${storesApi.base}/${storesApi.region}/{%brand%}/${storesApi.version}`,
  headers: {
    'Content-Type': 'text/plain',
  },
};

const errorHandler = { enableReaction: true, customErrorKey: 'storeListLoad', showMessage: true };

function isDeliveryPage(state) {
  return routePatterns.deliveryStore.test(state.routing.locationBeforeTransitions.pathname);
}

export function isPaymentPage(state) {
  return routePatterns.paymentStore.test(state.routing.locationBeforeTransitions.pathname);
}

function getClickCollectConfig(state, initialLoad = true) {
  const { userInfo: { userDefaultDetails } } = state;
  let paymentStoreParams = { store_delivery_flg: '1' };
  let deliveryStoreParams = { click_and_collect_flg: '1' };

  // if user email contains '@uniqlo.store', avoid 'store_delivery_flg' and 'click_and_collect_flg' filtering,
  // ie. load both store_delivery_flg=1 and =0 and click_and_collect_flg=1 and =0
  if (userDefaultDetails && isStoreStaffEmail(userDefaultDetails.email)) {
    paymentStoreParams = {};
    deliveryStoreParams = {};
  }

  if (isDeliveryPage(state)) {
    return {
      include_closed: 0,
      limit: 10,
      ...deliveryStoreParams,
    };
  }

  return {
    limit: initialLoad ? payment.initialLimit : payment.normalLimit,
    ...paymentStoreParams,
  };
}

export function loadStoresByQuery(query) {
  const searchQuery = query.trim();
  const queryObject = {};

  if (searchQuery) {
    queryObject.keyword = encodeURI(searchQuery);
  }

  return (dispatch, getState) => {
    const state = getState();
    const { deliveryStore } = state;
    const filters = deliveryStore.filters || {};
    const location = deliveryStore.location && {
      lat: deliveryStore.location.lat,
      lon: deliveryStore.location.long,
    } || {};

    return dispatch({
      types: [STORES_SEARCH, STORES_SEARCH_SUCCESS, STORES_SEARCH_FAILURE],
      promise: (client, brand) => client.get(storesApi.storeList, {
        ...promiseConfig,
        host: promiseConfig.host.replace('{%brand%}', storesApi.brand[brand]),
        params: {
          ...promiseConfig.params,
          ...queryObject,
          ...getClickCollectConfig(state),
          ...filters,
          ...location,
        },
      }),
      errorHandler,
      searchQuery,
    });
  };
}

export function selectStore(store) {
  return {
    type: SELECT_STORE,
    store,
  };
}

export function resetStoreFilter() {
  return {
    type: RESET_STORE_FILTER,
  };
}

export function filterStoresByState(code) {
  const queryObject = {};

  if (parseInt(code, 10)) {
    queryObject.area1_code = code;
  }

  return (dispatch, getState) => {
    const state = getState();
    const { deliveryStore } = state;
    const location = deliveryStore.location && {
      lat: deliveryStore.location.lat,
      lon: deliveryStore.location.long,
    } || {};

    return dispatch({
      types: [STORES_SEARCH, STORES_SEARCH_SUCCESS, STORES_SEARCH_FAILURE],
      promise: (client, brand) => client.get(storesApi.storeList, {
        ...promiseConfig,
        host: promiseConfig.host.replace('{%brand%}', storesApi.brand[brand]),
        params: {
          r: storesApi.referrer,
          ...queryObject,
          ...location,
          ...getClickCollectConfig(state),
        },
      }),
      code,
      errorHandler,
    });
  };
}

export function loadStores(coords) {
  const cordinates = {
    lat: coords.lat,
    lon: coords.long,
  };

  return (dispatch, getState) => dispatch({
    types: [STORES_LOAD, STORES_LOAD_SUCCESS, STORES_LOAD_FAILURE],
    promise: (client, brand) => client.get(storesApi.storeList, {
      ...promiseConfig,
      host: promiseConfig.host.replace('{%brand%}', storesApi.brand[brand]),
      params: {
        ...promiseConfig.params,
        ...cordinates,
        ...getClickCollectConfig(getState()),
      },
    }),
    errorHandler,
  });
}

export function loadMoreStores({ code, filters }) {
  const queryObject = {};

  if (parseInt(code, 10)) {
    queryObject.area1_code = code;
  }

  return (dispatch, getState) => {
    const { deliveryStore } = getState();
    const storeFilters = deliveryStore.filters || filters;
    const searchQuery = deliveryStore.searchQuery;
    const latLong = {
      lat: deliveryStore.location.lat,
      lon: deliveryStore.location.long,
    };
    let reqParams = {};
    const globalState = getState();

    if (searchQuery) {
      queryObject.keyword = encodeURI(searchQuery);
    }

    if (code !== '0') {
      reqParams = {
        r: promiseConfig.params.r,
      };
    } else {
      reqParams = promiseConfig.params;
    }

    return dispatch({
      types: [STORES_LOAD_MORE, STORES_LOAD_MORE_SUCCESS, STORES_LOAD_MORE_FAILURE],
      promise: (client, brand) => client.get(storesApi.storeList, {
        ...promiseConfig,
        host: promiseConfig.host.replace('{%brand%}', storesApi.brand[brand]),
        params: {
          ...reqParams,
          ...storeFilters,
          ...queryObject,
          ...latLong,
          offset: deliveryStore.offset,
          ...getClickCollectConfig(globalState, false),
        },
      }),
      errorHandler,
    });
  };
}

export function getStoreStatus(storeId, skuCode) {
  return {
    types: [STORES_LOAD, STORES_STATUS_SUCCESS, STORES_STATUS_FAILURE],
    promise: (client, brand) => client.get(storeDetailApi.storeList, {
      ...detailConfig,
      host: detailConfig.host.replace('{%brand%}', storesApi.brand[brand]),
      params: {
        ...detailConfig.params,
        store_id: storeId,
        sku_code: skuCode,
      },
    }),
    errorHandler,
  };
}

export function setCurrentLocation(coords, error, gpsAvailable = true) {
  return {
    type: SET_CURRENT_LOCATION,
    ...coords,
    error,
    gpsAvailable,
  };
}

/**
 * Get's the current location of the user
 * Retrieves the stores using user's lat and long
 * If user doesn't approve location access, loads the stores using default lat, long (Ginza Location for now)
 *
 * @param {String} defaultLocation default location from config
 * @param {String} productId Product Id to find in specific store
 * @param {String} storeLoadNumber
 */
export function getCurrentPosition(defaultLocation) {
  return (dispatch, getState) => {
    const state = getState();
    const allowGps = state.deliveryStore.allowGps;
    let coords = defaultLocation;
    const promise = [];

    if (allowGps === undefined || allowGps) {
      // let raceTimeout = Promise.resolve();
      let isLocationLoaded = false;

      // Ask GPS for location
      const raceGPS = Location.getCurrentLocation()
        .then((currentCoords) => {
          coords = currentCoords;
          isLocationLoaded = !!(currentCoords.lat && currentCoords.long);

          return dispatch(setCurrentLocation(coords, false));
        }).catch(() => dispatch(setCurrentLocation(coords, true, false)));

      // race timeout. if GPS doesn't return anything, we'll resume.
      // this helps with Uniqlo APP that doesn't show confirmation for GPS
      // on some Androids
      const raceTimeout = new Promise(resolve => setTimeout(resolve, 5000))
        .then(() => !isLocationLoaded && dispatch(setCurrentLocation(coords, true, false)));

      promise.push(Promise.race([raceGPS, raceTimeout]));
    }

    return Promise.all(promise)
      .then(() => {
        if (!isUserDefaultDetailsLoaded(getState())) {
          return dispatch(loadDefaultDetails());
        }

        return Promise.resolve();
      })
      .then(() => dispatch(loadStores(coords)));
  };
}

/**
 * Applies selected filter on the Stores
 * if user has selected any state, it retrieve all the stores from that state
 * Otherwise it returns stores that are in 100 KM (max_distance) radius from passed lat long
 *
 * @param {filters} an object contains multiple query params for api (store_item_code, store_type_code, parking_flg, my_store_flag)
 */
export function loadStoresByFilter(filters) {
  return (dispatch, getState) => {
    const globalState = getState();
    const { searchQuery, stateCode, location } = globalState.deliveryStore;
    const queryObject = { ...promiseConfig.params };

    if (stateCode !== '0') {
      queryObject.area1_code = stateCode;
      delete queryObject.max_distance;
    }

    if (searchQuery) {
      queryObject.keyword = encodeURI(searchQuery);
    }

    return dispatch({
      types: [STORES_SEARCH, STORES_SEARCH_SUCCESS, STORES_SEARCH_FAILURE],
      promise: (client, brand) => client.get(storesApi.storeList, {
        ...promiseConfig,
        host: promiseConfig.host.replace('{%brand%}', storesApi.brand[brand]),
        params: {
          ...queryObject,
          lat: location.lat,
          lon: location.long,
          ...filters,
          ...getClickCollectConfig(globalState),
        },
      }),
      filters,
      errorHandler,
      searchQuery,
    });
  };
}

export function setLocationAccess(btn) {
  return {
    type: ALLOW_LOCATION_ACCESS,
    allowGps: btn === 'yes',
  };
}

export function setLocationView(view) {
  return {
    type: SWITCH_LOCATION_VIEW,
    showStates: view === 'states',
  };
}

export function getStoreDetails(storeId) {
  return {
    types: [STORES_DETAIL_LOAD, STORES_DETAIL_LOAD_SUCCESS, STORES_DETAIL_LOAD_FAIL],
    promise: (client, brand) => client.get(storesApi.storeDetail, {
      ...storeConfig,
      host: storeConfig.host.replace('{%brand%}', storesApi.brand[brand]),
      params: {
        store_id: storeId,
        r: storesApi.referrer,
      },
    }),
    errorHandler: { enableReaction: true },
  };
}

export function resetStateCode() {
  return {
    type: RESET_STATE_CODE,
  };
}

export function resetStoresList() {
  return {
    type: CLEAR_STORE_LIST,
  };
}
