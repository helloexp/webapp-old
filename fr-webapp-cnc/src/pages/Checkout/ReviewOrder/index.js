import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import ErrorHandler from 'containers/ErrorHandler';
import { setReceiptStatus } from 'redux/modules/cart';
import { setCheckoutStatus } from 'redux/modules/checkout';
import { setOrderSummary, processOrder, initializeOrderReviewPage } from 'redux/modules/checkout/order';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import {
  setCurrentReviewPayment,
  setDifference,
  isConciergeCheckout as conciergeCheckout,
} from 'redux/modules/checkout/order/actions';
import { setCreditCard, resetCard } from 'redux/modules/checkout/payment/creditCard/actions';
import { isCreditCardUnsaved as isCreditCardUnsavedSelector } from 'redux/modules/checkout/payment/selectors';
import { isSplitDeliverySelected, getDeliveryMethodOfDiv } from 'redux/modules/checkout/delivery/selectors';
import {
  editPaymentSegment,
  setPaymentMethodAndLoad,
  setPaymentMethod,
} from 'redux/modules/checkout/payment/actions';
import { selectGiftBox, selectMessageCard } from 'redux/modules/checkout/gifting/actions';
import { getCart, getBrand } from 'redux/modules/cart/selectors';
import {
  getAddedCouponOfCurrentBrand,
  isCouponApplied as isCouponAppliedSelector,
} from 'redux/modules/membership/selectors';
import classNames from 'classnames';
import Helmet from 'react-helmet';
import Button from 'components/uniqlo-ui/Button';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import CouponPanel from 'components/CouponPanel';
import MessageBox from 'components/MessageBox';
import { routes } from 'utils/urlPatterns';
import { trackCheckoutNavigation } from 'utils/gtm';
import { redirect, getUrlWithQueryData } from 'utils/routing';
import { multilineMessage } from 'utils/format';
import { isShippingDeliveryType, isCVSDeliveryType } from 'utils/deliveryUtils';
import DeliveryDetails from './components/DeliveryDetails';
import PaymentDetails from './components/PaymentDetails';
import OrderSummarySegment from './OrderSummarySegment';
import * as utils from './utils';
import styles from './styles.scss';

const { object, string, array, func, number, bool } = PropTypes;

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => dispatch(initializeOrderReviewPage(dispatch, getState)),
}])
@connect(
  (state, props) => {
    const { giftCard, payment, cart, creditCard, order, paymentStore } = state;
    const brand = getBrand(state, props);
    const brandedCart = getCart(state, props);

    return {
      giftCards: giftCard.giftCards,
      brand,
      payment,
      creditCard,
      // Validation for previous order
      cancelOrder: order.cancelTargetFlag,
      currentReviewPayment: order.currentReviewPayment,
      appliedStore: paymentStore.appliedStore,
      routing: state.routing,
      ...cart,
      ...brandedCart,
      deliveryMethod: getDeliveryMethodOfDiv(state, props),
      selectedCreditCard: utils.getSelectedCreditCard(state),
      receiptRequired: utils.isReceiptRequired(state),
      couponsLink: utils.getCouponsLink(state),
      isCreditRequired: utils.isCreditRequired(state),
      isCreditCardSaved: utils.isCreditCardSaved(state),
      isValidDelivery: utils.isValidDelivery(state),
      isValidPayment: utils.isValidPayment(state),
      addedCoupon: getAddedCouponOfCurrentBrand(state, props),
      isPaymentGiftCardOrCreditCard: utils.isPaymentGiftCardOrCreditCard(state),
      isReceiptVisible: utils.isReceiptVisible(state),
      isCreditCardUnsaved: isCreditCardUnsavedSelector(state),
      isSplitDeliveryApplied: isSplitDeliverySelected(state),
      isConciergeCheckout: conciergeCheckout(state),
      isCouponApplied: isCouponAppliedSelector(state),
    };
  }, {
    ...deliveryActions,
    setOrderSummary,

    selectGiftBox,
    selectMessageCard,
    editPaymentSegment,
    setPaymentMethodAndLoad,
    setPaymentMethod,
    setCurrentReviewPayment,
    setDifference,

    setCreditCard,
    resetCard,

    processOrder,
    setReceiptStatus,
    setCheckoutStatus,

  })
