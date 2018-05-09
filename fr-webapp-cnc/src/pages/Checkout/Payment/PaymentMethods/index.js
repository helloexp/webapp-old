import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isSplitDeliverySelected } from 'redux/modules/checkout/delivery/selectors';
import { getAvailablePaymentMethods, isGiftCardFullPayment } from 'redux/modules/checkout/payment/selectors';
import { setLocalPaymentMethod } from 'redux/modules/checkout/payment/actions';
import constants from 'config/site/default';
import StorePayment from '../StorePayment';
import CashDelivery from '../CashDelivery';
import CreditCard from '../CreditCard';
import GiftCard from '../GiftCard';
import PostPay from '../PostPay';
import styles from './styles.scss';

const { payment: method } = constants;
const { arrayOf, bool, func, object } = PropTypes;
const PaymentComponents = {
  [method.creditCard]: CreditCard,
  [method.giftCard]: GiftCard,
  [method.cashOnDelivery]: CashDelivery,
  [method.uniqloStore]: StorePayment,
  [method.postPay]: PostPay,
};

@connect((state, props) => ({
  paymentMethods: getAvailablePaymentMethods(state, props),
  isGiftCardExceeding: isGiftCardFullPayment(state, props),
  isSplitDeliveryApplied: isSplitDeliverySelected(state),
}), {
  setLocalPaymentMethod,
})
export default class PaymentMethods extends PureComponent {
  static propTypes = {
    isGiftCardExceeding: bool,
    paymentMethods: arrayOf(object),
    setLocalPaymentMethod: func,
    isSplitDeliveryApplied: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  componentWillMount() {
    if (this.props.isGiftCardExceeding) {
      this.props.setLocalPaymentMethod(' ');
    }
  }

  getMethodComponent = (cmp) => {
    const MethodComponent = PaymentComponents[cmp.method];

    return MethodComponent && <MethodComponent {...cmp} />;
  };

  render() {
    const { payment } = this.context.i18n;
    const { isSplitDeliveryApplied, paymentMethods } = this.props;
    const components = paymentMethods.map(this.getMethodComponent);

    return (
      <div className={classNames({ [styles.paymentMethodsWrap]: isSplitDeliveryApplied })}>
        <p className={styles.title}>{payment.selectPayment}</p>
        {components}
      </div>
    );
  }
}
