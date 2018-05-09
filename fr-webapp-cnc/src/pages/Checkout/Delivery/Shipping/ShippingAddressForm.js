import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import AddressForm from 'containers/AddressForm';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import formValidator from 'components/FormValidator';
import TSLToolTip from 'components/TSLToolTip';
import classNames from 'classnames';
import ErrorMessage from 'components/ErrorMessage';
import ValidationMessage from 'components/AddressForm/ValidationMessage';
import If from 'components/uniqlo-ui/If';
import constants from 'config/site/default';
import { setShippingAddress, setAddressToEdit, onSetBillingAddress } from 'redux/modules/checkout/delivery';
import CheckBoxWithToolTip from '../components/CheckBoxWithToolTip';
import styles from './styles.scss';

const { object, func, string } = PropTypes;
const { gyroTags } = constants;

@connect(null, {
  setAddressToEdit,
  setShippingAddress,
  onSetBillingAddress,
})
@formValidator
export default class ShippingAddressForm extends PureComponent {
  static propTypes = {
    setShippingAddress: func,
    onSetBillingAddress: func,
    saveAddressAction: func,
    setAddressToEdit: func,
    shippingAddress: object,
    error: string,
  };

  static contextTypes = {
    i18n: object,
    validateForm: func,
  };

  state = {
    isConfirmDisabled: true,
  }

  componentWillMount() {
    this.props.setAddressToEdit(this.props.shippingAddress);
  }

  onSaveAddress = () => {
    const { saveAddressAction } = this.props;

    if (this.context.validateForm() === true) {
      saveAddressAction();
    }
  };

  setShippingAddress = (name, value) => {
    this.props.setShippingAddress(name, value);
    const isValidForm = this.context.validateForm();

    if (this.state.isConfirmDisabled === isValidForm) {
      this.setState({ isConfirmDisabled: !isValidForm });
    }
  }

  validateAddressForm = (isValid) => {
    this.setState({ isConfirmDisabled: !isValid });
  }

  render() {
    const { i18n: { checkout, common } } = this.context;
    const props = this.props;
    const {
      shippingAddress,
      error,
    } = props;

    return (
      <div className={styles.content}>
        <div className={styles.headIconWrap}>
          <Text className={styles.enterAddress}>
            {checkout.enterAddress}
          </Text>
          <TSLToolTip />
        </div>
        <If
          if={error}
          then={ErrorMessage}
          isCustomError
          message={error}
          rootClassName="addressFormError"
        />
        <AddressForm
          additionalFields
          {...shippingAddress}
          gyroTagValue={gyroTags.DELIVERY}
          isDeliveryAddressForm
          setShippingAddress={this.setShippingAddress}
          validateAddressForm={this.validateAddressForm}
        />
        <Text className={styles.contactYou}>
          { checkout.contactYou }
        </Text>
        <CheckBoxWithToolTip />
        <ValidationMessage />
        <Button
          className={classNames('secondary', 'medium', styles.deliverySubmitBtn)}
          label={common.done}
          disabled={this.state.isConfirmDisabled}
          onTouchTap={this.onSaveAddress}
          preventMultipleClicks
        />
      </div>
    );
  }
}
