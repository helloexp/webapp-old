import { PropTypes } from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { browserHistory } from 'react-router';
import { ConfigurationManager } from 'components/uniqlo-ui/helpers/configuration';
import getSiteConfig, { setSiteConfig } from 'config/site';
import defaultSiteConfig from 'config/site/jp';
import createStore, { injectAsyncReducers } from 'redux/create';
import ApiClient from 'helpers/ApiClient';
import getFeatureConfig from 'config/feature';
import enTranslations from 'i18n/strings-en';

// async reducers
import gifting from 'redux/modules/checkout/gifting/reducer';
import productGender from 'redux/modules/productGender';
import deliveryStore from 'redux/modules/checkout/delivery/store/reducer';
import address from 'redux/modules/account/address';
import userInfo from 'redux/modules/account/userInfo';
import delivery from 'redux/modules/checkout/delivery';
import payment from 'redux/modules/checkout/payment/reducer';
import mySize from 'redux/modules/mySize';
import wishlist from 'redux/modules/wishlist/reducer';
import applePay from 'redux/modules/applePay';

setSiteConfig(defaultSiteConfig);

const region = 'us';
const language = 'en';
const siteConfig = Object.assign({}, { region, language }, getSiteConfig(region));
const featureConfig = getFeatureConfig(region);
const componentConfig = ConfigurationManager.getCompConfig(featureConfig.ComponentConfig);
const client = new ApiClient();

// function nodeWithProps(node, props) {
//   return React.cloneElement(node, props);
// }

export function getStore(overrides = {}) {
  const store = createStore(browserHistory, client, overrides);
  const asyncReducers = {
    gifting,
    productGender,
    deliveryStore,
    address,
    userInfo,
    delivery,
    mySize,
    wishlist,
    payment,
    applePay,
  };

  store.originalDispatch = store.dispatch;
  store.dispatch = sinon.spy();
  injectAsyncReducers(store, asyncReducers);

  return store;
}

const cx = stuffToContextualize => ({ context: { ...stuffToContextualize } });
const defaultStore = getStore();
const defaultI18n = enTranslations;
const defaultConfig = {
  ...siteConfig,
  featureConfig,
  compConfig: componentConfig,
};

function getMockStore(store) {
  return {
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...defaultStore.getState(), ...store }),
  };
}

export function shallowWithStore(node, customStore) {
  const store = getMockStore(customStore);

  return shallow(node, { store, ...cx({ store }) });
}

export function shallowWithConfig(node, config = defaultConfig) {
  return shallow(node, { config, ...cx({ config }) });
}

export function shallowWithI18n(node, i18n = defaultI18n) {
  return shallow(node, { i18n, ...cx({ i18n }) });
}

export function shallowWithStoreAndConfig(node, customStore, config = defaultConfig) {
  const store = getMockStore(customStore);

  return shallow(node, { store, config, ...cx({ config, store }) });
}

export function shallowWithStoreAndI18n(node, customStore, i18n = defaultI18n) {
  const store = getMockStore(customStore);

  return shallow(node, { i18n, store, ...cx({ store, i18n }) });
}

export function shallowWithConfigAndI18n(node, config = defaultConfig, i18n = defaultI18n) {
  return shallow(node, { i18n, config, ...cx({ config, i18n }) });
}

export function shallowWithAll(node, i18n = defaultI18n, customStore, config = defaultConfig) {
  const store = getMockStore(customStore);

  return shallow(node, { i18n, store, config, ...cx({ store, config, i18n }) });
}

export function mountWithConfig(node, config = defaultConfig) {
  return mount(node, {
    context: { config },
    childContextTypes: { config: PropTypes.object },
  });
}

export function mountWithStore(node, customStore) {
  return mount(node, {
    context: { store: getMockStore(customStore) },
    childContextTypes: { store: PropTypes.object },
  });
}

export function mountWithI18n(node, i18n = defaultI18n) {
  return mount(node, {
    context: { i18n },
    childContextTypes: { i18n: PropTypes.object },
  });
}

export function mountWithStoreAndI18n(node, customStore, i18n = defaultI18n) {
  return mount(node, {
    context: { store: getMockStore(customStore), i18n },
    childContextTypes: { store: PropTypes.object, i18n: PropTypes.object },
  });
}

export function mountWithStoreAndConfig(node, customStore, config = defaultConfig) {
  return mount(node, {
    context: { store: getMockStore(customStore), config },
    childContextTypes: { store: PropTypes.object, config: PropTypes.object },
  });
}

export function mountWithConfigAndI18n(node, config = defaultConfig, i18n = defaultI18n) {
  return mount(node, {
    context: { config, i18n },
    childContextTypes: { i18n: PropTypes.object, config: PropTypes.object },
  });
}

export function mountWithAll(node, customStore, config = defaultConfig, i18n = defaultI18n) {
  return mount(node, {
    context: { store: getMockStore(customStore), config, i18n },
    childContextTypes: { store: PropTypes.object, config: PropTypes.object, i18n: PropTypes.object },
  });
}

const lifecycleMethods = [
  'render',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
];

export function stubComponent(componentClass, stubProps = false, lifecycleMethodsOverwrite, toReturn) {
  let originalPropTypes = {};

  beforeEach(() => {
    if (stubProps) {
      originalPropTypes = componentClass.propTypes;

      componentClass.propTypes = {};
    }

    (lifecycleMethodsOverwrite || lifecycleMethods).forEach((method) => {
      if (typeof componentClass.prototype[method] !== 'undefined') {
        sinon.stub(componentClass.prototype, method).returns(toReturn || null);
      }
    });

    if (stubProps) {
      afterEach(() => {
        componentClass.propTypes = originalPropTypes;
      });
    }
  });
}
