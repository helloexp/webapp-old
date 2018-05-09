import React, { PropTypes, PureComponent } from 'react';
import classNames from 'classnames';
import Button from 'components/uniqlo-ui/Button';
import If from 'components/uniqlo-ui/If';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import AddressPanel from 'components/AddressPanel';
import constants from 'config/site/default';
import { connect } from 'react-redux';
import { getShippingArivesAt } from 'redux/modules/checkout/delivery/selectors';
import AddressRow from './AddressRow';
import styles from './styles.scss';

const { bool, object, array, func, string } = PropTypes;

function RegisteredAddressPanel({ arrivesAt, editAddress, onSetAsDefaultAddress, registeredAddress }) {
  return (
    <Container>
      <AddressPanel
        isMembershipAddress
        apt={registeredAddress.apt}
        birthday={registeredAddress.birthday}
        cas={registeredAddress.cas}
        cellPhoneNumber={registeredAddress.cellPhoneNumber}
        city={registeredAddress.city}
        email={registeredAddress.email}
        firstName={registeredAddress.firstName}
        firstNameKatakana={registeredAddress.firstNameKatakana}
        gender={registeredAddress.gender}
        isDefaultShippingAddress={registeredAddress.isDefaultShippingAddress}
        lastName={registeredAddress.lastName}
        lastNameKatakana={registeredAddress.lastNameKatakana}
        phoneNumber={registeredAddress.phoneNumber}
        postalCode={registeredAddress.postalCode}
        prefecture={registeredAddress.prefecture}
        street={registeredAddress.street}
        streetNumber={registeredAddress.streetNumber}
        updateTimestamp={registeredAddress.updateTimestamp}
        noExtraSpacing
        plannedDates={registeredAddress.isDefaultShippingAddress ? arrivesAt : ''}
      />
      <AddressRow
        item={registeredAddress}
        editAddress={editAddress}
        onSetAsDefaultAddress={onSetAsDefaultAddress}
      />
    </Container>
  );
}

RegisteredAddressPanel.propTypes = {
  arrivesAt: string,
  editAddress: func,
  onSetAsDefaultAddress: func,
  registeredAddress: object,
};

function AddressItem({ arrivesAt, editAddress, item, onRemoveAddress, onSetAsDefaultAddress }) {
  return (
    <Container>
      <AddressPanel
        apt={item.apt}
        cas={item.cas}
        cellPhoneNumber={item.cellPhoneNumber}
        city={item.city}
        firstName={item.firstName}
        firstNameKatakana={item.firstNameKatakana}
        id={item.id}
        isDefaultShippingAddress={item.isDefaultShippingAddress}
        lastName={item.lastName}
        lastNameKatakana={item.lastNameKatakana}
        phoneNumber={item.phoneNumber}
        postalCode={item.postalCode}
        prefecture={item.prefecture}
        street={item.street}
        streetNumber={item.streetNumber}
        updateTimestamp={item.updateTimestamp}
        noExtraSpacing
        plannedDates={item.isDefaultShippingAddress ? arrivesAt : ''}
      />
      <AddressRow
        item={item}
        editAddress={editAddress}
        onRemoveAddress={onRemoveAddress}
        onSetAsDefaultAddress={onSetAsDefaultAddress}
      />
    </Container>
  );
}

AddressItem.propTypes = {
  arrivesAt: string,
  editAddress: func,
  item: object,
  onRemoveAddress: func,
  onSetAsDefaultAddress: func,
};

@connect((state, props) => ({
  arrivesAt: getShippingArivesAt(state, props),
}))
export default class AddressGrid extends PureComponent {
  static propTypes = {
    addressList: array,
    addNewAddress: func,
    saveAndContinue: func,
    editAddress: func,
    onRemoveAddress: func,
    onSetAsDefaultAddress: func,
    registeredAddress: object,
    arrivesAt: string,
    shadow: bool,
    isDefaultAddressValid: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    viewMoreAddressesTill: constants.defaultAddressListLimit,
  }

  onViewMore = () => {
    this.setState({
      viewMoreAddressesTill: this.state.viewMoreAddressesTill + constants.defaultAddressListLimit,
    });
  }

  render() {
    const {
      props: {
        addressList,
        saveAndContinue,
        editAddress,
        onRemoveAddress,
        onSetAsDefaultAddress,
        addNewAddress,
        registeredAddress,
        arrivesAt,
        shadow,
        isDefaultAddressValid,
      },
      state: {
        viewMoreAddressesTill,
      },
      context: {
        i18n: {
          account,
          checkout,
          orderConfirmation,
          common,
        },
      },
    } = this;

    const gridList = addressList && addressList.length
      ? addressList.slice(0, viewMoreAddressesTill).map((item, index) => (
        <AddressItem
          arrivesAt={arrivesAt}
          editAddress={editAddress}
          item={item}
          onRemoveAddress={onRemoveAddress}
          onSetAsDefaultAddress={onSetAsDefaultAddress}
          key={index}
        />
      ))
      : null;

    const mainClasses = classNames(styles.addressBookList, {
      [styles.addressListWrapper]: shadow,
    });

    return (
      <div>
        <Heading
          className={classNames('mainHeaderHrule', styles.addressListHeading)}
          headingText={checkout.selectDeliveryAddress}
          type="h2"
        />
        <Container className={mainClasses}>
          <If
            arrivesAt={arrivesAt}
            if={isDefaultAddressValid}
            editAddress={editAddress}
            onSetAsDefaultAddress={onSetAsDefaultAddress}
            registeredAddress={registeredAddress}
            then={RegisteredAddressPanel}
          />
          {gridList}
          <If
            className={classNames('default', 'medium', styles.showMoreBtn)}
            if={addressList && (addressList.length > viewMoreAddressesTill) && (viewMoreAddressesTill < 100)}
            label={orderConfirmation.showAll}
            labelClass={styles.buttonSpan}
            onTouchTap={this.onViewMore}
            then={Button}
          />
          <Button
            className={classNames('secondary', 'medium', styles.saveAndContinue)}
            label={common.done}
            labelClass={styles.buttonSpan}
            onTouchTap={saveAndContinue}
            preventMultipleClicks
          />
        </Container>
        <Button
          className={classNames('default', 'medium', styles.newAddressRegister)}
          label={account.newAddress}
          labelClass={styles.buttonSpan}
          onTouchTap={addNewAddress}
          analyticsOn="Button Click"
          analyticsLabel="Register address"
          analyticsCategory="Checkout Funnel"
        />
      </div>
    );
  }
}
