import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import BoxSelector from 'components/BoxSelector';
import constants from 'config/site/default';
import If from 'components/uniqlo-ui/If';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import * as deliverySelectors from 'redux/modules/checkout/delivery/selectors';
import { getOrderTotal } from 'redux/modules/checkout/order/selectors';
import { getFreeShippingMessage } from 'utils/deliveryUtils';
import { getCurrentBrand } from 'utils/routing';
import ShippingAddressForm from './ShippingAddressForm';
import AddressBook from './AddressPanel/AddressBook.js';
import styles from './styles.scss';

const { object, func, bool, number, string } = PropTypes;
const { SHIPPING } = constants.deliveryTypes;

@connect(
  (state, props) => ({
    shouldShowAddressBook: deliverySelectors.shouldShowAddressBook(state, props),
    shouldShowAddressForm: deliverySelectors.shouldShowAddressForm(state, props),
    price: deliverySelectors.getShippingFees(state, props),
    totalAmount: getOrderTotal(state, props),
    isSelected: deliverySelectors.isShippingMethodSelected(state, props),
    addressToDisplay: deliverySelectors.getShippingAddressFormValues(state, props),
    shippingAddress: deliverySelectors.getShippingAddress(state, props),
    setOption: state.delivery.setOption,
    defaultAddress: state.userInfo.userDefaultDetails,
    brand: getCurrentBrand(state),
  }), {
    setDeliveryMethodOption: deliveryActions.setDeliveryMethodOption,
    setSelectedDeliveryType: deliveryActions.setSelectedDeliveryType,
    saveEditedAddress: deliveryActions.saveEditedAddress,
    setAddressToEdit: deliveryActions.setAddressToEdit,
    setShippingAddress: deliveryActions.setShippingAddress,
    onSetBillingAddress: deliveryActions.onSetBillingAddress,
  }
)
export default class Shipping extends PureComponent {
  static propTypes = {
    // From connect and selectors
    addressToDisplay: object,
    defaultAddress: object,
    isSelected: bool,
    totalAmount: number,
    price: object,
    setOption: object,
    shippingAddress: object,
    shouldShowAddressBook: bool,
    shouldShowAddressForm: bool,
    brand: string,

    // Props from parent component
    toggleHeaderDisplay: func,

    // Actions from connect
    setAddressToEdit: func,
    saveEditedAddress: func,
    setDeliveryMethodOption: func,
    setSelectedDeliveryType: func,
  };

  static contextTypes = {
    i18n: object,
  };

  onSaveEditedAddress = () => {
    const { saveEditedAddress, setOption } = this.props;
    let saveAddressType = 'newAddress';
    let saveAddressId = null;

    if (setOption.shouldSetBillingAddress) {
      saveAddressType = 'editAddress';
      saveAddressId = '001';
    }

    saveEditedAddress(saveAddressType, saveAddressId);
  };

  updateDeliveryMethod = () => {
    const { setDeliveryMethodOption, setAddressToEdit, defaultAddress, setSelectedDeliveryType } = this.props;

    setDeliveryMethodOption(SHIPPING);
    setAddressToEdit(defaultAddress);
    setSelectedDeliveryType(SHIPPING);
  };

  render() {
    const { checkout } = this.context.i18n;
    const {
      isSelected,
      price,
      totalAmount,
      shouldShowAddressBook,
      shouldShowAddressForm,
      addressToDisplay,
      saveEditedAddress,
      toggleHeaderDisplay,
    } = this.props;

    const freeShippingMessage = getFreeShippingMessage(totalAmount, price[SHIPPING]);

    return (
      <BoxSelector
        checked={isSelected}
        className={`${styles.content} ${styles.shippingOption}`}
        description={freeShippingMessage}
        descriptionStyle="baseFont"
        id="shipping"
        label={checkout.shipping}
        labelStyle={styles.boldHeaderText}
        name="method"
        onChange={this.updateDeliveryMethod}
        price={price[SHIPPING]}
        priceStyle={styles.priceStyle}
        applyNoPriceStyle
        value={SHIPPING}
        shippingFee={checkout.shippingFee}
        analyticsOn="Address Checkbox Toggle"
        analyticsLabel="指定住所受取り"
        analyticsCategory="Checkout Funnel"
      >
        <If
          if={shouldShowAddressBook}
          then={AddressBook}
          setAddress={saveEditedAddress}
          shadow={false}
          toggleHeaderDisplay={toggleHeaderDisplay}
        />
        <If
          if={shouldShowAddressForm}
          then={ShippingAddressForm}
          saveAddressAction={this.onSaveEditedAddress}
          shippingAddress={addressToDisplay}
        />
      </BoxSelector>
    );
  }
}
