import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import { connect } from 'react-redux';
import AddressPanel from 'components/AddressPanel';
import If from 'components/uniqlo-ui/If';
import { getDeliveryMethodInfo } from 'utils/deliveryUtils';
import * as deliverySelectors from 'redux/modules/checkout/delivery/selectors';
import * as deliveryActions from 'redux/modules/checkout/delivery/actions';
import { getBrand } from 'redux/modules/cart/selectors';
import Shipping from '../Shipping';
import PickupStore from '../PickupStore';
import ConvenienceStore from '../ConvenienceStore';
import styles from './deliveryMethods.scss';

const { object, func, bool, string } = PropTypes;

@connect(
  (state, props) => ({
    isShipping: deliverySelectors.isShipping(state),
    shippingAddress: deliverySelectors.getShippingAddressToDisplay(state),
    deliveryType: deliverySelectors.getDeliveryMethodType(state),
    deliveryShippingAddress: deliverySelectors.getDeliveryShippingAddress(state),
    isDeliveryOptionsEnabled: deliverySelectors.isDeliveryOptionsEnabled(state),
    plannedDates: deliverySelectors.getPlannedDates(state),
    methodAllowed: deliverySelectors.getPossibleShippingMethods(state),
    brand: getBrand(state, props),
  }), {
    toggleDeliveryEdit: deliveryActions.toggleDeliveryEdit,
    setAddressToEdit: deliveryActions.setAddressToEdit,
  }
)
export default class DeliveryMethods extends PureComponent {
  static propTypes = {
    deliveryShippingAddress: object,
    isDeliveryOptionsEnabled: bool,
    isShipping: bool,
    shippingAddress: object,
    toggleDeliveryEdit: func,
    toggleHeaderDisplay: func,
    setAddressToEdit: func,
    plannedDates: string,
    deliveryType: string,
    methodAllowed: object,
    brand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  static defaultProps = {
    toggleDeliveryEdit: noop,
  };

  updateDeliveryMethod = () => {
    const { setAddressToEdit, toggleDeliveryEdit, shippingAddress, isShipping } = this.props;

    if (isShipping) {
      setAddressToEdit(shippingAddress);
    }

    toggleDeliveryEdit();
  };

  render() {
    const { checkout } = this.context.i18n;
    const {
      deliveryType, toggleHeaderDisplay, deliveryShippingAddress,
      isDeliveryOptionsEnabled, plannedDates, methodAllowed, brand,
    } = this.props;
    const details = getDeliveryMethodInfo(deliveryType, checkout, brand);

    if (isDeliveryOptionsEnabled) {
      return (
        <div className={styles.deliveryOptions}>
          <If
            if={methodAllowed.isShipping}
            then={Shipping}
            toggleHeaderDisplay={toggleHeaderDisplay}
          />
          <If
            if={methodAllowed.isPickup}
            then={PickupStore}
          />
          <If
            if={methodAllowed.isCvs}
            then={ConvenienceStore}
          />
        </div>
      );
    }

    return (
      <AddressPanel
        {...deliveryShippingAddress}
        editable
        frame
        fromCheckout
        onEdit={this.updateDeliveryMethod}
        plannedDates={plannedDates}
        title={details.title}
        variation={details.variation}
      />
    );
  }
}
