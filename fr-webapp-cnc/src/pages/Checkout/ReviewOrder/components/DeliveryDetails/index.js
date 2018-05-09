import React, { Component, PropTypes } from 'react';
import If from 'components/uniqlo-ui/If';
import { getDeliveryMethodInfo } from 'utils/deliveryUtils';
import DeliveryPreferencePanel from 'pages/Checkout/components/DeliveryPreferencePanel';
import ShippingTimeFrame from 'pages/Checkout/components/ShippingTimeFrame';
import GiftPanel from 'pages/Checkout/Gifting/GiftPanel';
import AddressPanel from 'components/AddressPanel';
import styles from '../../styles.scss';

const { func, object, bool, string } = PropTypes;

export default class DeliveryDetails extends Component {
  static propTypes = {
    deliveryMethod: object,
    cartGift: object,
    onEditAddressPanel: func,
    onSelectGiftBox: func,
    onSelectMessageCard: func,
    shippingAddress: object,
    isSplitDeliveryApplied: bool,
    brand: string,
    isConcierge: bool,
  };

  static defaultProps = {
    deliveryMethod: {},
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const {
      deliveryMethod,
      cartGift,
      onEditAddressPanel,
      onSelectGiftBox,
      onSelectMessageCard,
      shippingAddress,
      isSplitDeliveryApplied,
      brand,
      isConcierge,
    } = this.props;
    const { i18n: { checkout } } = this.context;
    const details = getDeliveryMethodInfo(deliveryMethod.deliveryType, checkout, brand);

    return (
      <div>
        <If
          if={shippingAddress && shippingAddress.firstName}
          then={AddressPanel}
          {...shippingAddress}
          editable={!isConcierge}
          frame
          fromCheckout
          onEdit={onEditAddressPanel}
          title={details.title}
          variation={details.variation}
        />
        <If if={isSplitDeliveryApplied} then={DeliveryPreferencePanel} review />
        <ShippingTimeFrame review fromCheckout />
        <If
          if={!isSplitDeliveryApplied}
          then={GiftPanel}
          className={styles.giftPanel}
          editable={!isConcierge}
          frame
          gift={cartGift}
          review
          selectGiftBox={onSelectGiftBox}
          selectMessageCard={onSelectMessageCard}
        />
      </div>
    );
  }
}
