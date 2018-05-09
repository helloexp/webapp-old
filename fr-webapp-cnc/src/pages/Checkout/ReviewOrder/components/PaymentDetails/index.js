import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { root, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import SimpleTile from 'pages/Checkout/components/PaymentMethodTile/SimpleTile';
import CreditCardTile from 'pages/Checkout/components/PaymentMethodTile/CreditCardTile';
import GiftCardTile from 'pages/Checkout/components/PaymentMethodTile/GiftCardTile';
import StorePayment from 'pages/Checkout/components/PaymentMethodTile/StorePayment';
import { setCreditCard } from 'redux/modules/checkout/payment/creditCard/actions';
import { getIfPayAtStoreSelected, getSelectedCreditCard, isSelectedCreditCardApplied, isTotalUpdated as isTotalUpdatedSelector } from '../../utils';
import styles from '../../styles.scss';

const { array, bool, string, func, object } = PropTypes;

@connect(
  (state, props) => ({
    isPayAtStore: getIfPayAtStoreSelected(state, props),
    isTotalUpdated: isTotalUpdatedSelector(state),
    isApplied: isSelectedCreditCardApplied(state, props),
    selectedCard: getSelectedCreditCard(state, props),
  }), {
    setCreditCard,
  })
class PaymentDetails extends Component {
  static propTypes = {
    appliedStore: object,
    brand: string,
    creditCardValid: bool,
    errorMessage: string,
    giftCards: array,
    giftCardFlag: string,
    isApplied: bool,
    isCreditRequired: bool,
    isPayAtStore: bool,
    isPaymentValid: bool,
    isShowInfo: bool,
    isTotalUpdated: bool,
    onEditCvv: func,
    onCvvInfoPress: func,
    payment: object,
    paymentType: string,
    setCreditCard: func,
    selectedCard: object,
    isConcierge: bool,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  static defaultProps = {};

  componentWillMount() {
    this.paymentLink = getUrlWithQueryData(`${root}/${routes.payment}`, { brand: this.props.brand });
  }

  onEditCvv = ({ id, value }) => this.props.setCreditCard(id, value, this.props.selectedCard);

  renderSimpleTile() {
    const {
      context: {
        config: { payment: method },
      },
      props: { paymentType },
    } = this;

    if (paymentType === method.cashOnDelivery || paymentType === method.postPay) {
      return <SimpleTile paymentType={paymentType} paymentLink={this.paymentLink} editable />;
    }

    return null;
  }

  renderCreditCardMethod() {
    const {
      context: {
        config: { payment: method },
        i18n: { reviewOrder },
      },
      props: {
        selectedCard,
        creditCardValid,
        errorMessage,
        isApplied,
        isCreditRequired,
        isShowInfo,
        isTotalUpdated,
        onCvvInfoPress,
        paymentType,
      },
    } = this;
    const message = isTotalUpdated ? reviewOrder.creditCardAmountUpdated : errorMessage;
    const isShowCreditCard = paymentType === method.creditCard && !isCreditRequired;
    const cvv = selectedCard.cvv || selectedCard.cardCvv;

    if (isShowCreditCard) {
      return (
        <CreditCardTile
          creditCard={selectedCard}
          creditCardValid={creditCardValid}
          editCvv={this.onEditCvv}
          cvv={cvv}
          hideBilling
          isApplied={!selectedCard.dbKey}
          isShowCvvToolTip={!isApplied}
          isShowInfo={isShowInfo}
          onCvvInfoPress={onCvvInfoPress}
          paymentLink={this.paymentLink}
          errorMessage={message}
          showErrorMessage={isTotalUpdated}
        />
      );
    }

    return null;
  }

  renderGiftCardMethod() {
    const {
      context: {
        config: { payment: method, gds },
      },
      props: {
        errorMessage,
        giftCards,
        giftCardFlag,
        isPaymentValid,
        paymentType,
      },
    } = this;

    if (paymentType === method.giftCard || giftCardFlag === gds.positive) {
      return (
        <GiftCardTile giftCards={giftCards} paymentLink={this.paymentLink} errorMessage={errorMessage} isPaymentValid={isPaymentValid} />
      );
    }

    return null;
  }

  renderStorePaymentMethod() {
    const {
      props: {
        appliedStore,
        isPayAtStore,
        brand,
        isConcierge,
      },
    } = this;

    if (isPayAtStore) {
      return (
        <StorePayment paymentLink={this.paymentLink} store={appliedStore} brand={brand} isConcierge={isConcierge} />
      );
    }

    return null;
  }

  render() {
    const simpleTile = this.renderSimpleTile();
    const creditCardMethod = this.renderCreditCardMethod();
    const giftCardMethod = this.renderGiftCardMethod();
    const storePaymentMethod = this.renderStorePaymentMethod();

    let paymentPlaceHolder = simpleTile || creditCardMethod || giftCardMethod || storePaymentMethod;

    paymentPlaceHolder = paymentPlaceHolder ? '' : <SimpleTile editable paymentLink={this.paymentLink} />;

    return (
      <div className={styles.paymentDetailWrap}>
        {paymentPlaceHolder}
        {giftCardMethod}
        {creditCardMethod}
        {simpleTile}
        {storePaymentMethod}
      </div>
    );
  }
}

export default PaymentDetails;
