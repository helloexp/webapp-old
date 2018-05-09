import React, { PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import Heading from 'components/uniqlo-ui/Heading';
import AddressPanel from 'components/AddressPanel';
import CreditCardPanel from '../CreditCardPanel';
import styles from './styles.scss';

const { object, string, func } = PropTypes;

function getAddressPanel(payment, billingAddress) {
  return (
    <div className={styles.addressContainer}>
      <Heading className="subHeader" headingText={payment.billingAddress} type="h5" />
      <AddressPanel fromCardRegistration {...billingAddress} city={billingAddress.street} street={billingAddress.streetNumber} />
    </div>
  );
}

const RegistrationConfirm = (props, context) => {
  const { creditCard, payment } = context.i18n;
  const { billingAddress, creditCardInfo, onCancel, onConfirm, requiredDefaultAddressField } = props;
  const addressPanel = !requiredDefaultAddressField
    ? getAddressPanel(payment, billingAddress)
    : null;

  return (
    <div className={styles.registrationConfirmation}>
      <CreditCardPanel
        className={styles.registrationPanel}
        creditInfo={creditCardInfo}
        showCvv
      />
      {addressPanel}
      <Button
        className={`secondary medium bold ${styles.registerNewCard}`}
        label={creditCard.proceedToRegistration}
        onTouchTap={onConfirm}
        analyticsOn="Click"
        analyticsLabel="Registration"
        analyticsCategory="Member Info"
      />
      <Button
        className={'default medium boldWithBorder'}
        label={creditCard.backToRegistration}
        onTouchTap={onCancel}
        analyticsOn="Click"
        analyticsLabel="Back to form"
        analyticsCategory="Member Info"
      />
    </div>
  );
};

RegistrationConfirm.contextTypes = {
  i18n: object,
};

RegistrationConfirm.propTypes = {
  billingAddress: object,
  creditCardInfo: object,
  onCancel: func,
  onConfirm: func,
  requiredDefaultAddressField: string,
};

export default RegistrationConfirm;
