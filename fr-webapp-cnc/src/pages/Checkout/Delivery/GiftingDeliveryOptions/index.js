import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { redirect, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { getBrand } from 'redux/modules/cart/selectors';
import { setCheckoutStatus } from 'redux/modules/checkout';
import * as deliverySelectors from 'redux/modules/checkout/delivery/selectors';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import GiftingWithTimeframe from './GiftingWithTimeframe';

const { bool, func, object, string } = PropTypes;

@connect(
  state => ({
    brand: getBrand(state),
    isShipping: deliverySelectors.isShipping(state),
    shouldSetNextDaySession: deliverySelectors.shouldSetNextDaySession(state),
    isNotStoreOrCvsDelvType: deliverySelectors.isNotStoreOrCvsDelvType(state),
  }), {
    loadDeliveryMethodOptions: deliveryActions.loadDeliveryMethodOptions,
    saveShippingPreferences: deliveryActions.saveShippingPreferences,
    setNextDayDeliveryDontCareFlag: deliveryActions.setNextDayDeliveryDontCareFlag,
    resetSplitDetailsLoaded: deliveryActions.resetSplitDetailsLoaded,
    setCheckoutStatus,
  }
)
export default class GiftingDeliveryOptions extends PureComponent {
  static propTypes = {
    // From local connect and selectors
    brand: string,
    isShipping: bool,
    shouldSetNextDaySession: bool,
    isNotStoreOrCvsDelvType: bool,

    // Actions from connect
    loadDeliveryMethodOptions: func,
    saveShippingPreferences: func,
    setNextDayDeliveryDontCareFlag: func,
    setCheckoutStatus: func,
    resetSplitDetailsLoaded: func,

    // Props from parent component
    isApplyButtonVisible: bool,

    // Actions from parent component
    toggleModal: func,
    onToggleDateTimeModal: func,
    onToggleNextDateModal: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  redirectTo = (path) => {
    const { saveShippingPreferences, isShipping, brand, setNextDayDeliveryDontCareFlag, shouldSetNextDaySession, resetSplitDetailsLoaded } = this.props;
    const { config: { pages: { PAYMENT, DELIVERY } } } = this.context;

    let redirectPath = getUrlWithQueryData(routes.payment, { brand });

    if (path === PAYMENT) {
      this.props.setCheckoutStatus(DELIVERY);
    } else {
      redirectPath = getUrlWithQueryData(routes.reviewOrder, { brand });
      this.props.setCheckoutStatus(PAYMENT);
    }

    if (isShipping) {
      saveShippingPreferences()
        .then(() => shouldSetNextDaySession && setNextDayDeliveryDontCareFlag(brand))
        .then(() => resetSplitDetailsLoaded())
        // Whenever setting a new timeframe, we need to reload the delivery options
        // there are some items that disable some options
        .then(() => redirect(redirectPath));
    } else {
      redirect(redirectPath);
    }
  }

  showPayment = () => {
    const { config: { pages: { PAYMENT } } } = this.context;

    this.redirectTo(PAYMENT);
  };

  saveAndgoToReviewOrder = () => {
    const { config: { pages: { REVIEW_ORDER } } } = this.context;

    this.redirectTo(REVIEW_ORDER);
  };

  render() {
    const {
      isApplyButtonVisible,
      toggleModal,
      onToggleDateTimeModal,
      onToggleNextDateModal,
      isNotStoreOrCvsDelvType,
    } = this.props;

    return (
      <GiftingWithTimeframe
        {...{ isApplyButtonVisible, onToggleDateTimeModal, toggleModal, onToggleNextDateModal }}
        saveAndgoToReviewOrder={this.saveAndgoToReviewOrder}
        showPayment={this.showPayment}
        timeFrameVisible={isNotStoreOrCvsDelvType}
      />
    );
  }
}
