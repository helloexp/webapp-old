import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import BoxSelector from 'components/BoxSelector';
import MessageBox from 'components/MessageBox';
import If from 'components/uniqlo-ui/If';
import {
  isGiftCardPaymentSelected as isGiftCardPaymentSelectedSelector,
  getGiftCardIndex as getGiftCardIndexSelector,
  isGiftCardPendingAmountSelected,
  isGiftCardUpdateRequired,
} from 'redux/modules/checkout/payment/giftCard/selectors';
import { removeGiftCard, reloadGirtCards, setBalancePaymentMethod, setEditIndex } from 'redux/modules/checkout/payment/giftCard/actions';
import { setLocalPaymentMethod, resetDummyValuesInBillingAddress } from 'redux/modules/checkout/payment/actions';
import { getCurrentBillingAddress } from 'redux/modules/checkout/payment/selectors';
import { getBrand } from 'redux/modules/cart/selectors';
import formValidator from 'components/FormValidator';
import ErrorMessage from 'components/ErrorMessage';
import ErrorHandler from 'containers/ErrorHandler';
import GiftCardContainer from './GiftCardContainer';
import styles from './styles.scss';

const { bool, object, func, number, string } = PropTypes;

@connect(
  (state, props) => ({
    isSelected: isGiftCardPaymentSelectedSelector(state, props),
    isPaymentGiftCardUpdatedRequired: isGiftCardUpdateRequired(state, props),
    isPendingAmount: isGiftCardPendingAmountSelected(state, props),
    giftCardIndex: getGiftCardIndexSelector(state, props),
    brand: getBrand(state),
    currentBillingAddress: getCurrentBillingAddress(state, props),
  }), {
    removeGiftCard,
    reloadGirtCards,
    setBalancePaymentMethod,
    setLocalPaymentMethod,
    setEditIndex,
    resetDummyValuesInBillingAddress,
  })
@ErrorHandler(['giftCards'], 'detailedErrors')
@formValidator
export default class GiftCard extends PureComponent {
  static propTypes = {
    // From selectors
    brand: string,
    isSelected: bool,
    isPaymentGiftCardUpdatedRequired: bool,
    isPendingAmount: bool,
    giftCardIndex: number,
    currentBillingAddress: object,

    // for error handling
    detailedErrors: object,

    // actions
    removeGiftCard: func,
    reloadGirtCards: func,
    setBalancePaymentMethod: func,
    setEditIndex: func,
    setLocalPaymentMethod: func,
    resetDummyValuesInBillingAddress: func,

    // From parent component
    giftCard: object,
  };

  static contextTypes = {
    i18n: object,
    router: object,
    config: object,
    validateForm: func,
  };

  state = {
    deleteConfirm: false,
  };

  componentWillMount() {
    const { giftCard, isPendingAmount } = this.props;

    if (isPendingAmount) {
      this.props.setEditIndex(giftCard.index);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props.resetDummyValuesInBillingAddress(nextProps.isSelected, nextProps.currentBillingAddress, this.props.isSelected);
  }

  getErrorMessage() {
    const { i18n: { reviewOrder } } = this.context;
    const {
      giftCard,
      isPaymentGiftCardUpdatedRequired,
      detailedErrors: { giftCards: giftCardErrs = {} },
    } = this.props;

    if (giftCard && isPaymentGiftCardUpdatedRequired) {
      return reviewOrder.pleaseChangeThePayment;
    }

    if (giftCardErrs.settlementFeeError) {
      return giftCardErrs.settlementFeeError;
    }

    return giftCard && giftCardErrs[giftCard.requestNumber];
  }

  showConfirm = (cardIndex) => {
    this.setState({ deleteConfirm: true, deleteCardIndex: cardIndex });
  };

  handleDelete = (result) => {
    if (result === 'yes') {
      const { giftCard } = this.props;

      this.props.removeGiftCard(giftCard.requestNumber, giftCard.index)
        .then(() => this.props.reloadGirtCards());
    }
    this.setState({ deleteConfirm: false });
  };

  render() {
    const { i18n: { payment, payWithGiftCard }, config: { payment: method } } = this.context;
    const {
      giftCard,
      isSelected,
      giftCardIndex,
    } = this.props;

    const errorMessage = this.getErrorMessage();

    return (
      <BoxSelector
        boxType="paymentTile"
        changeByProps
        checked={isSelected}
        className="payment"
        id={`gc${giftCardIndex}`}
        label={payment.payGiftcard}
        showLockToolTip
        labelStyle={styles.paymentTitle}
        name="method"
        onChange={this.props.setLocalPaymentMethod}
        shadow
        value={method.giftCard}
        variation="checkbox"
        disableCheck={!!giftCard}
        analyticsOn="Payment Checkbox Toggle"
        analyticsLabel={isSelected ? 'Gift Card out' : 'Gift Card on'}
        analyticsCategory="Checkout Funnel"
      >
        <If
          if={!!errorMessage}
          then={ErrorMessage}
          message={errorMessage}
          rootClassName="giftCardError"
        />
        <GiftCardContainer
          giftCard={giftCard}
          onRemove={this.showConfirm}
        />
        <If
          if={this.state.deleteConfirm}
          then={MessageBox}
          confirmLabel={payWithGiftCard.deleteGiftCardOk}
          message={payWithGiftCard.deleteGiftCardConfirm}
          onAction={this.handleDelete}
          rejectLabel={payWithGiftCard.deleteGiftCardCancel}
          stickyBox
          title=""
          variation="confirm"
        />
      </BoxSelector>
    );
  }
}
