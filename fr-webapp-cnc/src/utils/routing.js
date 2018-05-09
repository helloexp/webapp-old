import reactCookie from 'react-cookie';
import config from 'config';
import getSiteConfig from 'config/site';
import { routePatterns } from 'utils/urlPatterns';

/**
 * Routing helpers for universal routing operations
 *
 * Import
 *   import { init, redirect } from 'utils/routing'
 *
 * Initialize once for the entire app (in client.js or App.js)
 *   init({region: 'jp', language: 'ja', this.context.router});
 *
 * Redirect
 *   redirect('product/1234');
 *
 * Go to Home page
 *   import { goHome } from 'utils/routing'
 *   goHome();
 *
 * Use in Link tag
 *   import { root } from 'utils/routing'
 *   <Link to={`${root}/cart`}>Go to cart</Link>
 */
export let root = ''; // eslint-disable-line import/no-mutable-exports

let Router;
const absoluteUrlPattern = /^((customerDigital|https?):)?\/\//;
const regionsRegExp = /^\/(jp|eu|tw|us)\//;
const brands = ['uq', 'gu'];

/**
 * Check if URL is external or internal (router)
 * @param  {string} url URL to check
 * @return {Boolean}       True when external link is detected
 */
const isExternalUrl = url => absoluteUrlPattern.test(url);

export function init({ region, router }) {
  root = `/${region}`;
  Router = router;
}

/**
 * Redirect to a path
 * No need to specify region.language, just the remainder
 *   redirect('cart');
 * @param  {String} path Pathname without leading /
 * @return {Object}      Router instance for chaining
 */
export function localRedirect(path = '') {
  const slash = path[0] === '/' ? '' : '/';
  const fullPath = path.indexOf(root) === 0 ? path : `${root}${slash}${path}`;

  Router.push(fullPath);

  return Router;
}

/**
 * Get current domain
 * @return {string}
 */
export function getCurrentSubDomain() {
  return window.location.host.split('.')[0] || 'dev';
}

/**
 * Redirect to pages on external sites.
 *   externalRedirect('https://secure-site.domain.com/sub/path')
 *   or externalRedirect('//domain.com/sub/path')
 */
export function externalRedirect(path = '') {
  window.location = path;
}

/**
 * Redirect to internal pages or external sites for use when destination pattern is not known
 *   redirect('https://secure-site.domain.com/sub/path')
 *   or redirect('//domain.com/sub/path')
 *   or redirect('sub/path')
 *   or redirect('/sub/path');
 */
export function redirect(path = '') {
  path += window.location && window.location.hash || '';
  if (isExternalUrl(path)) {
    externalRedirect(path);
  } else {
    localRedirect(path);
  }
}

/**
 * Go back in history
 */
export function goBack() {
  return Router.goBack();
}

/**
 * Get's the current brand from the router state.
 * @param   {Object} state  The global redux state.
 * @param   {String} selectedBrand  The brand to select, this brand takes priority over query param.
 * @return  {String}        The selected brand, `uq` or `gu`, Defaults to `uq`.
 */
export function getCurrentBrand(state, selectedBrand = null) {
  // If `selectedBrand`, we need to make sure it's a valid value
  const location = state.routing.location || state.routing.locationBeforeTransitions;

  if (selectedBrand) {
    return brands.includes(selectedBrand) ? selectedBrand : brands[0];
  }

  const brand = location.query.brand;

  return brands.includes(brand) ? brand : brands[0];
}

/**
 * Replace a token in a given string.
 * @param   {String} url      The string to replace
 * @param   {Object} values   The values to replace
 * @return  {String}          The string with replaced values.
 *
 * replaceUrlParams('/api/{brand}/cart/items/{id}', { brand: 'uq', id: 1 });
 * //=> /api/uq/cart/items/1
 */
export function replaceUrlParams(url, values) {
  return Object.keys(values)
    .reduce((result, key) => {
      const exp = new RegExp(`{${key}}`);

      return result.replace(exp, values[key]);
    }, url);
}

/**
 * Update base url with query parameters
 * eg: getUrlWithQueryData(www.somewhere.com, { brand: 'uq', somethingElse: 'value' })
 * gives the string => 'www.somewhere.com?brand=uq&somethingElse=value'
 * @param   {String} base
 * @param   {Object} [queryData={}]
 * @return  {String} base url with queries
 */
export function getUrlWithQueryData(base, queryData = {}) {
  const queries = Object.keys(queryData);

  return queries.reduce((acc, query, index) => {
    const url = `${acc}${encodeURIComponent(query)}=${encodeURIComponent(queryData[query])}`;

    return (index + 1) < queries.length ? `${url}&` : url;
  }, `${base}?`);
}

/**
 * Prepend root to path
 * @param {string} path
 * @return {string}
 */
export function prependRoot(path) {
  const slash = path[0] === '/' ? '' : '/';

  return `${root}${slash}${path}`;
}

/**
 * Get current host
 * @param {Boolean} topLevel
 * @param {'uq'|'gu'|'map'} envKey - environment key
 * @return {string}
 */
export function getCurrentHost(topLevel, envKey = 'uq') {
  const domainKey = getCurrentSubDomain();
  const { domains } = getSiteConfig();

  if (domainKey === 'dev' && topLevel || domainKey > 9) {
    return 'uniqlo.com';
  }

  return domains[domainKey][envKey];
}

/**
 * Go to the home page
 * @param {string} brand 'uq' or 'gu'
 */
export function goHome(brand) {
  const { UQ_LINK_TO_TOP_PAGE, GU_LINK_TO_TOP_PAGE, brandName } = getSiteConfig();
  let redirectTo = UQ_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(true));

  if (brand === brandName.gu) {
    redirectTo = GU_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(false, brandName.gu));
  }

  redirect(redirectTo);
}

/**
 * Removes the region from the path
 * @param path - The path that will get the region removed
 */
export function removeRegion(path) {
  return path.replace(regionsRegExp, '');
}

/**
 * Forces a full reload to change the protocol
 */
export function redirectToProtocol(protocol, path) {
  location.href = `${protocol}://${window.location.host}${path}`;
}

/**
 * Checks if the current page is loaded on a secured connection
 */
export function isSecuredConnection() {
  return location.protocol === 'https:';
}

/**
 * Finds the values of a query parameter
 * @param {String} params - Query param name
 * @return {Array} - values for the param
 */
export function getQueryParamValues(param = '') {
  const query = window.location.search.substring(1);
  const queryArr = query.split('&');
  const values = [];

  for (let index = 0; index < queryArr.length; index++) {
    const pair = queryArr[index].split('=');

    if (pair[0] === param) {
      values.push(pair[1]);
    }
  }

  return values;
}

export function isFromLineApp() {
  const { cookies = {} } = config.app || {};
  const hasFromLineCookie = !!reactCookie.load(cookies.disableAnalytics);

  return hasFromLineCookie || getQueryParamValues('from').includes('line');
}

export function isAnalyticsDisabledRoute() {
  return isFromLineApp()
    || (routePatterns.cart.test(location.pathname) && getQueryParamValues('disable_gtm').includes('true'));
}

export function getCurrentBrandFromLocation() {
  const { brandName } = getSiteConfig();
  const brand = window.location.search && window.location.search.match(/brand=(uq|gu)/)
    ? location.search.match(/brand=(uq|gu)/)[1]
    : brandName.uq;

  return brand;
}
