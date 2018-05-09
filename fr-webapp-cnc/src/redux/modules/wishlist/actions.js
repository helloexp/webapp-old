/**
 * User not logged in:
 * -------------------
 *  1. on page load
 *      - loadLocalWishlist()   => updates state.local
 *  2. on add/remove
 *      - updateLocalWishlist() => updates state.local
 *
 * Logged in user:
 * ---------------
 *  1. on page load
 *      - loadLocalWishlist()   => updates state.local
 *      - updateWishlist()      => sends state.local to server
 *      - loadWishlist()        => fetches server to state.synced
 *      - updateLocalWishlist() => updates state.local with state.synced
 *  2. on add/remove
 *      - updateLocalWishlist() => updates state.local
 *      - updateWishlist()      => sends state.local to server and updates state.synced
 */

import constantsGenerator from 'utils/constantsGenerator';
import ClientStorage from 'utils/clientStorage';
import { replaceUrlParams } from 'utils/routing';
import { getRegion } from 'i18n';
import { getSecondsSinceEpoch, getUnsyncedWishlistItems, isUserTokenValid } from 'utils/wishlistUtils';
import config from 'config';
import defaultConfig from 'config/site/default';
import { collectionsApi } from 'config/api';
import * as mappings from './mappings';

const { brandName } = defaultConfig;
const { wishlistKeys } = config.app;
const generateConstants = constantsGenerator('wishlist');

export const { LOAD_P, LOAD_P_SUCCESS, LOAD_P_FAIL } = generateConstants('LOAD_P');
export const { LOAD_S, LOAD_S_SUCCESS, LOAD_S_FAIL } = generateConstants('LOAD_S');
export const { UPDATE_P, UPDATE_P_SUCCESS, UPDATE_P_FAIL } = generateConstants('UPDATE_P');
export const { UPDATE_S, UPDATE_S_SUCCESS, UPDATE_S_FAIL } = generateConstants('UPDATE_S');
export const UPDATE_GU_WISHLIST = 'wishlist/UPDATE_GU_WISHLIST';
export const UPDATE_GU_WISHLIST_S = 'wishlist/UPDATE_GU_WISHLIST_S';
export const UPDATE_GU_WISHLIST_F = 'wishlist/UPDATE_GU_WISHLIST_F';
export const LOAD_P_LOCAL = 'wishlist/LOAD_P_LOCAL';
export const LOAD_S_LOCAL = 'wishlist/LOAD_S_LOCAL';
export const UPDATE_P_LOCAL = 'wishlist/UPDATE_P_LOCAL';
export const UPDATE_S_LOCAL = 'wishlist/UPDATE_S_LOCAL';

const apiConfig = {
  tokenType: 'accesstoken',
  params: {
    locale: collectionsApi.locale,
  },
};

const actionTypes = {
  localLoad: { products: LOAD_P_LOCAL, styles: LOAD_S_LOCAL },
  load: { products: [LOAD_P, LOAD_P_SUCCESS, LOAD_P_FAIL], styles: [LOAD_S, LOAD_S_SUCCESS, LOAD_S_FAIL] },
  localUpdate: { products: UPDATE_P_LOCAL, styles: UPDATE_S_LOCAL },
  update: { products: [UPDATE_P, UPDATE_P_SUCCESS, UPDATE_P_FAIL], styles: [UPDATE_S, UPDATE_S_SUCCESS, UPDATE_S_FAIL] },
};

const apiEndpoints = {
  get: { products: collectionsApi.item, styles: collectionsApi.style },
  others: { products: collectionsApi.item, styles: collectionsApi.style },
};

/**
 * Loads local product wishlist data to state (updates state.local)
 * @public
 * @returns
 */
export function loadLocalWishlist(category, brand) {
  return dispatch => ClientStorage.get(wishlistKeys[brand][category])
    .then(items => dispatch({ type: actionTypes.localLoad[category], items, category, brand }));
}

/**
 * @public
 */
export function loadAllLocalWishlist(brand) {
  return dispatch => Promise.all([
    dispatch(loadLocalWishlist('products', brand)),
    dispatch(loadLocalWishlist('styles', brand)),
  ]);
}

/**
 * Updates local wishlist with 'item' received as argument. If no operation specified,
 * then we will take state.synced to update local wishlist (updates state.local)
 * @private
 * @param {Object} item - new wishlist item to be updated
 * @param {String} operation - can be 'add' or 'remove'
 * @returns {Promise}
 */
function updateLocalWishlist(category, id, operation, brand) {
  return (dispatch, getState) => {
    const updateTime = getSecondsSinceEpoch();

    dispatch({
      type: actionTypes.localUpdate[category],
      item: { id, updateTime },
      operation,
      category,
      brand,
    });

    const newLocalItems = getState().wishlist.local[brand][category];

    return ClientStorage.set(wishlistKeys[brand][category], mappings.mapStateToLocal(newLocalItems, category));
  };
}

/**
 * Loads the GU wish list from API
 * @param {String} category (products or styles)
 * @private
 * @returns {Promise}
 */
