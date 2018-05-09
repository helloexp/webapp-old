import { DOMProperty } from 'react-dom/lib/ReactInjection';
import getSiteConfig from 'config/site';
import defaultConfig from 'config/site/default';
import { routePatterns } from 'utils/urlPatterns';
import { isAnalyticsDisabledRoute } from 'utils/routing';
import { calculateAge } from 'utils/formatDate';
import noop from 'utils/noop';

const HTMLDOMPropertyConfig = {
  isCustomAttribute: attributeName => attributeName.indexOf('analytics-') === 0,
};

DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig);

const {
  location,
  // Default value here only for unit tests. In real browser it always have value.
  dataLayer = [],
} = window;

// Exclude some routes cause they tracked separately
const excludedNavigationRoutePatterns = [
  routePatterns.cart,
  routePatterns.checkout,
  routePatterns.reviewOrder,
  routePatterns.payment,
  routePatterns.gifting,
  routePatterns.delivery,
  routePatterns.confirmOrder,
];

let currentPath = location.pathname;
let previousPath = currentPath;

function getBaseNavigationEvent() {
  return {
    event: 'content-view',
    device: 'smartphone',
    'content-name': currentPath,
    'previous-content-name': previousPath,
  };
}

/**
 * A decorator function to ensure analytics support for the current route.
 * @param {Function} fn - The analytics function to be invoked after confirming
 * analytics support for the current route.
 */
function checkAnalyticsSupport(fn = noop) {
  return (...args) => {
    if (!isAnalyticsDisabledRoute()) {
      return fn.apply(this, args);
    }

    return null;
  };
}

export const trackNavigation = checkAnalyticsSupport(() => {
  previousPath = currentPath;
  currentPath = location.pathname;

  const shouldInclude = !excludedNavigationRoutePatterns.some(routePattern => routePattern.test(currentPath));

  if (shouldInclude) {
    const baseNavigationEvent = getBaseNavigationEvent();

    dataLayer.push({
      ...baseNavigationEvent,
    });
  }
});

const mapCartItem = brandCode => ({
  sku,
  title: name,
  price,
  count: quantity,
  catalogItem: {
    category = '',
  } = {},
}) => ({
  sku,
  name,
  price,
  quantity,
  category: `${brandCode}_${category.substr(0, 2)}`,
});

/* eslint-disable camelcase */
export const trackCartNavigation = checkAnalyticsSupport(({ uq: uqItems = [], gu: guItems = [] }) => {
  const baseNavigationEvent = getBaseNavigationEvent();

  dataLayer.push({
    ...baseNavigationEvent,
    product_list_uq: uqItems.map(mapCartItem('UQ')),
    product_list_gu: guItems.map(mapCartItem('GU')),
  });
});

export const trackCheckoutNavigation = checkAnalyticsSupport((brand, params = {}) => {
  const {
    brand: brandCodeMap,
  } = defaultConfig;

  // leave brand as fallback for debug information
  const brandCode = brandCodeMap[brand.toLowerCase()] || brand;
  const baseNavigationEvent = getBaseNavigationEvent();

  dataLayer.push({
    ord_brand_kbn: brandCode,
    ...baseNavigationEvent,
    ...params,
  });
});

/**
 * @typedef  {Object} PricesObj
 * @property {Number} transactionShipping - sum of the Shipping fee of all orders.
 * @property {Number} transactionTax - sum of the tax of all orders.
 * @property {Number} transactionTotalUQ - total amount of UQ including tax of all orders
 * @property {Number} transactionTotalGU - total amount of GU including tax of all orders
 * @property {Number} transactionTotal - Same as transactionTotalUQ or transactionTotalGU.
 */

/**
 * @typedef  {Object} ProductObj
 * @property {String} sku - L1 code
 * @property {String} name - product name
 * @property {String} category
 * @property {String} price
 * @property {String} quantity
 */

/**
 * @typedef  {Object} AggregatedOrdersObj
 * @property {Array.<ProductObj>} products
 * @property {PricesObj} prices
 * @property {String} transactionId
 * @property {String} zipcode
 * @property {String} transactionAffiliation
 * @property {String} ord_brand_kbn
 * @property {String} orderer_addr_city
 * @property {String} orderer_addr_state
 */

/**
 * Aggregates all split order details for Google Analytics
 * {@link https://www.pivotaltracker.com/story/show/151110877}
 * @param {Array.<Object>} orders
 * @param {Array.<Object>} catalogItems
 * @param {String('uq'|'gu)} brand
 * @returns {AggregatedOrdersObj}
 */
