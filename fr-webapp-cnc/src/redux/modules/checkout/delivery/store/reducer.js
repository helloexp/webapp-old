import States from 'config/states/states-jp';
import { getStores, getStoreDetail } from './storeMappings';
import {
  ALLOW_LOCATION_ACCESS,
  RESET_STATE_CODE,
  SELECT_STORE,
  SET_CURRENT_LOCATION,
  STORES_DETAIL_LOAD_FAIL,
  STORES_DETAIL_LOAD_SUCCESS,
  STORES_LOAD_MORE_SUCCESS,
  STORES_LOAD_SUCCESS,
  STORES_LOAD,
  STORES_SEARCH_SUCCESS,
  STORES_STATUS_SUCCESS,
  SWITCH_LOCATION_VIEW,
  CLEAR_STORE_LIST,
  RESET_STORE_FILTER,
} from './actions';

const initialState = {
  location: null,
  showConfirm: false,
  showStates: false,
  storeTotal: 0,
  states: States,
  stores: [],
  selected: null,
  storeStatus: [],
  autocomplete: [],
  searchQuery: '',
  storeDetail: {},
  stateCode: '0',
  showUniqloConfirmMsg: false,
  offset: 0,
  allowGps: true,
  resetFilter: false,
  filters: {},
};

export default function reducer(state = initialState, action = {}) {
  let response;
  let code = '0';

  switch (action.type) {
    case SET_CURRENT_LOCATION:
      return {
        ...state,
        location: {
          lat: action.lat,
          long: action.long,
        },
        gpsAvailable: action.gpsAvailable,
      };
    case SELECT_STORE:
      return {
        ...state,
        selected: action.store,
      };
    case STORES_LOAD:
      code = action.code || state.stateCode;

      return {
        ...state,
        stateCode: code,
      };
    case STORES_SEARCH_SUCCESS:
      response = action.result.result;
      const searchedStoreData = response.stores;
      const searchedStores = getStores(searchedStoreData);

      return {
        ...state,
        offset: response.stores.length,
        stores: searchedStores,
        stateCode: action.code || state.stateCode,
        searchQuery: action.searchQuery || '',
        storeTotal: response.total_count,
        filters: action.filters,
        resetFilter: action.resetFilter,
      };
    case STORES_LOAD_SUCCESS:
    case STORES_LOAD_MORE_SUCCESS:
      response = action.result.result;
      const storeData = response.stores;
      const offset = state.offset + storeData.length;
      const stores = getStores(storeData);

      return {
        ...state,
        stores: [...state.stores, ...stores],
        stateCode: action.code || state.stateCode,
        offset,
        storeTotal: response.total_count,
      };
    case STORES_DETAIL_LOAD_SUCCESS:
      response = action.result.result[0];

      return {
        ...state,
        storeDetail: getStoreDetail(response),
        pickupStoreData: action.result.result[0],
      };
    case STORES_DETAIL_LOAD_FAIL:
      return {
        ...state,
      };
    case ALLOW_LOCATION_ACCESS:
      return {
        ...state,
        showConfirm: false,
        allowGps: action.allowGps,
      };
    case SWITCH_LOCATION_VIEW:
      return {
        ...state,
        showStates: action.showStates,
      };
    case STORES_STATUS_SUCCESS:
      response = action.result.statuses;

      return {
        ...state,
        storeStatus: response,
      };
    case RESET_STATE_CODE:
      return {
        ...state,
        showStates: false,
        stateCode: '0',
        searchQuery: '',
      };
    case CLEAR_STORE_LIST:
      return {
        ...state,
        stores: [],
        showStates: false,
        stateCode: '0',
        searchQuery: '',
        offset: 0,
        filters: {},
      };
    case RESET_STORE_FILTER:
      return {
        ...state,
        resetFilter: true,
        filters: {},
      };
    default:
      return state;
  }
}