function loadGUWishlist(category) {
  return (dispatch, getState) => {
    const { auth: { user } } = getState();

    if (isUserTokenValid(user)) {
      return dispatch({
        types: actionTypes.load[category],
        promise: client => client.get(collectionsApi.item, {
          host: `${replaceUrlParams(collectionsApi.wishlistBase, { brand: brandName.gu })}/${getRegion()}`,
          ...apiConfig,
        }),
        category,
        hideLoading: true,
        brand: brandName.gu,
      }).then(() => dispatch(updateLocalWishlist(category, '', '', brandName.gu)));
    }

    return Promise.resolve();
  };
}

/**
 * Load wishlist from Collection API (updates state.synced)
 * Also update local wishlist with new items (updates state.local)
 * @private
 * @returns {Promise}
 */
function loadWishlist(category) {
  return (dispatch, getState) => {
    const { auth: { user } } = getState();

    if (isUserTokenValid(user)) {
      return dispatch({
        types: actionTypes.load[category],
        promise: client => client.get(apiEndpoints.get[category], {
          host: `${replaceUrlParams(collectionsApi.wishlistBase, { brand: brandName.uq })}/${getRegion()}`,
          ...apiConfig,
        }),
        category,
        brand: brandName.uq,
        hideLoading: true,
      }).then(() => dispatch(updateLocalWishlist(category, '', '', brandName.uq)));
    }

    return Promise.resolve();
  };
}

/**
 * @public
 */
export function loadAllWishlist() {
  return dispatch => Promise.all([
    dispatch(loadWishlist('products')),
    dispatch(loadWishlist('styles')),
    dispatch(loadGUWishlist('products')),
  ]);
}

/**
 * Syncs addition or removal in local wishlist to server (updates state.synced)
 * @private
 * @param {String} id - product's onlineId-colorCode-sizeCode
 * @param {String} operation - can be 'add' or 'remove'
 * @returns {Promise}
 */
function updateGUWishList(id = '', operation, category) {
  return (dispatch, getState) => {
    const { wishlist: { local, synced }, auth: { user } } = getState();

    if (isUserTokenValid(user)) {
      const localList = local[brandName.gu][category];
      const syncedList = synced[brandName.gu][category];
      let unsynced = [];
      let method = '';

      if (operation === 'add') {
        method = 'post';
        unsynced = getUnsyncedWishlistItems(localList, syncedList);
      } else if (operation === 'remove') {
        method = 'delete';
        unsynced = getUnsyncedWishlistItems(syncedList, localList);
      }

      if (unsynced.length > 0 && id) {
        return dispatch({
          types: [UPDATE_GU_WISHLIST, UPDATE_GU_WISHLIST_S, UPDATE_GU_WISHLIST_F],
          promise: client => client[method](`${collectionsApi.item}/${id}`, {
            host: `${replaceUrlParams(collectionsApi.wishlistBase, { brand: brandName.gu })}/${getRegion()}`,
            ...apiConfig,
          }),
          hideLoading: true,
          brand: brandName.gu,
        });
      }
    }

    return Promise.resolve();
  };
}

/**
 * Syncs addition or removal in local wishlist to server (updates state.synced)
 * @param {String} itemId - product's onlineId-colorCode-sizeCode
 * @param {String} operation - can be 'add' or 'remove'
 * @returns {Promise}
 */
export function updateWishlist(category, operation) {
  return (dispatch, getState) => {
    const { wishlist: { local, synced }, auth: { user } } = getState();

    if (isUserTokenValid(user)) {
      const localList = local[brandName.uq][category];
      const syncedList = synced[brandName.uq][category];
      let unsynced = [];
      let method = '';

      if (operation === 'add') {
        method = 'post';
        unsynced = getUnsyncedWishlistItems(localList, syncedList);
      } else if (operation === 'remove') {
        method = 'delete';
        unsynced = getUnsyncedWishlistItems(syncedList, localList);
      }

      if (unsynced.length > 0) {
        return dispatch({
          types: actionTypes.update[category],
          promise: client => client[method](`${apiEndpoints.others[category]}/${mappings.mapStateToApi(unsynced)}`, {
            host: `${replaceUrlParams(collectionsApi.wishlistBase, { brand: brandName.uq })}/${getRegion()}`,
            ...apiConfig,
          }),
          hideLoading: true,
          operation,
          category,
          brand: brandName.uq,
        });
      }
    }

    return Promise.resolve();
  };
}

function updateBrandedWishList(category, operation, brand, id) {
  return (dispatch) => {
    if (brand === brandName.uq) {
      return dispatch(updateWishlist(category, operation));
    } else if (brand === brandName.gu) {
      return dispatch(updateGUWishList(id, operation, category));
    }

    return Promise.resolve();
  };
}

export function toggleWishlist(category, id, brand) {
  return (dispatch, getState) => {
    const { wishlist: { all: { [brand]: wishlist } } } = getState();
    const wishlistId = wishlist[category].find(item => item.includes(id));
    const operation = wishlistId ? 'remove' : 'add';

    return dispatch(updateLocalWishlist(category, wishlistId || id, operation, brand))
      .then(() => dispatch(updateBrandedWishList(category, operation, brand, id)));
  };
}

export function initializeWishlist(brand) {
  return dispatch => dispatch(loadAllLocalWishlist(brand))
  .then(() => dispatch(updateBrandedWishList('products', 'add', brand)))
  .then(() => dispatch(updateBrandedWishList('styles', 'add', brand)))
  .then(() => dispatch(loadAllWishlist(brand)));
}