function aggregateOrders(orders = [], catalogItems, brand) {
  // loop runs for each split
  const aggregation = orders.reduce((acc, order, index) => {
    // aggregate prices
    acc.prices = {
      ...acc.prices,
      transactionTotal: ~~acc.prices.transactionTotal + ~~order.total_amt_in_tax,
      transactionShipping: ~~acc.prices.transactionShipping + ~~order.shipping_fee,
      transactionTax: ~~acc.prices.transactionTax + ~~order.tax,
    };

    // loop runs for each product item under the current split
    order.order_detail_list.forEach((orderDetailListItem) => {
      const currentSku = orderDetailListItem.l1_goods_cd;
      const catalogItem = catalogItems.find(
        ctlgItem => ctlgItem.productID === currentSku
      ) || { category: '' };

      // if currentSku was seen in previous iterations
      if (acc.products[currentSku]) {
        // update its quantity
        acc.products[currentSku].quantity += ~~orderDetailListItem.goods_cnt;
        // price shall be of the last item in the iteration
        acc.products[currentSku].price = ~~orderDetailListItem.sale_price_amt;
      } else {
        // this is a new/unique sku, create it under main product accumulator
        acc.products[currentSku] = {
          sku: currentSku,
          name: orderDetailListItem.goods_nm,
          price: ~~orderDetailListItem.sale_price_amt,
          quantity: ~~orderDetailListItem.goods_cnt,
          category: `${brand.toUpperCase()}_${catalogItem.category.substr(0, 2)}`,
        };
      }
    });

    // set the value of the order with minimum order number
    if (index === 0) {
      acc.transactionId = order.ord_no;
      acc.transactionAffiliation = order.coupon_id;
      acc.zipcode = order.orderer_zip_cd;
      acc.ord_brand_kbn = order.ord_brand_kbn;
      acc.orderer_addr_city = order.orderer_addr_city;
      acc.orderer_addr_state = order.orderer_addr_state;
    }

    return acc;
  }, {
    prices: {},
    products: {},
  });

  const {
    uq: transactionTotalUQ,
    gu: transactionTotalGU,
  } = { [brand]: aggregation.prices.transactionTotal };

  aggregation.prices.transactionTotalUQ = ~~transactionTotalUQ;
  aggregation.prices.transactionTotalGU = ~~transactionTotalGU;
  aggregation.products = Object.keys(aggregation.products).map(key => aggregation.products[key]);

  return aggregation;
}

/**
 * https://frit.rickcloud.jp/wiki/display/TEST/Ecommerce+Data+Transfer+Specification
 */
export const trackOrderConfirmNavigation = checkAnalyticsSupport(({
  brand,
  userDefaultDetails,
  catalogItems,
  allOrderDetails = [],
  storeDetails,
}) => {
  const { gender, birthday } = userDefaultDetails;
  const { countryCode } = getSiteConfig();
  const baseNavigationEvent = getBaseNavigationEvent();
  const age = birthday ? calculateAge(birthday) : null;

  const calcAgeGroup = (group) => {
    if (!age) {
      return 99;
    }

    return age < 70 ? (Math.floor(age / group) * group) : 70;
  };

  const agegroup05 = calcAgeGroup(5);
  const agegroup10 = calcAgeGroup(10);
  const gender_agegroup10 = `${gender}_${agegroup10}`;
  const {
    prices: aggregatedPrices,
    products: aggregatedProducts,
    transactionId,
    zipcode,
    transactionAffiliation,
    ord_brand_kbn,
    orderer_addr_city,
    orderer_addr_state,
  } = aggregateOrders(allOrderDetails, catalogItems, brand);

  dataLayer.push({
    ...baseNavigationEvent,
    ord_brand_kbn,
    gender,
    agegroup05,
    agegroup10,
    gender_agegroup10,
    age,
    transactionId,
    transactionAffiliation,
    ...aggregatedPrices,
    zipcode: zipcode || '',
    region: orderer_addr_state || '',
    orderer_addr_city,
    orderer_addr_state,
    ...storeDetails,

    // Confirmed with Hayama san that can be used static '392' jp code for now
    // Should be changed after CnC replace in Sept 2017
    country_cd: countryCode,
    transactionProducts: aggregatedProducts,
  });
});

export const trackEvent = checkAnalyticsSupport(({
  category,
  action,
  label,
  value,
}) => {
  dataLayer.push({
    event: 'interaction',
    device: 'smartphone',
    target: category,
    'target-properties': label,
    action,
    value,
  });
});
/* eslint-enable camelcase */

export const trackError = checkAnalyticsSupport((
  { endpoint = '', resultCode, statusCode } = {},
  actionPrefix = '',
) => {
  const targetProperties = {};
  const queryStrippedEndpoint = endpoint.split('?')[0];

  if (statusCode) targetProperties.statusCode = statusCode;
  if (resultCode) targetProperties.resultCode = resultCode;

  dataLayer.push({
    event: 'errorTracking',
    target: 'API_Failure',
    action: actionPrefix ? `${actionPrefix}-${queryStrippedEndpoint}` : queryStrippedEndpoint,
    'target-properties': JSON.stringify(targetProperties),
  });
});
