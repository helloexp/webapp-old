import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import BoxSelector from 'components/BoxSelector';
import constants from 'config/site/default';
import { setDeliveryMethodOption, setSelectedDeliveryType, toggleCvsNavigationModal } from 'redux/modules/checkout/delivery';
import { isCreditCardUnsaved } from 'redux/modules/checkout/payment/selectors';
import { getCvsShippingFee, isDeliveryTypeCvs } from 'redux/modules/checkout/delivery/selectors';
import { getOrderTotal } from 'redux/modules/checkout/order/selectors';
import { getCurrentBrand } from 'utils/routing';
import { getFreeShippingMessage } from 'utils/deliveryUtils';
import styles from './styles.scss';
import CVSBodyContainer from './components/CVSBodyContainer';

const { string, object, func, bool, number } = PropTypes;
const { SEJ } = constants.deliveryTypes;

@connect((state, props) => ({
  isEditDeliveryOption: state.delivery.isEditDeliveryOption,
  deliveryPrice: getCvsShippingFee(state, props),
  totalAmount: getOrderTotal(state, props),
  isCvsDeliveryType: isDeliveryTypeCvs(state),
  isCreditCardUnsaved: isCreditCardUnsaved(state, props),
  brand: getCurrentBrand(state),
}), {
  setSelectedDeliveryType,
  setDeliveryMethodOption,
  toggleCvsNavigationModal,
})

export default class ConvenienceStore extends Component {

  static propTypes = {
    isEditDeliveryOption: bool,
    toggleCvsNavigationModal: func,
    setDeliveryMethodOption: func,
    setSelectedDeliveryType: func,
    isCvsDeliveryType: bool,
    deliveryPrice: string,
    totalAmount: number,
    isCreditCardUnsaved: bool,
    brand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  toggleConvenienceModal = () => {
    if (this.props.isCreditCardUnsaved) {
      this.props.toggleCvsNavigationModal();
    } else {
      this.props.setSelectedDeliveryType(SEJ);
      this.props.setDeliveryMethodOption(SEJ);
    }
  };

  render() {
    const {
      context: {
        i18n: {
          checkout,
        },
      },
      props: {
        isCvsDeliveryType,
        isEditDeliveryOption,
        deliveryPrice,
        totalAmount,
        brand,
      },
      toggleConvenienceModal,
    } = this;

    const freeShippingMessage = getFreeShippingMessage(totalAmount, deliveryPrice);

    return (
      <BoxSelector
        checked={isCvsDeliveryType && !isEditDeliveryOption}
        description={freeShippingMessage}
        descriptionStyle="baseFont"
        id="pickupConvenience"
        label={checkout.pickupConvenience[brand]}
        labelStyle={styles.boldHeaderText}
        name="method"
        onChange={toggleConvenienceModal}
        price={deliveryPrice}
        value={SEJ}
        priceStyle={styles.priceStyle}
        applyNoPriceStyle
        className={styles.content}
        shippingFee={checkout.shippingFee}
        analyticsOn="Address Checkbox Toggle"
        analyticsLabel="コンビニ受取り"
        analyticsCategory="Checkout Funnel"
      >
        <CVSBodyContainer />
      </BoxSelector>
    );
  }
}
