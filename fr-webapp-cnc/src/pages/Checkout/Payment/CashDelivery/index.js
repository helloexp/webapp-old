import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import BoxSelector from 'components/BoxSelector';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import { setLocalPaymentMethod, confirmCODPayment } from 'redux/modules/checkout/payment/actions';
import cx from 'classnames';
import * as utils from './utils';
import styles from './styles.scss';

const { object, func, bool } = PropTypes;

@connect(state => ({
  isSelected: utils.isSelected(state),
  isEnabled: utils.isEnabled(state),
}), {
  setLocalPaymentMethod,
  confirmCODPayment,
})
export default class CashDelivery extends PureComponent {
  static propTypes = {
    isSelected: bool,
    isEnabled: bool,
    setLocalPaymentMethod: func,
    confirmCODPayment: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  render() {
    const { isSelected, isEnabled } = this.props;
    const {
      i18n: { payCash: { cashDelivery, description }, payment: { confirmPaymentMethod } },
      config: { payment: { cashOnDelivery } },
    } = this.context;

    return (
      <BoxSelector
        boxType="paymentTile"
        changeByProps
        checked={isSelected}
        className="payment"
        enabled={isEnabled}
        id="cod"
        label={cashDelivery}
        labelStyle={styles.paymentTitle}
        name="method"
        onChange={this.props.setLocalPaymentMethod}
        shadow
        value={cashOnDelivery}
        variation="checkbox"
        analyticsOn="Payment Checkbox Toggle"
        analyticsLabel={isSelected ? 'Cash On Delivery out' : 'Cash On Delivery on'}
        analyticsCategory="Checkout Funnel"
      >
        <div className={styles.cashMethodSelector}>
          <Text className={styles.instructions}>{ description }</Text>
          <Button
            className={cx('secondary', 'medium', styles.payCashButton)}
            label={confirmPaymentMethod}
            onTouchTap={this.props.confirmCODPayment}
            preventMultipleClicks
          />
        </div>
      </BoxSelector>
    );
  }
}
