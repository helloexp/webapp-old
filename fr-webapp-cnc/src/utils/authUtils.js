import AppConfig from 'config';
import defaultSiteConfig from 'config/site/default';
import { getRegion } from 'i18n';

const { account: accountConfig } = defaultSiteConfig;

/**
 * construct base redirect url from current window location
 * make the protocol string consistent and also add port if
 * the environment is production and doesn't has a public domain
 *
 * @export
 * @param {boolean} [endWithSlash=false] - whether to append a slash at the end
 * @returns {String} - base auth redirect url
 */
export function getBaseUrl(endWithSlash = false) {
  const { location } = global.window;
  const region = getRegion();
  // Sometimes protocol comes with ":" and sometimes it doesn't O.o
  const protocol = location.protocol.replace(/:/, '');
  // omit port only in production with a domain
  const port = (AppConfig.isProduction && !location.port) ? '' : `:${location.port}`;
  const slash = endWithSlash ? '/' : '';

  return `${protocol}://${location.hostname}${port}/${region}${slash}`;
}

/**
 * construct exact OAuth redirect url
 *
 * @export
 * @returns {String} - auth redirect url
 */
export function getOAuthUrl() {
  return `${getBaseUrl()}${accountConfig.rpCallbackPath}`;
}