@ErrorHandler([
  'placeOrder',
  'blueGateCreditCardError',
  'setPaymentMethod',
  'provisionalInventory',
])
export default class ReviewOrder extends PureComponent {
  static propTypes = {
    /* Error Handler */
    error: string,

    /* Segment 0: Process Order */
    cancelOrder: string,
    processOrder: func,
    receiptFlag: string,
    billingAddress: object,
    routing: object,
    setReceiptStatus: func,

    /* Segment 1: header bag */
    items: array.isRequired,
    setOrderSummary: func,

    /* Segment 2: Delivery address segment */
    shippingAddress: object,
    toggleDeliveryEdit: func,
    setPreviousLocation: func,
    removePreviousLocation: func,
    loadDeliveryMethodOptions: func,
    previousLocation: string,
    location: object,
    setAddressToEdit: func,
    editDeliveryMethod: func,

    /* Segment 3 gifting*/
    cartGift: object,
    selectGiftBox: func,
    selectMessageCard: func,

    /* Segment 4 Shipping & Time Frame*/
    deliveryMethod: object,
    isSplitDeliveryApplied: bool,
    // shipments: array,
    // deliveryArrivesAt: object,

    /* Segment 5 Payment */
    giftCards: array,
    giftCardFlag: string,
    creditCard: object,
    selectedCreditCard: object,
    brand: string,
    payment: object,
    paymentType: string,
    setCreditCard: func,
    editPaymentSegment: func,
    totalAmount: number,
    appliedStore: object,
    setPaymentMethodAndLoad: func,
    setPaymentMethod: func,
    resetCard: func,
    setDifference: func,
    isCreditCardUnsaved: bool,

    /* Segment 6: Coupon Segment */
    addedCoupon: object,
    isCouponApplied: bool,

    /* Segment 7: Order Summary Segment */
    orderSummary: object,

    receiptRequired: bool,
    couponsLink: string,
    isCreditRequired: bool,
    isCreditCardSaved: bool,
    isValidDelivery: bool,
    isValidPayment: bool,
    isPaymentGiftCardOrCreditCard: bool,
    isReceiptVisible: bool,
    currentReviewPayment: string,
    setCurrentReviewPayment: func,
    setCheckoutStatus: func,
    reloadDeliveryMethodOptions: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    toolTip: false,
    disablePlaceOrder: false,
    isShowCvvToolTip: false,
    creditCardValid: true,
    isValidDelivery: false,
    isValidPayment: false,
    isApplied: false,
    editDeliveryPayment: false,
    isDeliveryMethodEdit: false,
    isEditAddress: false,
    showMessage: false,
    message: '',
    paymentError: false,
    paymentTypeSet: true,
    isShowInfo: false,
    receiptWarning: null,
  };

  componentWillMount() {
    const props = this.props;
    const { receiptFlag, currentReviewPayment, paymentType } = props;
    let receiptWarning = null;

    if (props.cancelOrder === '1') {
      /* TODO: redirect the user to cancel order page */
      redirect();

      return;
    }

    const { i18n: { reviewOrder }, config: { gds, payment: { uniqloStore, cashOnDelivery, postPay, creditCard } } } = this.context;

    if (receiptFlag === gds.positive && currentReviewPayment && !([uniqloStore, cashOnDelivery].includes(currentReviewPayment))) {
      if (paymentType === uniqloStore) {
        receiptWarning = reviewOrder.payAtStoreReceiptWarning;
      } else if (paymentType === cashOnDelivery) {
        receiptWarning = reviewOrder.codReceiptWarning;
      } else if (paymentType === postPay) {
        receiptWarning = reviewOrder.postPayReceiptWarning;
      }
    }

    this.setState({
      receiptWarning,
      isShowCvvToolTip: props.isCreditCardSaved,
      payAtUQStoreConfirmOpen: false,
    });
    this.payAtUQStoreConfirmNeeded = this.props.paymentType === uniqloStore;
    this.payAtUQStoreConfirmed = false;
    this.onCartUpdate(this.props);
    props.setOrderSummary(props.orderSummary);
    props.setDifference();

    /* Segment 4 Payment */
    if (this.props.paymentType === creditCard) {
      this.validateCredit();
    }
  }

