/*
Please refer https://www.pivotaltracker.com/n/projects/2003565/stories/146905631 for the logic used here.
*/

import { catalogApi } from 'config/api';
import reactCookie from 'react-cookie';
import { GU_APP_VERSION, REMOVE_DECIMAL_POINT } from 'helpers/regex';
import getSiteConfig from 'config/site';
import { constantsGenerator } from 'utils';
import { stripHttp } from 'utils/formatUrls';
import { getSortedProductList } from 'utils/productUtils';

const generateConstants = constantsGenerator('silveregg');
const {
  LOAD_SILVEREGG_RECOMMENDATIONS, LOAD_SILVEREGG_RECOMMENDATIONS_SUCCESS, LOAD_SILVEREGG_RECOMMENDATIONS_FAIL,
} = generateConstants('LOAD_SILVEREGG_RECOMMENDATIONS');

const { silveregg: { specType11, specType12, specTypeApp11, specTypeApp12, scriptUrl }, brandName, SHIPPING_THRESHOLD_PRICE } = getSiteConfig();

const initialState = {
  items: {},
  productIds: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_SILVEREGG_RECOMMENDATIONS_SUCCESS:
      const { onlineID, specType, productIds = [] } = action.data;
      const productList = action.result;
      let httpSanitizedResult = [];

      if (productList) {
        const sortedList = getSortedProductList(productList, onlineID);

        httpSanitizedResult = stripHttp(sortedList);
      }

      if (productList || action.data) {
        return {
          ...state,
          items: {
            ...state.items,
            [specType]: httpSanitizedResult,
          },
          productIds: {
            ...state.productIds,
            [specType]: productIds,
          },
        };
      }

      return {
        ...state,
      };
    default:
      return state;
  }
}

/**
 * @private
 * Check if GU App accessed cart page
 * @return {Boolean} True if it's Guapp
 **/
function checkIfGUApp() {
  const checkFlags = {};
  const name = window.navigator.userAgent.toLowerCase();

  checkFlags.isiOSApp = name.indexOf('gu ios application') >= 0;
  checkFlags.isAndroidApp = name.indexOf('gu android application') >= 0;

  if (checkFlags.isiOSApp || checkFlags.isAndroidApp) {
    const matchResults = GU_APP_VERSION.exec(name) || [];

    if (matchResults[1]) {
      const appVersion = matchResults[1].replace(REMOVE_DECIMAL_POINT, '').slice(0, 3);

      if (appVersion < 400) {
        return false;
      }
    }

    return true;
  }

  return false;
}

/**
 * @public
 * if cart is empty or total amount is larger than 5000yen, we cal sp412 only, we show recommendation in one area
   if total amount from 1-4999yen, we call both sp411 and sp412, we show recommendation in two area
   Also if GUApp access cart page, we change spec id to ap411 and ap412.
 * @param {Object} cart - gu cart
 * @return {Array} specTypes to be used for gu recommendation
 **/
export function getSpecTypes(cart = {}) {
  const isGuApp = checkIfGUApp();
  const products = cart.items || [];

  if (!products.length || cart.totalAmount > SHIPPING_THRESHOLD_PRICE.gu) {
    return isGuApp ? [specTypeApp12] : [specType12];
  }

  return isGuApp ? [specTypeApp11, specTypeApp12] : [specType11, specType12];
}

/**
 * @private
 * To build prod key values for silveregg api call.
 * @param {Object} cart - gu cart
 * @return {String} product ids of gu cart combined in the form id1,id2
 **/
function buildProdParams(cart = {}) {
  const products = cart.items || [];

  if (products.length) {
    const params = 'prod=';
    const ids = (products.map(item => params + item.id)).join('&');

    return ids;
  }

  return null;
}

/**
 * @private
 * cust - getCookie("HUN"),
 * cookie - getCookie("HCN")
 * @return {Object} Object with cookie values
 **/
function getCookieValues() {
  const HCNValue = reactCookie.load('HCN');
  const HUNValue = reactCookie.load('HUN');

  if (HCNValue) {
    return {
      cookie: HCNValue,
      cust: HUNValue,
    };
  }

  return {};
}

/**
 * @public
 * Redux method to call /list api and get details of all product ids returned by silveregg.
 * @param {Object} response - Response of silveregg api
 * @return {Promise} Object with cookie values
 **/
export function getSilvereggProducts(response = {}) {
  const { prod: productIds, spec: specType } = response;

  if (productIds && productIds.length) {
    const onlineID = productIds.join(',');
    const count = productIds.length;
    const data = { onlineID, productIds, specType };

    return {
      types: [LOAD_SILVEREGG_RECOMMENDATIONS, LOAD_SILVEREGG_RECOMMENDATIONS_SUCCESS, LOAD_SILVEREGG_RECOMMENDATIONS_FAIL],
      promise: client => client.get(catalogApi.productList, {
        host: `${catalogApi.base}/${catalogApi.version}/${brandName.gu}/${catalogApi.region}`,
        params: {
          clientID: catalogApi.client,
          locale: catalogApi.language,
          onlineID,
          count,
        },
      }),
      data,
    };
  }

  return {
    type: LOAD_SILVEREGG_RECOMMENDATIONS_SUCCESS,
    data: { productIds, specType },
  };
}

/**
 * @public
 * Method to construct the silveregg api
 * @param {Object} guCart - gu Cart
 * @return {Array} api urls
 **/
export function constructSilvereggScript(guCart) {
  const { cust, cookie } = getCookieValues();
  const prodParams = buildProdParams(guCart);
  const specTypes = getSpecTypes(guCart);
  const urls = [];
  let baseUrl = scriptUrl;

  if (cookie) {
    baseUrl += `&cust=${cust}&cookie=${cookie}`;
  }

  specTypes.forEach((type) => {
    let url = prodParams
      ? `${baseUrl}&${prodParams}&spec=${type}`
      : `${baseUrl}&spec=${type}`;

    if ([specType11, specTypeApp11].includes(type)) {
      const minprice = SHIPPING_THRESHOLD_PRICE.gu - (guCart.orderSummary.totalMerchandise || guCart.orderSummary.totalMerchandiseOrder);
      const maxprice = minprice + 1000;

      url += `&minprice=${minprice}&maxprice=${maxprice}`;
    }

    url += '&callback=window.processSilvereggResponse';
    urls.push({
      src: url,
    });
  });

  return urls;
}
