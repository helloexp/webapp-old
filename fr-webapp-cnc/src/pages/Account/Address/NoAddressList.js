import React, { PropTypes } from 'react';
import AddressForm from 'containers/AddressForm';
import Button from 'components/uniqlo-ui/Button';
import CheckBox from 'components/uniqlo-ui/core/CheckBox';
import Text from 'components/uniqlo-ui/Text';
import TSLToolTip from 'components/TSLToolTip';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import constants from 'config/site/default';
import Confirmation from './Confirmation';
import styles from './noAddressList.scss';

const { gyroTags } = constants;

function confirmationView(address, confirmAddress, backToNewAddressEntry) {
  return (
    <Confirmation
      addressData={address}
      backToEntry={backToNewAddressEntry}
      confirmAddress={confirmAddress}
    />
  );
}

function addressFormView(
  addressToPopulate,
  setNewAddress,
  account,
  regAddress,
  defaultAddress,
  onSetBillingAddress,
  shouldSetBillingAddress,
  checkout
) {
  const checkBoxOption = !(defaultAddress && defaultAddress.firstName) || !defaultAddress
    ? (<CheckBox
      checked={shouldSetBillingAddress}
      className="spaCheckBox"
      labelClass={styles.checkBoxLabel}
      id="billing"
      label={checkout.useMemberInfo}
      onCheck={onSetBillingAddress}
    />)
    : null;

  return (
    <div>
      <AddressForm
        {...addressToPopulate}
        additionalFields
        fromAddressBook
        gyroTagValue={gyroTags.ADDRESSBOOK}
        setNewAddress={setNewAddress}
      />
      {checkBoxOption}
      <Button
        className="secondary medium"
        label={account.toConfirmationScreen}
        onTouchTap={regAddress}
      />
    </div>
  );
}

const NoAddressList = (props, context) => {
  const { account, checkout, membership } = context.i18n;
  const {
    backToInfo,
    onAddNewAddress,
    isNewRegConfirmationVisible,
    isAddressFormView,
    address,
    setNewAddress,
    headingText,
    confirmAddress,
    backToNewAddressEntry,
    addressToPopulate,
    defaultAddress,
    onSetBillingAddress,
    shouldSetBillingAddress,
    regAddress,
  } = props;

  let displayView = null;
  let displayViewClass = null;
  let goToInfoButton = null;

  const emptyAddressListView = () => (
    <Container className={styles.emptyAddressListView}>
      <Text className={`blockText ${styles.details}`}>{account.noAddressText}</Text>
      <Button
        className={`secondary medium ${styles.subButton}`}
        label={account.registerNewAddress}
        labelClass={styles.buttonLabel}
        onTouchTap={onAddNewAddress}
      />
      <Text className={`blockText ${styles.details}`}>{account.noAddressDescription}</Text>
    </Container>
  );

  if (isNewRegConfirmationVisible) {
    displayView = confirmationView(address, confirmAddress, backToNewAddressEntry);
    displayViewClass = styles.newAddressFormWrapper;
  } else if (isAddressFormView) {
    displayView = addressFormView(addressToPopulate, setNewAddress, account, regAddress, defaultAddress,
      onSetBillingAddress, shouldSetBillingAddress, checkout);
    displayViewClass = styles.newAddressFormWrapper;
  } else {
    displayView = emptyAddressListView();
    goToInfoButton =
      (<Button
        className="default medium boldWithBorder"
        label={membership.backToMemberShip}
        onTouchTap={backToInfo}
      />)
    ;
  }

  return (
    <Container className={styles.noAddressList} >
      <Container className={`z6 ${styles.addressListHead}`}>
      <Heading className={`mainHeaderHrule ${styles.noAddressHeading}`} headingText={headingText} type="h2" />
        {
          isAddressFormView
            ? <TSLToolTip />
            : null
        }
        </Container>
      <Container className={displayViewClass}>
        {displayView}
      </Container>
      {goToInfoButton}
    </Container>
  );
};

const { func, object, string, bool } = PropTypes;

NoAddressList.propTypes = {
  backToInfo: func,
  onAddNewAddress: func,
  address: object,
  setNewAddress: func,
  regNewAddress: func,
  headingText: string,
  confirmAddress: func,
  isNewRegConfirmationVisible: bool,
  isAddressFormView: bool,
  backToNewAddressEntry: func,
  addressToPopulate: object,
  defaultAddress: object,
  onSetBillingAddress: func,
  shouldSetBillingAddress: bool,
  regAddress: func,
};

NoAddressList.contextTypes = {
  i18n: object,
};

export default NoAddressList;