  componentDidMount() {
    const { brand, removePreviousLocation, paymentType } = this.props;

    trackCheckoutNavigation(brand);
    removePreviousLocation();
    this.props.setCurrentReviewPayment(paymentType);
  }

  componentWillReceiveProps(nextProps) {
    const { gds } = this.context.config;
    const { orderSummary = {}, paymentType, giftCardFlag, receiptFlag, error } = nextProps;
    const {
      orderSummary: currentOrderSummary = {},
      paymentType: currentPaymentType,
      giftCardFlag: currentGiftCardFlag,
      receiptFlag: currentReceiptFlag,
    } = this.props;

    const shouldRecheck = orderSummary.giftCardPayment !== currentOrderSummary.giftCardPayment
    || orderSummary.total !== currentOrderSummary.total
    || paymentType !== currentPaymentType
    || giftCardFlag !== currentGiftCardFlag;

    if (shouldRecheck) {
      this.onCartUpdate(nextProps);
    } else if (
      // if there is an error
      error &&
      // and error handler has reset receiptFlag
      receiptFlag !== currentReceiptFlag &&
      currentReceiptFlag === gds.negative &&
      // but "place order" button is still disabled
      this.state.disablePlaceOrder
    ) {
      // enable "place order" button
      this.setState({ disablePlaceOrder: false });
    }
  }

  /**
   * For each update, Verifies the total against gift card total.
   *   - equal: if credit card is applied, remove credit card and updates a message in UI
   *   - inequality: if payment is giftcard, update the UI with error message by disabling order button
   * Trigger: componentWillMount & componentWillReceiveProps
   *
   * @param {Object} props component props
   */
  onCartUpdate = (props) => {
    const { paymentTypeSet } = this.state;
    const { i18n: { reviewOrder }, config: { pages: { DELIVERY }, gds, payment: { creditCard, giftCard } } } = this.context;
    const { orderSummary, paymentType, giftCardFlag } = props;
    const giftCardPayment = orderSummary && orderSummary.giftCardPayment;
    const total = orderSummary && orderSummary.total;

    if (giftCardFlag === gds.positive && giftCardPayment && total) {
      if (giftCardPayment === total && paymentTypeSet && paymentType === creditCard) {
        this.props.setPaymentMethodAndLoad(giftCard);
        this.props.resetCard();
        this.setState({
          showMessage: true,
          message: reviewOrder.creditCardNotApplicable,
          paymentTypeSet: false,
        });
      } else if ((giftCardPayment > total) || (giftCardPayment < total && paymentType !== creditCard)) {
        this.props.setCheckoutStatus(DELIVERY);
        redirect(getUrlWithQueryData(routes.payment, { brand: props.brand }));
      }
    }
  };

  onCvvInfoPress = () => {
    this.setState(state => ({
      isShowInfo: !state.isShowInfo,
    }));
  };

  onDeliveryEdit = () => this.confirmEditDelivery(false);

  resetReceiptWarning = () => this.setState({ receiptWarning: null });

  payAtUQStoreDismiss = (result) => {
    this.setState({ payAtUQStoreConfirmOpen: false });

    if (result === 'yes') {
      this.payAtUQStoreConfirmed = true;
      this.processOrder();
    }
  }

  /* Segment 0: Process Order */
  processOrder = () => {
    const { payAtUQStoreConfirmNeeded, payAtUQStoreConfirmed } = this;

    if (payAtUQStoreConfirmNeeded && !payAtUQStoreConfirmed) {
      this.setState({ payAtUQStoreConfirmOpen: true });

      return;
    }

    const props = this.props;
    const { config: { gds: { negative } } } = this.context;
    const receiptFlag = props.isReceiptVisible && props.receiptFlag || negative;

    this.setState({ disablePlaceOrder: true });
    props.processOrder(receiptFlag)
      .then((shouldRedirect) => {
        if (shouldRedirect) {
          redirect(getUrlWithQueryData(routes.confirmOrder, { brand: props.brand }));
        }
      });
  };

