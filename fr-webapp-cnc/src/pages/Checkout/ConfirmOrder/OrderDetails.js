import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import If from 'components/uniqlo-ui/If';
import Container from 'components/uniqlo-ui/core/Container';
import Button from 'components/uniqlo-ui/Button';
import OrderSummary from 'components/OrderSummary';
import GiftPanel from 'pages/Checkout/Gifting/GiftPanel';
import AddressPanel from 'components/AddressPanel';
import OrderItemsSummary from 'pages/Checkout/ConfirmOrder/components/OrderItemsSummary';
import ConfirmStore from 'pages/Checkout/ConfirmOrder/components/ConfirmStore';
import { getDeliveryMethodInfo, isShippingDeliveryType } from 'utils/deliveryUtils';
import { getPaymentStoreDetails } from 'redux/modules/account/orderHistory/selectors';
import { getBrand } from 'redux/modules/cart/selectors';
import PackingMethod from './PackingMethod';
import PayAtStoreDetails from './PayAtStoreDetails';
import PaymentConfirmation from './PaymentConfirmation';
import { getTimeFrameMessage, getOrderArrivalDate } from './utils';
import styles from './styles.scss';

const { number, object, func, array, string, bool } = PropTypes;

@connect(
  (state, props) => ({
    timeFrameMessage: getTimeFrameMessage(state, props),
    arrivalDate: getOrderArrivalDate(state, props),
    storeDetail: getPaymentStoreDetails(state),
    brand: getBrand(state, props),
  }))
export default class OrderDetails extends PureComponent {
  static propTypes = {
    orderShippingAddress: object,
    orderConfirmDetails: object,
    orderSummary: object,
    items: array,
    giftCardPayment: number,
    renderDeliveryMethod: func,
    cartGift: object,
    selectGift: func,
    selectGiftMessageCard: func,
    barcodeInfo: object,
    storeDetail: object,
    isUniqloStore: bool,
    arrivalDate: string,
    timeFrameMessage: string,
    customerNotesURL: string,
    hashKey: string,
    gotoOrderHistory: func,
    deliveryMethod: object,
    brand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  gotoOrderHistory =() => {
    this.props.gotoOrderHistory(this.props.orderConfirmDetails.ord_no);
  }

  renderDeliveryMethod = (isShippingSelected) => {
    const { checkout } = this.context.i18n;
    const {
      arrivalDate,
      orderShippingAddress,
      brand,
    } = this.props;
    const deliveryType = orderShippingAddress && orderShippingAddress.deliveryType;
    const details = getDeliveryMethodInfo(deliveryType, checkout, brand);
    const plannedDates = !isShippingSelected ? arrivalDate : '';

    return (
      <AddressPanel
        title={details.title}
        {...orderShippingAddress}
        confirm
        fromCheckout
        plannedDates={plannedDates}
        variation={details.variation}
      />
    );
  };

  render() {
    const {
      orderSummary,
      giftCardPayment,
      items,
      barcodeInfo,
      storeDetail,
      cartGift,
      arrivalDate,
      timeFrameMessage,
      customerNotesURL,
      hashKey,
      selectGift,
      selectGiftMessageCard,
      orderConfirmDetails,
      deliveryMethod,
      isUniqloStore,
      brand,
    } = this.props;

    const { orderConfirmation, checkout, common } = this.context.i18n;
    const shippingCost = orderSummary && orderSummary.shippingCost ? `${common.currencySymbol} ${orderSummary.shippingCost}` : common.free;
    const isShippingSelected = isShippingDeliveryType(deliveryMethod.deliveryType);

    const timeFrameContainer = isUniqloStore
      ? styles.timeframeContainer
      : styles.otherPayment;

    const navigateButtonLabel = customerNotesURL ? orderConfirmation.customerNotes : checkout.orderSummary;

    let orderHistoryAnalyticsProps = {};

    if (!isUniqloStore) {
      orderHistoryAnalyticsProps = {
        analyticsOn: 'Button Click',
        analyticsCategory: 'Checkout Funnel',
        analyticsLabel: 'Check order list',
      };
    }

    return (
      <div>
        <If
          if={isUniqloStore}
          then={ConfirmStore}
          barcodeInfo={barcodeInfo}
          hashKey={hashKey}
          orderNo={orderConfirmDetails && orderConfirmDetails.ord_no}
          storeDetail={storeDetail}
        />
        <If
          if={orderConfirmDetails}
          then={OrderItemsSummary}
          payAtStore={isUniqloStore}
          plannedDates={arrivalDate}
          shipments={items}
          orderNo={orderConfirmDetails.ord_no}
        />
        <Container className={styles.orderShippingAddress}>
          {this.renderDeliveryMethod(isShippingSelected)}
        </Container>
        <If
          if={isShippingSelected}
          then={PackingMethod}
          arrivalDate={arrivalDate}
          containerStyle={timeFrameContainer}
          shippingPrice={shippingCost}
          timeFrameMessage={timeFrameMessage}
        />
        <If
          if={cartGift && cartGift.id}
          then={GiftPanel}
          confirm
          review
          gift={cartGift}
          selectGiftBox={selectGift}
          selectMessageCard={selectGiftMessageCard}
        />
        <If
          if={isUniqloStore}
          then={PayAtStoreDetails}
          else={PaymentConfirmation}
          {...{ orderConfirmDetails, storeDetail, giftCardPayment, brand }}
        />
        <Container className={styles.orderSummeryWrap}>
          <If
            if={orderSummary}
            then={OrderSummary}
            order={orderSummary}
            headerStyle={styles.titleSpacing}
            bottomTileClassName={styles.totalItemSpacing}
            fromConfirm
          />
        </Container>
        <Container className={`z3 ${styles.orderHistoryButton}`}>
          <Button
            className="default secondary medium"
            label={navigateButtonLabel}
            onTouchTap={this.gotoOrderHistory}
            {...orderHistoryAnalyticsProps}
          />
        </Container>
      </div>
    );
  }
}
