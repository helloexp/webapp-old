import { getAllWishlistSkus } from 'utils/wishlistUtils';
import * as mappings from './mappings';
import {
  LOAD_P_SUCCESS,
  LOAD_S_SUCCESS,
  UPDATE_P_SUCCESS,
  UPDATE_S_SUCCESS,
  LOAD_P_LOCAL,
  LOAD_S_LOCAL,
  UPDATE_S_LOCAL,
  UPDATE_P_LOCAL,
} from './actions';

const brandedState = {
  uq: { products: [], styles: [] },
  gu: { products: [], styles: [] },
};

const initialState = {
  local: brandedState,
  synced: brandedState,
  all: brandedState,
};

export default function wishlist(state = initialState, action = {}) {
  const { local, synced, all } = state;
  const { category, brand } = action;
  let localData = {};
  let syncedData = {};
  let allData = {};

  switch (action.type) {
    case LOAD_P_LOCAL:
    case LOAD_S_LOCAL:
      const { items = [] } = action;
      const localWishlist = mappings.mapLocalToState(items, category);

      localData = {
        [brand]: {
          ...local[brand],
          [category]: localWishlist,
        },
      };

      allData = {
        [brand]: {
          ...all[brand],
          [category]: getAllWishlistSkus(localWishlist, synced[category]),
        },
      };

      return {
        ...state,
        local: { ...local, ...localData },
        all: { ...all, ...allData },
      };
    case UPDATE_S_LOCAL:
    case UPDATE_P_LOCAL:
      const { item, operation } = action;
      let newLocalWishlist = [];

      if (operation === 'add' && !local[brand][category].find(elem => elem.id === item.id)) {
        newLocalWishlist = [...local[brand][category], { ...item }];
      } else if (operation === 'remove') {
        newLocalWishlist = local[brand][category].filter(elem => elem.id !== item.id);
      } else {
        newLocalWishlist = synced[brand][category];
      }

      localData = {
        [brand]: {
          ...local[brand],
          [category]: newLocalWishlist,
        },
      };

      allData = {
        [brand]: {
          ...all[brand],
          [category]: getAllWishlistSkus(newLocalWishlist, synced[category]),
        },
      };

      return {
        ...state,
        local: { ...local, ...localData },
        all: { ...all, ...allData },
      };

    case LOAD_P_SUCCESS:
    case LOAD_S_SUCCESS:
      const { result = {} } = action;
      const syncedWishlist = mappings.mapApiToState(result);

      syncedData = {
        [brand]: {
          ...synced[brand],
          [category]: syncedWishlist,
        },
      };

      allData = {
        [brand]: {
          ...all[brand],
          [category]: getAllWishlistSkus(local[brand][category], syncedWishlist),
        },
      };

      return {
        ...state,
        synced: { ...synced, ...syncedData },
        all: { ...all, ...allData },
      };

    case UPDATE_P_SUCCESS:
    case UPDATE_S_SUCCESS:
      syncedData = {
        [brand]: {
          ...synced[brand],
          [category]: local[brand][category],
        },
      };

      allData = {
        [brand]: {
          ...all[brand],
          [category]: getAllWishlistSkus(local[brand][category]),
        },
      };

      return {
        ...state,
        synced: { ...synced, ...syncedData },
        all: { ...all, ...allData },
      };

    default:
      return state;
  }
}
