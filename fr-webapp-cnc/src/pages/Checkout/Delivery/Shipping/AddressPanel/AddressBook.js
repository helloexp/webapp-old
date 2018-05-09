import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as userInfoActions from 'redux/modules/account/userInfo';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import { isDefaultAddressComplete, getShouldSetBillingAddress } from 'redux/modules/checkout/delivery/selectors';
import If from 'components/uniqlo-ui/If';
import Container from 'components/uniqlo-ui/core/Container';
import { popAPIErrorMessage } from 'redux/modules/errorHandler';
import getProperty from 'utils/getProperty';
import MessageBox from 'components/MessageBox';
import AddressGrid from './AddressGrid';
import AddressBookModal from './AddressBookModal';
import styles from './styles.scss';

const { bool, object, array, func } = PropTypes;

@connect(
  state => ({
    userInfoAddressList: state.userInfo.userInfoAddressList,
    registeredAddress: state.userInfo.userDefaultDetails,
    shippingAddress: state.delivery.shippingAddress,
    userAuth: state.auth,
    isDefaultAddressValid: isDefaultAddressComplete(state),
    shouldSetBillingAddress: getShouldSetBillingAddress(state),
  }),
  {
    ...userInfoActions,

    // For setting up addressForm
    setShippingAddress: deliveryActions.setShippingAddress,
    setAddressToEdit: deliveryActions.setAddressToEdit,
    setShipToAndContinue: deliveryActions.setShipToAndContinue,
    popAPIErrorMessage,
    setBillingAddressCheckBox: deliveryActions.setBillingAddressCheckBox,
  })
export default class AddressBook extends Component {

  static propTypes = {
    userInfoAddressList: array,
    shippingAddress: object,
    registeredAddress: object,
    setAddressToEdit: func,
    setDefaultUserAddress: func,
    deleteUserAddress: func,
    setShippingAddress: func,
    setAddress: func,
    toggleHeaderDisplay: func,
    setShipToAndContinue: func,
    userAuth: object,
    shadow: bool,
    isDefaultAddressValid: bool,
    popAPIErrorMessage: func,
    shouldSetBillingAddress: bool,
    setBillingAddressCheckBox: func,
  };

  static defaultProps = {
    shadow: true,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    isEditAddressFormModal: false,
    isEditAddressForm: false,
    isConfirmationVisible: false,
    addressNumber: 0,
    isDefaultAddress: false,
  };

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.props.popAPIErrorMessage('addUserAddress', true);
    this.isComponentMounted = false;
  }

  onConfirmAction = (action) => {
    const { deleteUserAddress } = this.props;

    this.setState({
      isConfirmationVisible: false,
    });

    if (action === 'yes') {
      deleteUserAddress(this.state.addressNumber, this.state.isDefaultAddress, true, true);
    }
  };

  onRemoveAddress = (addressNumber, isDefaultAddress) => {
    this.setState({
      isConfirmationVisible: true,
      addressNumber,
      isDefaultAddress,
    });
  }

  onSetAsDefaultAddress = (item) => {
    const address = this.mapToForm(item);
    const { setAddressToEdit, setDefaultUserAddress } = this.props;

    setAddressToEdit(address);
    setDefaultUserAddress(address.id);
  };

  setNewAddress = () => {
    const { setAddress } = this.props;

    setAddress('newAddress').then(() => this.isComponentMounted && this.completeAddressAddition());
  };

  completeAddressAddition() {
    this.setState({
      isEditAddressFormModal: false,
      isEditAddressForm: false,
      isDefaultAddress: false,
      addressNumber: '',
    });
  }

  addNewAddress = () => {
    this.props.toggleHeaderDisplay(false);
    this.setState({
      isEditAddressFormModal: true,
      isEditAddressForm: false,
    });
    this.props.setAddressToEdit({});
  };

  mapToForm(address) {
    return {
      id: address.id,
      firstName: address.firstName,
      lastName: address.lastName,
      firstNameKatakana: address.firstNameKatakana || '',
      lastNameKatakana: address.lastNameKatakana || '',
      postalCode: address.postalCode,
      prefecture: address.prefecture,
      streetNumber: address.street || '',
      apt: address.apt || '',
      phoneNumber: address.phoneNumber,
      cellPhoneNumber: address.cellPhoneNumber,
      city: address.city,
      email: address.email || getProperty(this.props.userAuth, 'user.email', ''),
      cas: address.cas || '',
    };
  }

  editAddress = (item) => {
    const { setAddressToEdit, setBillingAddressCheckBox } = this.props;
    const addressToEdit = this.mapToForm(item);

    setBillingAddressCheckBox(false);
    setAddressToEdit(addressToEdit);

    this.props.toggleHeaderDisplay(false);
    this.setState({
      isEditAddressForm: true,
      isEditAddressFormModal: false,
      addressNumber: item.id || '001',
    });
  };

  saveEditedAddress = () => {
    const { setAddress, shouldSetBillingAddress } = this.props;
    const { addressNumber } = this.state;
    let addressId = addressNumber;

    if (!addressId && shouldSetBillingAddress) {
      addressId = '001';
    }

    setAddress('editAddress', addressId)
    .then(() => {
      this.props.popAPIErrorMessage('provisionalInventory', true);

      if (this.isComponentMounted) this.completeAddressAddition();
    });
  };

  cancelAddressForm = () => {
    this.props.setAddressToEdit({});
    this.completeAddressAddition();
  };

  render() {
    const {
      props: {
        registeredAddress,
        shadow,
        userInfoAddressList,
        setShippingAddress,
        shippingAddress,
        isDefaultAddressValid,
        toggleHeaderDisplay,
        shouldSetBillingAddress,
        setBillingAddressCheckBox,
        setShipToAndContinue,
      },
      state: {
        isEditAddressFormModal,
        isConfirmationVisible,
        isEditAddressForm,
      },
      context: {
        i18n: {
          account,
        },
      },
    } = this;

    if (isEditAddressFormModal || isEditAddressForm) {
      const onSaveAddress = isEditAddressForm || (shouldSetBillingAddress && !isDefaultAddressValid)
        ? this.saveEditedAddress
        : this.setNewAddress;

      return (
        <AddressBookModal
          cancelAddressForm={this.cancelAddressForm}
          setNewAddress={onSaveAddress}
          {...{ toggleHeaderDisplay, shippingAddress, setShippingAddress, isEditAddressForm, setBillingAddressCheckBox }}
        />
      );
    }

    return (
      <Container className={styles.accountAddress}>
        <AddressGrid
          registeredAddress={registeredAddress}
          addNewAddress={this.addNewAddress}
          addressList={userInfoAddressList}
          editAddress={this.editAddress}
          onRemoveAddress={this.onRemoveAddress}
          onSetAsDefaultAddress={this.onSetAsDefaultAddress}
          saveAndContinue={setShipToAndContinue}
          shadow={shadow}
          isDefaultAddressValid={isDefaultAddressValid}
          preventMultipleClicks
        />
        <If
          if={isConfirmationVisible}
          confirmLabel={account.confirmRemove}
          message={account.removeMessage}
          onAction={this.onConfirmAction}
          rejectLabel={account.cancel}
          stickyBox
          title=""
          variation="confirm"
          then={MessageBox}
        />
      </Container>
    );
  }
}
