import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Drawer from 'components/Drawer';
import If from 'components/uniqlo-ui/If';
import ErrorMessage from 'components/ErrorMessage';
import { StoresLocation, StoresStates } from 'pages/Checkout/components/StoreSelector';
import * as storeActions from 'redux/modules/checkout/delivery/store/actions';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import { getIsShowStates, getSelectedDeliveryStore, getStateCode, getFilter } from 'redux/modules/checkout/delivery/store/selectors';
import Helmet from 'react-helmet';
import { redirect, getUrlWithQueryData, getCurrentBrand } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { resetScrollPosition } from 'utils/store';
import { isFilterActive } from 'utils/deliveryUtils';
import ErrorHandler from 'containers/ErrorHandler';
import styles from './styles.scss';

const { object, bool, func, string } = PropTypes;

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    if (!deliveryActions.isDeliveryMethodOptionsLoaded(getState())) {
      return dispatch(deliveryActions.loadDeliveryMethodOptions());
    }

    return Promise.resolve();
  },
}])
@connect(state => ({
  showStates: getIsShowStates(state),
  selected: getSelectedDeliveryStore(state),
  brand: getCurrentBrand(state),
  stateCode: getStateCode(state),
  filters: getFilter(state),
}), {
  getCurrentPosition: storeActions.getCurrentPosition,
  search: storeActions.loadStoresByQuery,
  confirmStorePickupShippingMethod: deliveryActions.confirmStorePickupShippingMethod,
  setFromPickupStoreAs: deliveryActions.setFromPickupStoreAs,
  selectStore: storeActions.selectStore,
  setLocationView: storeActions.setLocationView,
  resetStateCode: storeActions.resetStateCode,
  loadDeliveryMethodOptions: deliveryActions.loadDeliveryMethodOptions,
  resetDeliveryTypeAndPIB: deliveryActions.resetDeliveryTypeAndPIB,
  resetStoresList: storeActions.resetStoresList,
  resetFilter: storeActions.resetStoreFilter,
})
@ErrorHandler(['storeListLoad', 'uqAccPfError'])

export default class StoresMap extends Component {

  static propTypes = {
    brand: string,
    getCurrentPosition: func,
    selected: object,
    filters: object,
    showStates: bool,
    search: func,
    confirmStorePickupShippingMethod: func,
    selectStore: func,
    setLocationView: func,
    resetStateCode: func,
    resetFilter: func,
    resetDeliveryTypeAndPIB: func,
    loadDeliveryMethodOptions: func,
    stateCode: string,
    error: string,
    resetStoresList: func,
    setFromPickupStoreAs: func,
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
    if ((this.props.showStates !== nextProps.showStates) || (this.props.error !== nextProps.error)) {
      resetScrollPosition(this.drawerNode);
    }
  }

  componentWillUnmount() {
    this.props.resetStoresList();
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

  onCancel = () => {
    const { showStates, brand, setLocationView, selected, selectStore, loadDeliveryMethodOptions, resetDeliveryTypeAndPIB, setFromPickupStoreAs } = this.props;

    if (showStates) {
      setLocationView('map');
    } else if (selected !== null) {
      selectStore(null);
      resetDeliveryTypeAndPIB();
    } else {
      setFromPickupStoreAs(true);
      loadDeliveryMethodOptions()
      .then(() => redirect(getUrlWithQueryData(routes.delivery, { brand })));
    }
  }

  onSelectStore = (store) => {
    if (store && store.id) {
      this.props.confirmStorePickupShippingMethod(store.id)
      .then(() => this.props.selectStore(store));
    } else {
      this.props.resetDeliveryTypeAndPIB()
      .then(() => this.props.selectStore(store));
    }
  }

  onConfirmUQShipping = () => {
    this.props.selectStore(null);
    redirect(getUrlWithQueryData(routes.reviewOrder, { brand: this.props.brand }));
  };

  getRef = (node) => { this.drawerNode = node; };

  render() {
    const { showStates, selected, error } = this.props;
    const { deliveryStore } = this.context.i18n;

    return (
      <Drawer
        className={styles.deliveryPickupStore}
        noPadding
        onCancel={this.onCancel}
        title={deliveryStore.selectStore}
        variation="noFooter"
        getRef={this.getRef}
      >
        <Helmet title={deliveryStore.pageTitle} />
        <If
          if={error}
          then={ErrorMessage}
          message={error}
          rootClassName="deliveryStorePageError"
        />
        <If
          if={showStates}
          then={StoresStates}
          else={StoresLocation}
          onSearch={this.onSearch}
          selectedStore={selected}
          selectStore={this.onSelectStore}
          setPickupStore={this.onConfirmUQShipping}
        />
      </Drawer>
    );
  }
}
