import { loadCertonaItems } from 'utils/certona';
import { constantsGenerator } from 'utils';
import { stripHttp } from 'utils/formatUrls';
import { getCurrentBrand } from 'utils/routing';
import { catalogApi } from 'config/api';
import { standardizeProduct, getSortedProductList } from 'utils/productUtils';
import castArray from 'utils/castArray';

const generateConstants = constantsGenerator('certona');

const { FETCH_ITEM, FETCH_ITEM_SUCCESS, FETCH_ITEM_FAIL } = generateConstants('FETCH_ITEM');
const {
  LOAD_CERTONA_RECOMMENDATIONS, LOAD_CERTONA_RECOMMENDATIONS_SUCCESS, LOAD_CERTONA_RECOMMENDATIONS_FAIL,
} = generateConstants('LOAD_CERTONA_RECOMMENDATIONS');

/**
 * @typedef {Object} productItem
 * @property {boolean} zoomIn
 * @property {boolean} colorSelected
 * @property {boolean} sizeSelected
 * @property {boolean} lengthSelected
 * @property {boolean} recommendationsLoaded
 * @property {Object} recommendations
 * @property {Array} recommendations.alsoLooked
 * @property {Array} recommendations.alsoBought
 */

/**
 * Empty product
 * @type {productItem}
 */
const emptyItem = {
  zoomIn: false,
  colorSelected: false,
  sizeSelected: false,
  lengthSelected: false,
  recommendationsLoaded: false,
  recommendations: {
    alsoLooked: [],
    alsoBought: [],
  },
  selected: {},
};

const initialState = {
  // itemDetails: {},
  // selectedItem: {},
  // recommendedItems: {},
  // addToCartModalShown: false,
  items: {},
  // productGender: {},
  // productCollection: {},
  // noInStore: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    /**
     * GQL Query successful, get result, strip html from all urls and leave OS agnostic urls behind,
     * standardize the product and all it's details
     *
     * Afterwards add some mock data and get all the dimensions which make sense for the product, effectively
     * tying in the default state once a product is loaded
     *
     * If there's no product data (SKUs) - back out and return an empty object for a /noProduct routing (404)
     * Necessary because GQL returns 200 if no items are found
     * (which is theoretically correct because the GQL call WAS successful)
     */
    case FETCH_ITEM_SUCCESS: {
      const sanitized = action.result ? stripHttp(action.result) : {};
      const resultItem = sanitized.items[0];

      if (!resultItem || !resultItem.SKUs) {
        const items = {};

        items[action.containerId] = {};

        return {
          ...state,
          items: {
            ...state.items, ...items,
          },
        };
      }

      const result = {
        ...standardizeProduct(resultItem, sanitized.colors, sanitized.sizes, sanitized.lengths, emptyItem),
      };

      const styleBook = castArray(result.itemStyles);
      const styleImages = castArray(styleBook.styles).map(
        style =>
           ({
             ...style,
             styleImgUrl: style.styleImgUrl.replace('.jpg', '-xl.jpg'),
           })
      );

      if (styleImages) {
        result.styleBook = [...styleImages];
      }

      const items = {};

      items[action.containerId] = {
        ...emptyItem, ...result,
      };

      return {
        ...state,
        items: {
          ...state.items, ...items,
        },
      };
    }

    case FETCH_ITEM_FAIL: {
      const items = {};

      items[action.containerId] = {};

      return {
        ...state,
        items: {
          ...state.items, ...items,
        },
      };
    }

    /**
     * Once Certona recommended items have been loaded, populate state tree with data
     */
    case LOAD_CERTONA_RECOMMENDATIONS_SUCCESS: {
      const { onlineIds, alsoBoughtItemsCount, productId } = action.data;
      const productList = action.result;
      const sortedList = getSortedProductList(productList, onlineIds);
      const httpSanitizedResult = stripHttp(sortedList);
      const alsoBoughtItems = httpSanitizedResult.slice(0, alsoBoughtItemsCount);
      const alsoLookedItems = httpSanitizedResult.slice(alsoBoughtItemsCount, httpSanitizedResult.length);

      const items = {};
      const item = state.items[productId];

      items[productId] = {
        ...item,
        recommendations: {
          alsoBought: alsoBoughtItems,
          alsoLooked: alsoLookedItems,
        },
        recommendationsLoaded: true,
      };

      if (productList) {
        return {
          ...state,
          items: {
            ...state.items, ...items,
          },
        };
      }

      return {
        ...state,
      };
    }

    default:
      return state;
  }
}

