import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Icon from 'components/uniqlo-ui/core/Icon';
import Link from 'components/uniqlo-ui/Link';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import MessageBox from 'components/MessageBox';
import ErrorHandler from 'containers/ErrorHandler';
import ErrorMessage from 'components/ErrorMessage';
import { mapGift } from 'redux/modules/checkout/mappings/giftingMappings';
import { initializeOrderDetailsPage } from 'redux/modules/account/orderHistory';
import {
  getOrderDetails,
  getDeliveryType,
  getDeliveryDetails,
  getBarCode,
  getLocationBeforeTransitions,
  isReceiptAvailable,
  isPickUpAtStore,
  isShipping,
  isConvenienceStore,
  isStoreDetailsAvailable,
  isGiftingApplied,
  getStructuredOrderItems,
  getPaymentStoreDetails,
  getIfBarCodeIsShown,
  isLawsonStore,
  isSevenEleven,
  isPayAtUniqlo,
  getDeliveryDatesFromSelectable,
  getTimeFrameInfo,
  showAddBackToCartButton,
  getOrderBrand,
  getCustomerNoticeLink,
} from 'redux/modules/account/orderHistory/selectors';
import { saveRedirectUrl } from 'redux/modules/account/auth';
import { addProductsBackToCart } from 'redux/modules/cart/products';
import { getStoreDetails } from 'redux/modules/checkout/delivery/store/selectors';
import { getGiftBags } from 'redux/modules/checkout/gifting/selectors';
import GiftPanel from 'pages/Checkout/Gifting/GiftPanel';
import { redirect, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { getOrderData } from '../utils';
import ItemDetailsView from './components/ItemDetailsView';
import PickUpInfo from './components/PickUpInfo';
import TimeFrameView from './components/TimeFrameView';
import PaymentView from './components/PaymentView';
import DeliveryView from './components/DeliveryView';
import styles from './styles.scss';
import OrderDataTile from '../OrderDataTile';
import PayAtStoreBarcode from '../PayAtStoreBarcode';

const { object, string, bool, array, func } = PropTypes;

function GiftBoxWrapperView({ orderItemsDetail }, { i18n: { gifting } }) {
  return (
    <div className={styles.giftViewWrapper}>
      <Text className={`blockText ${styles.giftViewHeading}`}>
        <Icon className="iconGiftSelected" styleClass={styles.giftIcon} />
        {gifting.selectGifting}
      </Text>
      <GiftPanel gift={mapGift(orderItemsDetail)} noIcon orderHistory />
    </div>
  );
}

GiftBoxWrapperView.propTypes = {
  orderItemsDetail: object,
};

GiftBoxWrapperView.contextTypes = {
  i18n: object,
};

@asyncConnect([{ promise: initializeOrderDetailsPage }])
@connect((state, props) => {
  const { routing } = state;

  return {
    barcodeInfo: getBarCode(state, props),
    convenienceStore: isConvenienceStore(state),
    deliveryDetails: getDeliveryDetails(state),
    deliveryType: getDeliveryType(state),
    giftBags: getGiftBags(state),
    giftingApplied: isGiftingApplied(state, props),
    location: getLocationBeforeTransitions(state, props),
    orderItemsDetail: getOrderDetails(state),
    pickUpStore: isPickUpAtStore(state, props),
    receipt: isReceiptAvailable(state, props),
    routing,
    shipping: isShipping(state),
    storeDetail: getStoreDetails(state, props),
    storeDetailsAvailable: isStoreDetailsAvailable(state, props),
    structuredOrderItems: getStructuredOrderItems(state),
    paymentStoreDetail: getPaymentStoreDetails(state),
    shouldShowBarcode: getIfBarCodeIsShown(state),
    lawsonStore: isLawsonStore(state),
    isSEJ: isSevenEleven(state),
    isPayAtUQ: isPayAtUniqlo(state),
    deliverySelectableDates: getDeliveryDatesFromSelectable(state),
    timeFrameInfo: getTimeFrameInfo(state),
    showAddProductsBackToCartButton: showAddBackToCartButton(state),
    orderBrand: getOrderBrand(state),
    customerNotesURL: getCustomerNoticeLink(state),
  };
}, {
  saveRedirectUrl,
  addProductsBackToCart,
})
@ErrorHandler(['backToCart'])
export default class OrderDetails extends PureComponent {
  static propTypes = {
    barcodeInfo: object,
    convenienceStore: bool,
    deliveryDetails: object,
    deliveryType: string,
    giftingApplied: bool,
    location: object,
    orderItemsDetail: object,
    pickUpStore: bool,
    productGenderList: object,
    receipt: bool,
    routing: object,
    saveRedirectUrl: func,
    shipping: bool,
    structuredOrderItems: array,
    storeDetail: object,
    storeDetailsAvailable: bool,
    paymentStoreDetail: object,
    shouldShowBarcode: bool,
    lawsonStore: bool,
    isSEJ: bool,
    isPayAtUQ: bool,
    deliverySelectableDates: object,
    timeFrameInfo: object,
    addProductsBackToCart: func,
    showAddProductsBackToCartButton: bool,
    orderBrand: string,
    error: string,
    customerNotesURL: string,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    showGotoCartModal: false,
  };

  onAddProductsBackToCart = () => {
    const { orderItemsDetail: { ord_no: orderNo }, orderBrand } = this.props;

    this.props.addProductsBackToCart(orderNo, orderBrand)
      .then(() => this.toggleGoToCartModal());
  }

  onGoBackToOrderList = () => redirect(routes.orderHistory);

  onOrderCancel = () => {
    const {
      location: { pathname, search },
      orderItemsDetail: { ord_no: orderNumber },
      saveRedirectUrl: saveUrl,
    } = this.props;

    saveUrl(`${pathname}${search}`);
    redirect(`${routes.orderCancel}/${orderNumber}`);
  }

  toggleGoToCartModal = () => {
    this.setState({ showGotoCartModal: !this.state.showGotoCartModal });
  }

  goToCart = () => {
    redirect(getUrlWithQueryData(routes.cart, { brand: this.props.orderBrand }));
  }

  render() {
    const { i18n, i18n: { orderHistory, cart, orderConfirmation } } = this.context;
    const {
      props: {
        orderItemsDetail,
        routing,
        storeDetail,
        deliveryType,
        deliveryDetails,
        barcodeInfo,
        giftingApplied,
        storeDetailsAvailable,
        shipping,
        structuredOrderItems,
        pickUpStore,
        convenienceStore,
        receipt,
        paymentStoreDetail,
        shouldShowBarcode,
        lawsonStore,
        isSEJ,
        isPayAtUQ,
        deliverySelectableDates,
        timeFrameInfo,
        showAddProductsBackToCartButton,
        error,
        customerNotesURL,
        orderBrand,
      },
      onOrderCancel,
    } = this;
    const orderData = getOrderData(orderItemsDetail, i18n, deliverySelectableDates);

    return (
      <Container className={styles.orderDetails}>
        <If
          if={error}
          then={ErrorMessage}
          message={error}
          rootClassName="cartPageError"
        />
        <Heading className={styles.orderDetailsTitle} headingText={orderHistory.orderHistoryDetails} type="h4" />
        <div className={styles.storeWrapper}>
          <If
            if={shouldShowBarcode}
            then={PayAtStoreBarcode}
            barcodeInfo={barcodeInfo}
            storeDetail={paymentStoreDetail}
          />
          <Container className={styles.detailsWrapper}>
            <OrderDataTile
              orderData={orderData}
              orderNumber={orderItemsDetail.ord_no}
              showBarcodeLink={lawsonStore}
              hideUniqueStatus={isPayAtUQ}
              barcodeInfo={barcodeInfo}
            />
          </Container>
          <PickUpInfo
            {...{ deliveryType, convenienceStore, pickUpStore, orderBrand }}
            barcodeURL={orderData.barcodeURL}
            isSevenEleven={isSEJ}
          />
          <If
            if={showAddProductsBackToCartButton}
            then={Button}
            className={styles.addBackToCartBtn}
            label={orderHistory.addBackToCart}
            onTouchTap={this.onAddProductsBackToCart}
          />
          <If
            if={this.state.showGotoCartModal}
            then={MessageBox}
            onClose={this.toggleGoToCartModal}
            onAction={this.goToCart}
            message={orderHistory.checkCartAndSelectPayment}
            confirmLabel={cart.viewCart}
            title={orderHistory.itemsReturnedToCart}
            variation="ignoreOrProceed"
          />
        </div>
        <Heading className={styles.detailsBlockHeading} headingText={orderHistory.deliveryMethodAndGiftOptions} type="h4" />
        <Container className={styles.orderDetailsWrapper} >
          <div className={styles.deliveryAddressWrapper}>
            <DeliveryView
              deliveryDetails={deliveryDetails}
              storeDetail={storeDetail}
              storeDetailsAvailable={storeDetailsAvailable}
            />
          </div>
          <TimeFrameView {...{ routing, shipping, timeFrameInfo }} />
          <If if={giftingApplied} then={GiftBoxWrapperView} orderItemsDetail={orderItemsDetail} />
        </Container>
        <Heading className={styles.detailsBlockHeading} headingText={orderHistory.paymentMethod} type="h4" />
        <PaymentView {...{ orderItemsDetail, receipt, orderBrand }} />
        <Heading className={styles.detailsBlockHeading} headingText={orderHistory.purchasedItem} type="h4" />
        <ItemDetailsView
          orderItemsDetail={orderItemsDetail}
          structuredOrderItems={structuredOrderItems}
          onOrderCancel={onOrderCancel}
          orderBrand={orderBrand}
        />
        <Container className={styles.goBackButtonWrapper}>
          <If
            caret
            className={styles.linkClass}
            contentType="linkTab"
            if={customerNotesURL}
            target="_blank"
            label={orderConfirmation.customerNotes}
            then={Link}
            to={customerNotesURL}
          />
          <Button
            className={`default medium boldWithBorder ${styles.goBackButton}`}
            label={orderHistory.back}
            onTouchTap={this.onGoBackToOrderList}
            analyticsOn="Click"
            analyticsLabel="Back"
            analyticsCategory="Member Info"
          />
        </Container>
      </Container>
    );
  }
}
