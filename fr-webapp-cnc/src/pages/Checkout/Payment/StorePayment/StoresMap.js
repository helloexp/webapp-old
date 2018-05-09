import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import classNames from 'classnames';
import Helmet from 'react-helmet';
import If from 'components/uniqlo-ui/If';
import Text from 'components/uniqlo-ui/Text';
import ErrorHandler from 'containers/ErrorHandler';
import { loadDeliveryMethod, isDeliveryMethodLoaded } from 'redux/modules/checkout/delivery';
import { isUserDefaultDetailsLoaded, loadDefaultDetails } from 'redux/modules/account/userInfo';
import {
  resetStateCode as resetStateCodeAction,
  getCurrentPosition as getCurrentPositionAction,
  loadStoresByQuery as searchAction,
  setLocationView,
  resetStoresList,
  resetStoreFilter,
} from 'redux/modules/checkout/delivery/store/actions';
import {
  selectPaymentStore as selectPaymentStoreAction,
  restoreSelectedStore as setPaymentStoreAction,
  setUQPaymentAndRedirect,
} from 'redux/modules/checkout/payment/store';
import { hasIncompleteBillingAddress } from 'redux/modules/checkout/payment/selectors.js';
import { fetchBillingAddress, setPaymentMethod } from 'redux/modules/checkout/payment/actions';
import { StoresLocation, StoresStates } from 'pages/Checkout/components/StoreSelector';
import { isGiftCardsAvailable } from 'redux/modules/checkout/payment/selectors';
import { redirect, getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import { getFilter } from 'redux/modules/checkout/delivery/store/selectors';
import Drawer from 'components/Drawer';
import { routes } from 'utils/urlPatterns';
import { resetScrollPosition } from 'utils/store';
import { isFilterActive } from 'utils/deliveryUtils';
import noop from 'utils/noop';
import styles from './styles.scss';

const { object, bool, func, string, array } = PropTypes;

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    if (!isDeliveryMethodLoaded(getState())) {
      promises.push(dispatch(loadDeliveryMethod()).catch(noop));
    }

    promises.push(dispatch(fetchBillingAddress())
      .then(() => {
        const globalState = getState();
        const { payment: { billingAddress } } = globalState;

        if (!(billingAddress && billingAddress.email) && !isUserDefaultDetailsLoaded(globalState)) {
          promises.push(dispatch(loadDefaultDetails()));
        }
      }));

    return Promise.all(promises);
  },
}])
@connect(state => ({
  brand: getCurrentBrand(state),
  selectedStore: state.paymentStore.selectedStore,
  showStates: state.deliveryStore.showStates,
  stateCode: state.deliveryStore.stateCode,
  isGiftCardAvailable: isGiftCardsAvailable(state),
  filters: getFilter(state),
  isBillingAddressIncomplete: hasIncompleteBillingAddress(state),
}),
  {
    getCurrentPosition: getCurrentPositionAction,
    resetStateCode: resetStateCodeAction,
    selectPaymentStore: selectPaymentStoreAction,
    setPaymentStore: setPaymentStoreAction,
    search: searchAction,
    setLocationView,
    setUQPayment: setUQPaymentAndRedirect,
    setPaymentMethod,
    resetStoresList,
    resetFilter: resetStoreFilter,
  })
@ErrorHandler(['storeListLoad'])
export default class StoresMap extends Component {

  static propTypes = {
    // From selectors
    brand: string,
    isGiftCardAvailable: bool,

    // From redux state
    selectedStore: object,
    showStates: bool,
    stateCode: string,
    addressBook: array,

    // Actions from connect
    getCurrentPosition: func,
    resetStateCode: func,
    selectPaymentStore: func,
    search: func,
    setLocationView: func,
    setPaymentStore: func,
    setUQPayment: func,
    setPaymentMethod: func,
    error: string,
    resetStoresList: func,
    resetFilter: func,
    filters: object,
    isBillingAddressIncomplete: bool,
  };

  static contextTypes = {
    config: object.isRequired,
    i18n: object,
  };

  componentWillMount() {
    this.props.resetStateCode();
  }

  componentDidMount() {
    // We need to get current location in client side only
    this.props.getCurrentPosition(this.context.config.location);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.showStates !== nextProps.showStates) {
      resetScrollPosition(this.drawerNode);
    }
  }

  componentWillUnmount() {
    this.props.resetStoresList();
    this.props.selectPaymentStore(null);
  }

  onCancel = () => {
    const { showStates, brand, selectPaymentStore, selectedStore } = this.props;

    if (showStates) {
      this.props.setLocationView('map');
    } else if (selectedStore && selectedStore[brand]) {
      selectPaymentStore(null);
    } else {
      redirect(getUrlWithQueryData(routes.payment, { brand }));
    }
  }

  onSearch = (value) => {
    const { stateCode, resetStateCode, search, getCurrentPosition, resetFilter, filters } = this.props;

    if (stateCode !== '0') {
      resetStateCode();
    }

    if (value) {
      if (isFilterActive(filters)) {
        resetFilter();
      }
    } else {
      getCurrentPosition(this.context.config.location);
    }

    search(value);
  };

  onPayAtStore = (store) => {
    const { isBillingAddressIncomplete, brand, setPaymentStore, setUQPayment, isGiftCardAvailable } = this.props;
    const { config: { payment } } = this.context;

    if (store) {
      setPaymentStore({ [brand]: store });
      if (isBillingAddressIncomplete) {
        this.props.setPaymentMethod(payment.uniqloStore)
        .then(() => redirect(getUrlWithQueryData(routes.payment, { brand })));
      } else {
        setUQPayment(isGiftCardAvailable);
      }
    }
  };

  getRef = (node) => { this.drawerNode = node; };

  render() {
    const { selectPaymentStore, selectedStore, brand, showStates, error } = this.props;
    const { i18n: { deliveryStore }, config: { pages: { PAYMENT } } } = this.context;

    return (
      <Drawer
        className={classNames(styles.paymentStore, styles.paymentStoreDrawer)}
        noPadding
        onCancel={this.onCancel}
        title={deliveryStore.selectStore}
        variation="noFooter"
        getRef={this.getRef}
      >
        <Helmet title={deliveryStore.pageTitle} />
          <If if={error}>
            <Text className={styles.errorMessage}>{error}</Text>
          </If>
          <If
            if={showStates}
            then={StoresStates}
            else={StoresLocation}
            selectedStore={selectedStore && selectedStore[brand]}
            onSearch={this.onSearch}
            selectStore={selectPaymentStore}
            setPickupStore={this.onPayAtStore}
            page={PAYMENT}
          />
      </Drawer>
    );
  }
}
