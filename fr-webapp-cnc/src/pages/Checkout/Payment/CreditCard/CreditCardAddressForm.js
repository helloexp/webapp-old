import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import constants from 'config/site/default';
import If from 'components/uniqlo-ui/If';
import AddressForm from 'containers/AddressForm';
import { setBillingAddress as setBillingAddressAction } from 'redux/modules/checkout/payment/actions';
import { getCurrentBillingAddress } from './utils';
import styles from './styles.scss';

const { gyroTags } = constants;
const { string, object, func, bool } = PropTypes;

@connect(state => ({
  currentBillingAddress: getCurrentBillingAddress(state),
}), {
  setBillingAddress: setBillingAddressAction,
})

export default class CreditCardAddressForm extends PureComponent {
  static propTypes = {
    buttonDisable: bool,
    isConfirmDisabled: bool,
    setBillingAddress: func,
    updateButtonState: func,
    validateAddressForm: func,
    currentBillingAddress: object,
    error: string,
  };

  static contextTypes = {
    i18n: object,
    getErrorMessages: func,
    validateForm: func,
  };

  setBillingAddress = (name, value) => {
    this.props.setBillingAddress(name, value);
    this.props.updateButtonState(this.context.validateForm());
  }

  render() {
    const props = this.props;
    const { payment } = this.context.i18n;

    return (
      <div>
        <h3 className={styles.billingTitle}>{ payment.billingAddress }</h3>
        <If if={props.error}>
          {props.error}
        </If>
        <AddressForm
          additionalFields
          gyroTagValue={gyroTags.PAYMENT}
          isDeliveryAddressForm
          setShippingAddress={this.setBillingAddress}
          validateAddressForm={this.props.validateAddressForm}
          {...props.currentBillingAddress}
        />
      </div>
    );
  }
}