  /* Segment 0: Process Order */
  toggleReceiptFlag = () => {
    const { positive, negative } = this.context.config.gds;
    const { brand } = this.props;

    this.props.setReceiptStatus(brand, this.props.receiptFlag === positive ? negative : positive);
  };

  /* Segment 2: Edit Address */
  editShippingAddress = () => {
    const {
      toggleDeliveryEdit,
      setPreviousLocation,
      loadDeliveryMethodOptions,
      shippingAddress,
      setAddressToEdit,
      deliveryMethod,
      brand,
    } = this.props;

    toggleDeliveryEdit();
    setPreviousLocation();
    if (isShippingDeliveryType(deliveryMethod.deliveryType)) {
      setAddressToEdit(shippingAddress);
    }

    loadDeliveryMethodOptions().then(() => redirect(getUrlWithQueryData(routes.delivery, { brand })));
  };

  confirmEditDelivery = (isEditAddress) => {
    this.setState({
      editDeliveryPayment: true,
      isDeliveryMethodEdit: !isEditAddress,
      isEditAddress,
    });
  };

  /* Segment 5: Payment Segment */
  validateCredit = () => {
    const { cvv } = this.props.creditCard;

    this.setState({
      isApplied: cvv && cvv.length >= 3,
    });
  };

  /* Segment 5: Payment */
  togglePayment = () => this.setState({
    editDeliveryPayment: true,
    isDeliveryMethodEdit: false,
    isEditAddress: false,
  });

  handleEditNavigation = (result) => {
    if (result === 'yes') {
      if (this.state.isDeliveryMethodEdit) {
        if (this.props.isPaymentGiftCardOrCreditCard) {
          this.props.setPreviousLocation();
        }

        this.props.editDeliveryMethod(true);
      } else if (this.state.isEditAddress) {
        this.editShippingAddress();
      } else {
        this.props.reloadDeliveryMethodOptions();
        this.props.editPaymentSegment();
      }
    }

    this.setState({
      editDeliveryPayment: false,
      isDeliveryMethodEdit: false,
      isEditAddress: false,
    });
  };

  editAddressPanel = () => {
    this.confirmEditDelivery(true);
  };

