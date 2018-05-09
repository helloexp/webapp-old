import React, { Component, PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import StoreDetails from 'pages/Checkout/components/StoreDetails';
import classNames from 'classnames';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import AddressForm from 'containers/AddressForm';
import formValidator from 'components/FormValidator';
import ValidationMessage from 'components/AddressForm/ValidationMessage';
import styles from './styles.scss';

const { object, func, string, bool } = PropTypes;

@formValidator
export default class PayInStoreAddress extends Component {
  static propTypes = {
    store: object,
    onChoose: func,
    onRemove: func,
    onSelect: func,
    deliveryLeadDate: string,
    setBillingAddress: func,
    currentBillingAddress: object,
    shouldShowCompleteBillingAddressForm: bool,
    shouldShowNewUserStoresSelectionBillingAddressForm: bool,
  };

  static contextTypes = {
    i18n: object,
    validateForm: func,
  };

  state = {
    isConfirmDisabled: !this.context.validateForm(),
  }

  setBillingAddress = (name, value) => {
    this.props.setBillingAddress(name, value);
    const isValidForm = this.context.validateForm();

    if (this.state.isConfirmDisabled === isValidForm) {
      this.setState({ isConfirmDisabled: !isValidForm });
    }
  }

  validateAddressForm = (isValid) => {
    this.setState({ isConfirmDisabled: !isValid });
  }

  render() {
    const { payment: { confirmPaymentMethod }, payCash } = this.context.i18n;
    const {
      store,
      onChoose,
      onRemove,
      onSelect,
      deliveryLeadDate,
      currentBillingAddress,
      shouldShowCompleteBillingAddressForm,
      shouldShowNewUserStoresSelectionBillingAddressForm,
    } = this.props;

    return (
      <div className="storeDetails">
        <StoreDetails
          currentStore={store}
          deliveryLeadDate={deliveryLeadDate}
          onChoose={onChoose}
          onRemove={onRemove}
        />
        <If
          if={shouldShowCompleteBillingAddressForm || shouldShowNewUserStoresSelectionBillingAddressForm}
          then={Heading}
          className="subHeader"
          headingText={payCash.contactAddress}
          type="h4"
        />
        <If
          if={shouldShowNewUserStoresSelectionBillingAddressForm}
          then={AddressForm}
          validateAddressForm={this.validateAddressForm}
          additionalFields
          newUserStoresSelection
          setShippingAddress={this.setBillingAddress}
          firstName={currentBillingAddress.firstName}
          firstNameKatakana={currentBillingAddress.firstNameKatakana}
          lastName={currentBillingAddress.lastName}
          lastNameKatakana={currentBillingAddress.lastNameKatakana}
          phoneNumber={currentBillingAddress.phoneNumber}
          postalCode={currentBillingAddress.postalCode}
          isDeliveryAddressForm
        />
        <If
          if={shouldShowCompleteBillingAddressForm}
          then={AddressForm}
          validateAddressForm={this.validateAddressForm}
          additionalFields
          setShippingAddress={this.setBillingAddress}
          apt={currentBillingAddress.apt}
          cellPhoneNumber={currentBillingAddress.cellPhoneNumber}
          city={currentBillingAddress.city}
          firstName={currentBillingAddress.firstName}
          firstNameKatakana={currentBillingAddress.firstNameKatakana}
          lastName={currentBillingAddress.lastName}
          lastNameKatakana={currentBillingAddress.lastNameKatakana}
          phoneNumber={currentBillingAddress.phoneNumber}
          postalCode={currentBillingAddress.postalCode}
          prefecture={currentBillingAddress.prefecture}
          street={currentBillingAddress.street}
          streetNumber={currentBillingAddress.streetNumber}
          isDeliveryAddressForm
        />
        <ValidationMessage isConfirmDisabled={this.state.isConfirmDisabled} />
        <Button
          className={classNames('secondary', 'medium', styles.uniqloPaymentBtn, styles.storeSelect)}
          label={confirmPaymentMethod}
          disabled={this.state.isConfirmDisabled}
          labelClass={styles.selectStore}
          onTouchTap={onSelect}
          preventMultipleClicks
        />
      </div>
    );
  }
}
