import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import noop from 'utils/noop';
import Button from 'components/uniqlo-ui/Button';
import BoxSelector from 'components/BoxSelector';
import MessageBox from 'components/MessageBox';
import If from 'components/uniqlo-ui/If';
import { redirect, getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import constants from 'config/site/default';
import { routes } from 'utils/urlPatterns';
import { setDeliveryMethodOption, confirmStorePickupShippingMethod, setSelectedDeliveryType } from 'redux/modules/checkout/delivery';
import { removePickupStoreAddress } from 'redux/modules/account/address';
import { setLocationAccess, selectStore } from 'redux/modules/checkout/delivery/store/actions';
import { getIsStorePickupSelected, getPickupStoreShippingFee, getCurrentPickupStoreOfBrand } from 'redux/modules/checkout/delivery/selectors';
import { shouldShowPickupStore } from 'redux/modules/checkout/delivery/store/selectors';
import { getOrderTotal } from 'redux/modules/checkout/order/selectors';
import { getFreeShippingMessage, getShippingThresholdOfDeliveryType } from 'utils/deliveryUtils';
import CurrentStoreAddress from './components/CurrentStoreAddress';
import styles from './styles.scss';

const { STORE_PICKUP } = constants.deliveryTypes;
const { bool, string, func, object, number } = PropTypes;

@connect((state, props) => ({
  currentPickupStoreDetails: state.deliveryStore.storeDetail,
  currentStore: getCurrentPickupStoreOfBrand(state),
  isStorePickupSelected: getIsStorePickupSelected(state),
  price: getPickupStoreShippingFee(state, props),
  totalAmount: getOrderTotal(state, props),
  brand: getCurrentBrand(state),
  shouldShowStoreHistory: shouldShowPickupStore(state),
  shippingThreshold: getShippingThresholdOfDeliveryType(state, STORE_PICKUP),
}),
  {
    removePickupStoreAddress,
    setDeliveryMethodOption,
    setSelectedDeliveryType,
    confirmStorePickupShippingMethod,
    setLocationAccess,
    selectStore,
  }
)
export default class PickupStore extends PureComponent {
  static propTypes = {
    brand: string,
    currentPickupStoreDetails: object,
    currentStore: object,
    price: string,
    totalAmount: number,
    removePickupStoreAddress: func,
    shippingThreshold: number,
    setDeliveryMethodOption: func,
    setSelectedDeliveryType: func,
    setLocationAccess: func,
    confirmStorePickupShippingMethod: func,
    selectStore: func,
    isStorePickupSelected: bool,
    shouldShowStoreHistory: bool,
  };

  static defaultProps = {
    setLocationAccess: noop,
    setDeliveryMethodOption: noop,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    showConfirm: false,
  };

  onSetLocationAccess = () => {
    this.props.setLocationAccess('yes');
    redirect(getUrlWithQueryData(routes.deliveryStore, { brand: this.props.brand }));
  };

  onSetPickupAtStore = () => {
    this.props.setSelectedDeliveryType(STORE_PICKUP);
    this.props.setDeliveryMethodOption(STORE_PICKUP);
  };

  onSelectCurrentStore = () => {
    const { currentPickupStoreDetails, brand } = this.props;

    this.props.confirmStorePickupShippingMethod(currentPickupStoreDetails.id)
      .then(() => redirect(getUrlWithQueryData(routes.reviewOrder, { brand })));
  };

  onRemoveCurrentStore = () => {
    this.setState({
      showConfirm: true,
    });
  };

  onRemovalConfirmed = (btn) => {
    if (btn === 'yes') {
      this.props.removePickupStoreAddress();
    }

    this.setState({
      showConfirm: false,
    });
  };

  onStoreFinderClick = () => {
    this.props.selectStore(null);
    this.onSetLocationAccess();
  };

  render() {
    const { i18n: { checkout, deliveryStore, delivery } } = this.context;
    const { price, currentStore, isStorePickupSelected, totalAmount, shouldShowStoreHistory, brand, shippingThreshold } = this.props;
    const freeShippingMessage = getFreeShippingMessage(totalAmount, price, shippingThreshold);
    const contentClasses = `medium default storeButton${currentStore && shouldShowStoreHistory ? '' : 'XL'}`;

    return (
      <BoxSelector
        checked={isStorePickupSelected}
        description={freeShippingMessage}
        descriptionStyle="baseFont"
        id="pickupAtStore"
        label={checkout.pickupStore[brand]}
        labelStyle={styles.boldHeaderText}
        name="method"
        onChange={this.onSetPickupAtStore}
        price={price}
        value={STORE_PICKUP}
        priceStyle={styles.priceStyle}
        applyNoPriceStyle
        className={styles.content}
        shippingFee={checkout.shippingFee}
        analyticsOn="Address Checkbox Toggle"
        analyticsLabel={checkout.pickupStore[brand]}
        analyticsCategory="Checkout Funnel"
      >
        <If
          if={currentStore && shouldShowStoreHistory}
          then={CurrentStoreAddress}
          onRemoveCurrentStore={this.onRemoveCurrentStore}
          onSelectCurrentStore={this.onSelectCurrentStore}
          onSetLocationAccess={this.onSetLocationAccess}
        />
        <If
          if={this.state.showConfirm}
          then={MessageBox}
          confirmLabel={delivery.confirmLabel}
          message={delivery.cvsRemoveMessage}
          onAction={this.onRemovalConfirmed}
          rejectLabel={delivery.rejectLabel}
          stickyBox
          variation="confirm"
        />
        <Button
          className={contentClasses}
          label={deliveryStore.selectStore}
          onTouchTap={this.onStoreFinderClick}
        />
      </BoxSelector>
    );
  }
}