  render() {
    const { context, props, state } = this;
    const {
      i18n: { reviewOrder, common, heading, checkout },
      config: { payment: paymentConfig, creditCard: creditCardConfig },
    } = context;
    const {
      selectedCreditCard,
      paymentType,
      addedCoupon,
      brand,
      orderSummary,
      receiptRequired,
      couponsLink,
      isCreditRequired,
      isValidDelivery,
      isValidPayment,
      error,
      isReceiptVisible,
      isCreditCardUnsaved,
      deliveryMethod,
      isSplitDeliveryApplied,
      cartGift,
      shippingAddress,
      isConciergeCheckout,
      isCouponApplied,
    } = props;

    const {
      creditCardValid,
      disablePlaceOrder,
      editDeliveryPayment,
      paymentError,
      showMessage,
      message,
      isShowInfo,
      receiptWarning,
      isDeliveryMethodEdit,
      isEditAddress,
      payAtUQStoreConfirmOpen,
    } = state;

    const creditCardValidity = paymentType !== paymentConfig.creditCard
      || (selectedCreditCard.cvv && selectedCreditCard.cvv.length)
      || (selectedCreditCard.cardCvv && selectedCreditCard.cardCvv.length);

    const isOrderDisabled = !((isValidDelivery && isValidPayment && !disablePlaceOrder) && creditCardValidity && !paymentError);
    let editConfirmMessage;

    if (isDeliveryMethodEdit) {
      editConfirmMessage = reviewOrder.editDelivery;
    } else if (isEditAddress && isCreditCardUnsaved && isCVSDeliveryType(deliveryMethod.deliveryType)) {
      editConfirmMessage = reviewOrder.editWithCreditCard;
    } else {
      editConfirmMessage = reviewOrder.editMessage;
    }

    // Script to get JSC Data from bluegate
    const scripts = [{
      src: creditCardConfig.jscDataScriptUrl,
      type: 'text/javascript',
    }];

    const errorMessage = showMessage && !error ? message : error;
    const isPaymentValid = !paymentError && isValidPayment;

    return (
      <Container className={styles.reviewOrder}>
        <Helmet
          script={scripts}
          title={reviewOrder.reviewOrder}
        />
        <If
          if={receiptWarning}
          then={MessageBox}
          message={receiptWarning}
          onAction={this.resetReceiptWarning}
          rejectLabel={common.close}
          variation="completed"
        />

        <Container className={styles.reviewOrderContainer}>
          <div className={styles.pageHeadWrap}>
            <Heading className={styles.pageHeading} headingText={reviewOrder.confirmOrder} type="h3" />
            <Text className="blockText">{reviewOrder.reviewOrderText}</Text>
          </div>
          <div className={classNames(styles.headingWrapper, styles.headingWrap)}>
            <span className={classNames(styles.icon, isValidDelivery ? styles.tick : styles.warning)} />
            <Heading className={styles.methodSelectorHead} headingText={heading.deliveryMethod} type="h3" />
            <If
              if={!isConciergeCheckout}
              then={Button}
              className={classNames('editButton', styles.deliveryEdit)}
              noLabelStyles
              label={common.edit}
              onTouchTap={this.onDeliveryEdit}
              labelClass={styles.editLabel}
            />
          </div>

          <DeliveryDetails
            {...{ deliveryMethod, cartGift, shippingAddress, isSplitDeliveryApplied, brand }}
            onEditAddressPanel={this.editAddressPanel}
            onSelectGiftBox={props.selectGiftBox}
            onSelectMessageCard={props.selectMessageCard}
            isConcierge={isConciergeCheckout}
          />

          <div className={classNames(styles.headingWrapper, styles.headingWrap)}>
            <span className={classNames(styles.icon, isPaymentValid ? styles.tick : styles.warning)} />
            <Heading
              className={styles.methodSelectorHead}
              headingText={heading.paymentMethod}
              type="h3"
            />
            <If
              if={!isConciergeCheckout}
              then={Button}
              className={classNames('editButton', styles.deliveryEdit)}
              noLabelStyles
              label={common.edit}
              onTouchTap={this.togglePayment}
              labelClass={styles.editLabel}
            />
          </div>

          <PaymentDetails
            {...props}
            {...{ brand, creditCardValid, errorMessage, isCreditRequired, isShowInfo }}
            onCvvInfoPress={this.onCvvInfoPress}
            isConcierge={isConciergeCheckout}
          />

          <If
            if={!isSplitDeliveryApplied && (isCouponApplied || !isConciergeCheckout)}
            then={CouponPanel}
            couponName={addedCoupon.title}
            to={couponsLink}
            isConcierge={isConciergeCheckout}
            variation="checkout"
          />

          <OrderSummarySegment
            {...{ errorMessage, isOrderDisabled, orderSummary, paymentType, isPaymentValid, receiptRequired, isReceiptVisible }}
            processOrder={this.processOrder}
            toggleReceiptFlag={this.toggleReceiptFlag}
          />
        </Container>

        <If
          if={editDeliveryPayment}
          then={MessageBox}
          confirmLabel={common.changeText}
          message={editConfirmMessage}
          onAction={this.handleEditNavigation}
          rejectLabel={common.cancelText}
          stickyBox
          variation="confirm"
        />
        <If
          if={payAtUQStoreConfirmOpen}
          then={MessageBox}
          confirmLabel={reviewOrder.placeOrder}
          message={multilineMessage(checkout.payAtUQStoreConfirmationMessage)}
          onAction={this.payAtUQStoreDismiss}
          rejectLabel={common.cancelText}
          stickyBox
          variation="confirm"
        />
      </Container>
    );
  }
}
