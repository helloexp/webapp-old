import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AddressPanel from 'components/AddressPanel';

import { toggleEditAddress as toggleEditAddressAction } from 'redux/modules/checkout/payment/actions';
import { getCurrentBillingAddress as getCurrentBillingAddressSelector } from './utils';
import styles from './styles.scss';

const { object, func } = PropTypes;

const CreditCardAddressPanel = ({ toggleEditAddress, currentBillingAddress }, context) => (
    <AddressPanel
      fromCardRegistration
      editable
      title={context.i18n.payment.billingAddress}
      {...currentBillingAddress}
      onEdit={toggleEditAddress}
      addressContainerStyle={styles.addressText}
      headerStyle={styles.addressHeader}
    />
  );

CreditCardAddressPanel.propTypes = {
  toggleEditAddress: func,
  currentBillingAddress: object,
};

CreditCardAddressPanel.contextTypes = {
  i18n: object,
};

export default connect(state => ({
  currentBillingAddress: getCurrentBillingAddressSelector(state),
}), {
  toggleEditAddress: toggleEditAddressAction,
})(CreditCardAddressPanel);
