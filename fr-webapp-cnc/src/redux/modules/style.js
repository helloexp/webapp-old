import { styleAPI, catalogApi } from 'config/api';
import { constantsGenerator } from 'utils';
import getProperty from 'utils/getProperty';
import { splitWishlistSku } from 'utils/wishlistUtils';
import { loadLocalWishlist } from 'redux/modules/wishlist/actions';
import config from 'config';

const appConfig = config.app;

const generateConstants = constantsGenerator('style');
const LOAD_RECENTLY_VIEWED_PRODUCTS = 'READ_COOKIE/RECENTLY_VIEWED';
const { LOAD_STYLE_DATA, LOAD_STYLE_DATA_SUCCESS, LOAD_STYLE_DATA_FAIL } = generateConstants('LOAD_STYLE_DATA');
const {
  LOAD_RECENTLY_VIEWED_DATA,
  LOAD_RECENTLY_VIEWED_DATA_SUCCESS,
  LOAD_RECENTLY_VIEWED_DATA_FAIL,
} = generateConstants('LOAD_RECENTLY_VIEWED_DATA');

function mapStyles(itemIds, styleItems) {
  const styles = {};

  itemIds.forEach((itemId) => {
    if (!styles[itemId]) {
      const stylesForProduct = styleItems[itemId] || [];

      styles[itemId] = stylesForProduct.map(styleDetails => ({
        styleId: styleDetails.styleId,
        styleImgUrl: styleDetails.styleImgUrl,
      }));
    }
  });

  return styles;
}

const initialState = {
  styles: {},
  wishlist: {},
  recentlyViewed: [],
  recentlyViewedData: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_STYLE_DATA_SUCCESS: {
      const styles = mapStyles(action.itemIds, getProperty(action, 'result.result.styles'));

      return {
        ...state,
        styles: { ...state.styles, ...styles },
      };
    }

    case LOAD_RECENTLY_VIEWED_PRODUCTS:
      const recentlyViewed = action.cookie.value ? action.cookie.value.split('/').reverse() : [];

      return {
        ...state,
        recentlyViewed: [...new Set([...state.recentlyViewed, ...recentlyViewed])],
      };

    case LOAD_RECENTLY_VIEWED_DATA_SUCCESS:
      const { result: { items: products } } = action;

      return {
        ...state,
        recentlyViewedData: products,
      };

    case LOAD_RECENTLY_VIEWED_DATA_FAIL:

      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
}

export function loadRecentlyViewedProductIds() {
  return {
    type: LOAD_RECENTLY_VIEWED_PRODUCTS,
    cookie: {
      key: appConfig.cookies.recentlyViewed,
    },
  };
}

export function loadStyleData(itemIds, brand) {
  return (dispatch, getState) => {
    dispatch(loadRecentlyViewedProductIds());

    return dispatch(loadLocalWishlist('products', brand)).then(() => {
      const { wishlist: { all: { [brand]: { products: productsWishlist } } }, styleRecommendations: { recentlyViewed } } = getState();
      const wishlistedIds = productsWishlist.map(id => splitWishlistSku(id).onlineId);
      // limit to 20 product IDs when calling style API
      const products = [...new Set([...itemIds, ...recentlyViewed, ...wishlistedIds])].slice(0, 20);

      return dispatch({
        types: [LOAD_STYLE_DATA, LOAD_STYLE_DATA_SUCCESS, LOAD_STYLE_DATA_FAIL],
        promise: client => client.get(styleAPI.searchItemCode, {
          host: `${styleAPI.base}/${styleAPI.version}`,
          params: {
            locale: styleAPI.region,
            lang: styleAPI.language,
            item_code: products.join(','),
          },
          headers: {
            'Content-Type': 'text/plain',
          },
        }),
        itemIds: products,
      });
    });
  };
}

export function loadRecentlyViewedData(itemIds, brand) {
  const onlineIds = itemIds.join(',');

  return {
    types: [LOAD_RECENTLY_VIEWED_DATA, LOAD_RECENTLY_VIEWED_DATA_SUCCESS, LOAD_RECENTLY_VIEWED_DATA_FAIL],
    promise: client => client.get(catalogApi.productList, {
      host: `${catalogApi.base}/${catalogApi.version}/${brand}/${catalogApi.region}`,
      params: {
        clientID: catalogApi.client,
        locale: catalogApi.language,
        onlineID: onlineIds,
        count: itemIds.length,
      },
    }),
    brand,
  };
}
