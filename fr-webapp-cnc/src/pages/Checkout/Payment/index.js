import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import Button from 'components/Atoms/Button';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import * as authActions from 'redux/modules/account/auth';
import * as creditCardActions from 'redux/modules/checkout/payment/creditCard/actions';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import * as deliveryStoreActions from 'redux/modules/checkout/delivery/store/actions';
import * as giftActions from 'redux/modules/checkout/gifting/actions';
import * as giftCardActions from 'redux/modules/checkout/payment/giftCard/actions';
import * as paymentActions from 'redux/modules/checkout/payment/actions';
import * as paymentStoreActions from 'redux/modules/checkout/payment/store';
import * as accountSelectors from 'redux/modules/account/selectors';
import { isSplitDeliverySelected, getDelivery, getDeliveryMethodType } from 'redux/modules/checkout/delivery/selectors';
import { getAddedCouponOfCurrentBrand } from 'redux/modules/membership/selectors';
import { isCreditCardUnsaved as isCreditCardUnsavedSelector } from 'redux/modules/checkout/payment/selectors';
import { getBrand } from 'redux/modules/cart/selectors';
import { addAndLoadUserAddresses } from 'redux/modules/account/userInfo';
import { popAPIErrorMessage } from 'redux/modules/errorHandler';
import ErrorHandler from 'containers/ErrorHandler';
import { trackCheckoutNavigation } from 'utils/gtm';
import { redirect, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { required } from 'utils/validation';
import { initializePaymentPage } from 'redux/modules/checkout/payment/initialize';
import constants from 'config/site/default';
import CouponPanel from 'components/CouponPanel';
import AddressPanel from 'components/AddressPanel';
import GiftPanel from 'pages/Checkout/Gifting/GiftPanel';
import ErrorMessage from 'components/ErrorMessage';
import MessageBox from 'components/MessageBox';
import ShippingTimeFrame from 'pages/Checkout/components/ShippingTimeFrame';
import DeliveryPreferencePanel from 'pages/Checkout/components/DeliveryPreferencePanel';
import { getDeliveryMethodInfo } from 'utils/deliveryUtils';
import { scrollElmIntoView, scrollToTop } from 'utils/scroll';
import classNames from 'classnames';
import PaymentMethods from './PaymentMethods';
import styles from './styles.scss';

const { string, object, func, bool } = PropTypes;

function multilineMessage(messageSegments) {
  return (messageSegments.map((text, index) => <div key={index}>{text}</div>));
}

@asyncConnect([{
  promise: ({ store: { dispatch }, params }) => dispatch(initializePaymentPage(params)),
}])
@connect((state, props) => ({
  ...state.cart,
  ...state.payment,
  ...state.gifting,
  giftCardPayment: state.giftCard,
  delivery: getDelivery(state),
  user: accountSelectors.getUser(state),
  cartCoupon: getAddedCouponOfCurrentBrand(state, props),
  isCreditCardUnsaved: isCreditCardUnsavedSelector(state, props),
  brand: getBrand(state, props),
  deliveryType: getDeliveryMethodType(state),
  isSplitDeliveryApplied: isSplitDeliverySelected(state),
}), {
  ...paymentActions,
  ...creditCardActions,
  ...authActions,
  toggleDeliveryEdit: deliveryActions.toggleDeliveryEdit,
  removePreviousLocation: deliveryActions.removePreviousLocation,
  loadDeliveryMethodOptions: deliveryActions.loadDeliveryMethodOptions,
  editDeliveryMethod: deliveryActions.editDeliveryMethod,
  ...giftCardActions,
  ...deliveryStoreActions,
  ...paymentStoreActions,
  ...giftActions,
  addAndLoadUserAddresses,
  popAPIErrorMessage,
})
@ErrorHandler([
  'applyGiftCard',
  'blueGateCreditCardError',
  'getPaymentType',
  'loadGiftCards',
  'placeOrder',
  'prepareCreditCard',
  'provisionalInventory',
  'removeGiftCard',
  'setBillingAddress',
  'setPaymentMethod',
  'updateGiftCard',
  'verifyGiftCard',
  'setDeliveryType',
  'coupon',
])
@ErrorHandler(['giftCards'], 'detailedErrors')
export default class Payment extends PureComponent {
  static propTypes = {
    delivery: object,
    editDeliveryMethod: func,
    uniqloStore: object,
    setPaymentMethod: func,
    cartCoupon: object,
    showConfirmationBox: bool,
    isEditCVSAddress: bool,
    isCreditCardUnsaved: bool,
    brand: string,
    toggleDeliveryEdit: func,
    removePreviousLocation: func,
    toggleConfirmationBox: func,
    loadDeliveryMethodOptions: func,
    error: string,
    detailedErrors: object,
    popAPIErrorMessage: func,
    isSplitDeliveryApplied: bool,

    // from state.payment
    payAtUQStoreChangeConfirm: bool,

    // from payment actions
    togglePayAtUQStoreConfirmation: func,
    setLocalPaymentMethod: func,
    isConfirmPostPay: bool,
    togglePostPayConfirmation: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  componentWillMount() {
    const { config: { pages: { PAYMENT } } } = this.context;

    this.couponsUrl = getUrlWithQueryData(routes.coupons, { from: PAYMENT, brand: this.props.brand });
  }

  componentDidMount() {
    const { brand, error, detailedErrors } = this.props;

    trackCheckoutNavigation(brand);

    if (error && !(detailedErrors.giftCards && Object.keys(detailedErrors.giftCards).length)) {
      scrollToTop(document.body, 0, 0);
    } else {
      scrollElmIntoView(this.paymentHead);
    }
  }

  getRef = (node) => { this.paymentHead = node; };

  isValidDelivery() {
    const { delivery } = this.props;
    const { deliveryMethod, deliveryPreference, deliveryMethodList } = delivery;
    let isDeliveryValid = false;

    for (let split = 1; split <= deliveryMethod.length; split++) {
      const eligibleMethods = deliveryMethodList[split]
        && deliveryMethodList[split][deliveryPreference]
        && deliveryMethodList[split][deliveryPreference].deliveryTypes;
      const currentShipment = deliveryMethod
        && deliveryMethod.find(shipment => shipment.splitNo === String(split));
      const appliedType = currentShipment && currentShipment.deliveryType;

      isDeliveryValid = required(eligibleMethods) || required(appliedType) || !eligibleMethods.includes(appliedType);
    }

    return isDeliveryValid;
  }

  redirectToDelivery() {
    const {
      loadDeliveryMethodOptions,
      removePreviousLocation,
      brand,
    } = this.props;

    removePreviousLocation();
    loadDeliveryMethodOptions()
      .then(() => redirect(getUrlWithQueryData(routes.delivery, { brand })));
  }

  handleEditNavigation = (result) => {
    const {
      editDeliveryMethod,
      toggleConfirmationBox,
      toggleDeliveryEdit,
      isEditCVSAddress,
    } = this.props;

    toggleConfirmationBox('hide');

    if (result === 'yes') {
      if (isEditCVSAddress) {
        toggleDeliveryEdit();
        this.redirectToDelivery();
      } else {
        editDeliveryMethod(true);
      }
    }
  };

  handleEditClick = isEditCVSAddress => () => this.props.toggleConfirmationBox('show', isEditCVSAddress);

  payAtUQStoreDismiss = (result) => {
    const { config: { payment: method } } = this.context;
    const { togglePayAtUQStoreConfirmation, setLocalPaymentMethod } = this.props;

    if (result === 'yes') {
      // if the user confirmed the switch to pay at store option, reflect that in state.
      setLocalPaymentMethod(method.uniqloStore);
    }

    // have to close the confirmation popup irrespective of user's choice.
    togglePayAtUQStoreConfirmation(false);
  };

  hidePostPayMsgBox= (result) => {
    const { config: { payment: method } } = this.context;
    const { togglePostPayConfirmation, setLocalPaymentMethod } = this.props;

    if (result === 'yes') {
      // if the user confirmed the switch to pay at store option, reflect that in state.
      setLocalPaymentMethod(method.postPay);
    }

    // have to close the confirmation popup irrespective of user's choice.
    togglePostPayConfirmation(false);
  };

  render() {
    const { props, context } = this;
    const { i18n: { heading, common, checkout, reviewOrder } } = context;
    const {
      deliveryType,
      cartCoupon,
      error,
      showConfirmationBox,
      isCreditCardUnsaved,
      isEditCVSAddress,
      isSplitDeliveryApplied,
      delivery: {
        currentShippingAddress,
      },
      payAtUQStoreChangeConfirm,
      brand,
      isConfirmPostPay,
    } = props;

    const { LAWSON, SEJ, FM } = constants.deliveryTypes;
    const editConfirmMessage = [LAWSON, SEJ, FM].includes(deliveryType) && isEditCVSAddress && isCreditCardUnsaved
      ? reviewOrder.editWithCreditCard
      : reviewOrder.editDelivery;
    const isDeliveryValid = this.isValidDelivery();
    const deliveryDetails = getDeliveryMethodInfo(deliveryType, checkout, brand);

    return (
      <Container className={styles.paymentContainer}>
        <Helmet title={heading.deliveryMethod} />
        <If
          if={error}
          then={ErrorMessage}
          isCustomError
          message={error}
          rootClassName="paymentPageError"
        />
        <div className={styles.headingContainer}>
          <span className={classNames(styles.icon, isDeliveryValid ? styles.warning : styles.tick)} />
          <Heading
            className={styles.methodSelectorHead}
            headingText={heading.deliveryMethod}
            type="h3"
          />
          <Button
            type={Button.type.edit}
            onClick={this.handleEditClick(false)}
            className={styles.deliveryEdit}
          >{common.editLabel}</Button>
        </div>
        <If
          if={currentShippingAddress}
          then={AddressPanel}
          editable
          frame
          lighterBoxShadow
          fromCheckout
          onEdit={this.handleEditClick(true)}
          title={deliveryDetails.title}
          variation={deliveryDetails.variation}
          {...currentShippingAddress}
        />
        <If if={isSplitDeliveryApplied} then={DeliveryPreferencePanel} />
        <If
          if={currentShippingAddress}
          then={ShippingTimeFrame}
          fromCheckout
          lighterBoxShadow
        />
        <If
          if={currentShippingAddress && !isSplitDeliveryApplied}
          then={GiftPanel}
          className={styles.giftPanel}
          editDelivery
          messageVisible
          frame
          lighterBoxShadow
        />
        <span ref={this.getRef} />
        <Heading
          className={styles.sectionTitle}
          headingText={heading.paymentMethod}
          type="h4"
        />
        <PaymentMethods />
        <If
          if={!isSplitDeliveryApplied}
          then={CouponPanel}
          couponName={cartCoupon.title}
          to={this.couponsUrl}
          variation="checkout"
        />
        <If
          if={showConfirmationBox}
          then={MessageBox}
          confirmLabel={common.changeText}
          message={editConfirmMessage}
          onAction={this.handleEditNavigation}
          rejectLabel={common.cancelText}
          stickyBox
          variation="confirm"
        />
        <If
          if={payAtUQStoreChangeConfirm}
          then={MessageBox}
          confirmLabel={common.confirmLabel}
          message={multilineMessage(checkout.payAtUQStoreConfirmationMessage)}
          onAction={this.payAtUQStoreDismiss}
          rejectLabel={common.cancelText}
          stickyBox
          variation="confirm"
        />
        <If
          if={isConfirmPostPay}
          then={MessageBox}
          confirmLabel={common.confirmLabel}
          message={multilineMessage(checkout.postPayWarning)}
          onAction={this.hidePostPayMsgBox}
          rejectLabel={common.cancelText}
          stickyBox
          variation="confirm"
        />
      </Container>
    );
  }
}
