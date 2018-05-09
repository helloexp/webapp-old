import { PureComponent, PropTypes, Children } from 'react';
import noop from 'utils/noop';
import { setSiteConfig } from 'config/site';

// polyfill needed since server side rendering won't have require.ensure
if (typeof require.ensure !== 'function') require.ensure = function ensure(dependencies, callback) { callback(require); };

const defaultLanguage = 'ja';
const defaultRegion = 'jp';

/**
 * Variable containers of region and translation data
 * Can be reused in e.g. redux
 */
let currentRegion = '';
let currentTranslation = {};
let currentErrors = noop;

/**
 * Set's the i18n translation object on server side
 */
export function setTexts(texts, region) {
  currentTranslation = texts;
  currentRegion = region || currentRegion;
}

/**
 * Returns currently loaded i18n translation object
 */
export function getTranslation() {
  return currentTranslation;
}

/**
 * Returns currently loaded errors object
 */
export function getErrors() {
  return currentErrors;
}

/**
 * Return current region. E.g. `jp` for Japan
 * @return {String} Region code
 */
export function getRegion() {
  return currentRegion;
}

/**
 * Get language from region code
 * @param  {String} region Region code (e.g. jp)
 * @return {String}        Language code (e.g. ja)
 */
function getLang(region) {
  const regionLanguageMap = {
    jp: 'ja',
    tw: 'zh',
    eu: 'en',
    us: 'en',
  };

  return regionLanguageMap[region] || defaultLanguage;
}

/**
 * Create and return i18n config object for use in context
 * @private
 * @param  {String} region Region code
 * @return {Object}        Object containing language and code
 */
export function getI18nConfig(region = defaultRegion) {
  currentRegion = region;

  return {
    region: currentRegion,
    language: getLang(currentRegion),
  };
}

/**
 * i18n context provider
 */
export class I18nProvider extends PureComponent {
  static propTypes = {
    config: PropTypes.object,
    strings: PropTypes.object,
    children: PropTypes.any,
  };

  static childContextTypes = {
    i18n: PropTypes.object,
    config: PropTypes.object,
  };

  getChildContext() {
    currentRegion = this.props.config.region;

    return {
      i18n: this.props.strings,
      config: this.props.config,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

/**
 * Async i18n object loader
 * This function creates chunks for each language
 * @param  {String}   region Region code
 * @param  {Function} cb     Callback to execute after async load
 */
export function loadI18n(region, cb) {
  const config = getI18nConfig(region);

  switch (config.language) {
    case 'en':
      require.ensure([], (require) => {
        currentErrors = require('./errors-en');
        setSiteConfig(require('config/site/us'));
        cb(
          currentTranslation = require('./strings-en'),
          config
        );
      }, 'i18n-en');
      break;
    case 'zh':
      require.ensure([], (require) => {
        currentErrors = require('./errors-zh');
        setSiteConfig(require('config/site/tw'));
        cb(
          currentTranslation = require('./strings-zh'),
          config
        );
      }, 'i18n-zh');
      break;
    default:
      require.ensure([], (require) => {
        currentErrors = require('./errors-ja');
        setSiteConfig(require('config/site/jp'));
        cb(
          currentTranslation = require('./strings-ja'),
          config
        );
      }, 'i18n-ja');
      break;
  }
}
