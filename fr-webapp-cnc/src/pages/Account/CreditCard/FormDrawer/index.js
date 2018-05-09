import React, { PropTypes, Component } from 'react';
import Heading from 'components/uniqlo-ui/Heading';
import { isValidCreditCard } from 'utils/validation';
import AddressForm from 'containers/AddressForm';
import CreditCardForm from 'components/CreditCardForm';
import Drawer from 'components/Drawer';
import formValidator from 'components/FormValidator';
import constants from 'config/site/default';
import styles from './styles.scss';

const { gyroTags } = constants;
const { object, string, func } = PropTypes;

function getAddressForm(payment, setBillingAddress, billingAddressValues) {
  return (
    <div className={styles.addressContainer}>
      <Heading className="subHeader noSpacingTop" headingText={payment.billingAddress} type="h5" />
      <AddressForm
        setShippingAddress={setBillingAddress}
        {...billingAddressValues}
        additionalFields
        gyroTagValue={gyroTags.CREDITCARD}
        isBillingAddress
      />
    </div>
  );
}

@formValidator
export default class FormDrawer extends Component {
  static propTypes = {
    billingAddress: object,
    creditCardInfo: object,
    onAccept: func,
    onCancel: func,
    requiredDefaultAddressField: string,
    setBillingAddress: func,
    setCreditCard: func,
    userDefaultDetails: object,
  };

  static contextTypes = {
    i18n: object,
    validateForm: func,
  };

  componentWillMount() {
    this.showDefaultPostal = true;
  }

  onCancel = () => {
    this.showDefaultPostal = true;
    this.props.onCancel();
  };

  onAcceptPress = () => {
    if (this.context.validateForm()) {
      this.props.onAccept();
    }
  };

  render() {
    const { payment, creditCard } = this.context.i18n;
    const {
      requiredDefaultAddressField,
      setBillingAddress,
      billingAddress,
      setCreditCard,
      creditCardInfo,
      userDefaultDetails,
    } = this.props;

    // Set default postal code if there's any selected
    const billingAddressValues = billingAddress;

    if (!billingAddress.postalCode && userDefaultDetails && this.showDefaultPostal) {
      this.showDefaultPostal = false;
      billingAddressValues.postalCode = userDefaultDetails.postalCode;
    }

    const addressForm = !requiredDefaultAddressField
      ? getAddressForm(payment, setBillingAddress, billingAddressValues)
      : null;

    return (
      <Drawer
        acceptLabel={creditCard.accept}
        cancelLabel={creditCard.removeCardCancel}
        className="creditCardForm"
        disabled={!isValidCreditCard(creditCardInfo)}
        onAccept={this.onAcceptPress}
        onCancel={this.onCancel}
        title={creditCard.changeCCInfo}
        variation="fixedFooter"
        acceptBtnProps={{
          analyticsOn: 'Member Info',
          analyticsLabel: 'Confirm',
          analyticsCategory: 'Member Info',
        }}
      >
        <CreditCardForm
          footerMargin
          setCreditCard={setCreditCard}
          {...creditCardInfo}
        />
        { addressForm }
      </Drawer>
    );
  }
}
