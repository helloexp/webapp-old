import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import If from 'components/uniqlo-ui/If';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import RadioSelector from 'components/Selector';
import {
  getActiveCard as getActiveCardSelector,
  getBalanceDue as getBalanceDueSelector,
  isValidGiftCardAmount as isValidGiftCardAmountSelector,
} from 'redux/modules/checkout/payment/giftCard/selectors';
import {
  applyGiftCard as applyGiftCardAction,
  setFullPayment as setFullPaymentAction,
} from 'redux/modules/checkout/payment/giftCard/actions';
import { formatCardNumber, toHalfWidth, isThisNumberWithSpace, removeCommasFrom } from 'utils/format';
import AmountInput from './AmountInput';
import styles from '../styles.scss';

const { bool, object, func, number } = PropTypes;

@connect(
  (state, props) => ({
    activeGiftCard: getActiveCardSelector(state),
    balanceDue: getBalanceDueSelector(state, props),
    isValidGiftCardAmount: isValidGiftCardAmountSelector(state, props),
  }), {
    applyGiftCard: applyGiftCardAction,
    setFullPayment: setFullPaymentAction,
  })
export default class PaymentOptions extends PureComponent {
  static propTypes = {
    // From selectors
    balanceDue: number,
    activeGiftCard: object,
    isValidGiftCardAmount: bool,

    // Actions from connect
    applyGiftCard: func,
    setFullPayment: func,

    // From parent component
    giftCard: object,
    onChangeHandler: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  componentWillMount() {
    const { activeGiftCard: { payment, fullPayment } } = this.props;
    const { config: { payment: paymentConfig } } = this.context;
    const isPartial = fullPayment === paymentConfig.partialPayment;

    if (!isPartial && !!payment) {
      this.setValue(paymentConfig.fullPayment);
    }
  }

  onApplyGiftCard = () => {
    const { applyGiftCard, activeGiftCard } = this.props;

    applyGiftCard(activeGiftCard);
  };

  setValue = (value) => {
    const { setFullPayment } = this.props;
    const { config: { payment: paymentConfig } } = this.context;

    this.inputDefault = value === paymentConfig.partialPayment;
    if (setFullPayment) {
      setFullPayment(value);
    }
  };

  handleChange = (event) => {
    const value = event.target.value;
    const halfWidth = toHalfWidth(value);
    const newValue = formatCardNumber(halfWidth);

    this.showCharError = removeCommasFrom(newValue).length !== removeCommasFrom(value).slice(1).length && !isThisNumberWithSpace(value.slice(1));
    this.inputDefault = false;
    this.props.onChangeHandler(event.target.id, newValue);
  };

  showCharError = false;

  render() {
    const { activeGiftCard: { payment, fullPayment }, isValidGiftCardAmount } = this.props;
    const { i18n: { payWithGiftCard, payment: { required } }, config: { payment: paymentConfig } } = this.context;
    const isPartial = fullPayment === paymentConfig.partialPayment;
    const partialInputValue = this.inputDefault ? '' : payment;

    return (
      <div className={styles.giftCardFormRadio}>
        <Text className={styles.title}>{payWithGiftCard.howToUse}</Text>
        <RadioSelector
          checked={!isPartial && !!payment}
          label={payWithGiftCard.fullPaymentTxt}
          labelStyle={styles.radio}
          name="paymentOptionGroup"
          onChange={this.setValue}
          value={paymentConfig.fullPayment}
        />
        <RadioSelector
          checked={isPartial}
          label={payWithGiftCard.balancePaymentTxt}
          labelStyle={styles.radio}
          name="paymentOptionGroup"
          onChange={this.setValue}
          value={paymentConfig.partialPayment}
        />
        <If
          if={isPartial}
          then={AmountInput}
          isValidAmount={isValidGiftCardAmount}
          onChange={this.handleChange}
          value={`${partialInputValue}`}
          showCharError={this.showCharError}
          required={required}
        />
        <Button
          className="secondary medium applyButton"
          disabled={!isValidGiftCardAmount || !payment || this.inputDefault}
          label={payWithGiftCard.applyGiftCard}
          onTouchTap={this.onApplyGiftCard}
          preventMultipleClicks
        />
      </div>
    );
  }
}