function getItemFromState(state, id) {
  const items = state.products && state.products.items;

  return items && items[id];
}

function isItemLoaded(globalState, { id }, returnItem) {
  const item = getItemFromState(globalState, id);

  return returnItem ? item : item && item.onlineId === id;
}

function areRecommendationsLoaded(globalState, id) {
  const item = isItemLoaded(globalState, { id }, true);

  return item && item.recommendationsLoaded;
}

function getCertonaProductDetails(onlineIds, alsoBoughtItemsCount, alsoLookedItemsCount, productId, brand) {
  const data = {
    onlineIds,
    alsoBoughtItemsCount,
    alsoLookedItemsCount,
    productId,
  };

  const count = alsoBoughtItemsCount + alsoLookedItemsCount;

  return {
    types: [LOAD_CERTONA_RECOMMENDATIONS, LOAD_CERTONA_RECOMMENDATIONS_SUCCESS, LOAD_CERTONA_RECOMMENDATIONS_FAIL],
    promise: client => client.get(catalogApi.productList, {
      host: `${catalogApi.base}/${catalogApi.version}/${brand}/${catalogApi.region}`,
      params: {
        clientID: catalogApi.client,
        locale: catalogApi.language,
        onlineID: onlineIds,
        count,
      },
    }),
    data,
  };
}

export function saveCertonaRecommendations(recommendations, onlineId) {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    if (recommendations) {
      const schemes = recommendations.resonance.schemes;
      const alsoBought = schemes[0].items;
      const alsoBoughtItemsCount = alsoBought.length;
      const onlineIds = alsoBoughtItemsCount && alsoBought.map(item =>
         item.id
      ).join(',');

      dispatch(getCertonaProductDetails(onlineIds, alsoBoughtItemsCount, 0, onlineId, brand));
    }
  };
}

function loadItem(params, containerId) {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());
    const id = containerId || params.id;

    return dispatch({
      types: [FETCH_ITEM, FETCH_ITEM_SUCCESS, FETCH_ITEM_FAIL],
      promise: client => client.get(catalogApi.productDetail, {
        host: `${catalogApi.base}/${catalogApi.version}/${brand}/${catalogApi.region}`,
        params: {
          clientID: catalogApi.client,
          locale: catalogApi.language,
          onlineID: id,
        },
      }),
      containerId: id,
      ...params,
    });
  };
}

export function loadCertonaRecommendations(onlineId, multiple, pageType = 'L4', handlerFn) {
  return (dispatch, getState) => {
    const state = getState();
    const ids = onlineId.split(',');

    function getRecommendations() {
      if (multiple || !areRecommendationsLoaded(state, onlineId)) {
        return loadCertonaItems(pageType, {
          itemid: ids.join(','),
        }).then((recommendations) => {
          dispatch(saveCertonaRecommendations(recommendations, onlineId));
          if (handlerFn && typeof handlerFn === 'function') {
            handlerFn(recommendations, onlineId);
          }
        });
      }

      return Promise.resolve();
    }

    const itemsLoaded = ids.map((id) => {
      if (!isItemLoaded(state, { id })) {
        return dispatch(loadItem({ id }));
      }

      return null;
    }).filter(Boolean);

    return Promise.all(itemsLoaded).then(getRecommendations);
  };
}
