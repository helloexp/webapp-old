import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import AppConfig from 'config';
import cx from 'classnames';
import ErrorHandler from 'containers/ErrorHandler';
import Button from 'components/uniqlo-ui/Button';
import Container from 'components/uniqlo-ui/core/Container';
import If from 'components/uniqlo-ui/If';
import MessageBox from 'components/MessageBox';
import BrandHeader from 'components/BrandHeader';
import ErrorMessage from 'components/ErrorMessage';
import { maybeNavigate } from 'redux/modules/app';
import {
  getGiftCardPayment,
  isUniqloStorePayment,
  isUQPaymentTimeExpired,
  getCustomerNoticeLink,
  getHashKey,
  getOrderDetails,
  getOrderItems,
  getOrders,
  isSplitOrder,
} from 'redux/modules/checkout/order/selectors';
import { getBrand, getOtherBrand, isOtherBrandCartEmpty, isUniqlo } from 'redux/modules/cart/selectors';
import { getPaymentStoreDetails } from 'redux/modules/account/orderHistory/selectors';
import { getDefaultDetails } from 'redux/modules/checkout/payment/selectors';
import { initializeOrderConfirmPage, removeOrderAndContinue } from 'redux/modules/checkout/order';
import { selectGiftBox, selectMessageCard } from 'redux/modules/checkout/gifting/actions';
import { initializeWishlist } from 'redux/modules/wishlist/actions';
import { isDefaultDetailsComplete } from 'redux/modules/account/userInfo';
import { loadCatalogData as loadCatalogDataAction } from 'redux/modules/cart';
import { loadStyleData as loadStyleDataAction } from 'redux/modules/style';
import noop from 'utils/noop';
import ClientStorage from 'utils/clientStorage';
import { routes } from 'utils/urlPatterns';
import { checkIfApplePayGuestUserInConfirmPage } from 'utils/applePay';
import { trackOrderConfirmNavigation, trackCheckoutNavigation } from 'utils/gtm';
import { redirect, externalRedirect, getUrlWithQueryData, getCurrentHost } from 'utils/routing';
import ConfirmationMessage from './components/ConfirmationMessage';
import SplitOrder from './components/SplitOrder';
import OrderDetails from './OrderDetails';
import RecommendationsContainer from './RecommendationsContainer';
import ApplePay from './components/ApplePay';
import styles from './styles.scss';

const { number, object, func, array, string, bool } = PropTypes;
const { localStorageKeys } = AppConfig.app;

@asyncConnect([{
  promise: initializeOrderConfirmPage,
}])
@connect(
  (state, props) => ({
    ...state.products,
    orderConfirmDetails: getOrderDetails(state),
    hashKey: getHashKey(state),
    items: getOrderItems(state),
    pageAPIErrors: state.errorHandler.pageErrors,
    isUniqloBrand: isUniqlo(state, props),
    brand: getBrand(state, props),
    otherBrand: getOtherBrand(state, props),
    isOtherCartEmpty: isOtherBrandCartEmpty(state),
    isUniqloStore: isUniqloStorePayment(state),
    giftCardPayment: getGiftCardPayment(state, props),
    userDefaultDetails: getDefaultDetails(state),
    isUQPaymentExpired: isUQPaymentTimeExpired(state),
    isDefaultDetailsComplete: isDefaultDetailsComplete(state),
    customerNotesURL: getCustomerNoticeLink(state),
    orders: getOrders(state),
    isSplitOrderEnabled: isSplitOrder(state),
    isApplePayGuestUser: checkIfApplePayGuestUserInConfirmPage(routes.confirmOrder),
    paymentStoreDetails: getPaymentStoreDetails(state),
  }), {
    selectGift: selectGiftBox,
    selectGiftMessage: selectMessageCard,
    removeOrderAndContinue,
    loadCatalogData: loadCatalogDataAction,
    loadStyleData: loadStyleDataAction,
    toggleNavigationAlert: maybeNavigate,
    loadAndSyncWishlist: initializeWishlist,
  })
@ErrorHandler(['registerUserAddress'])
export default class ConfirmOrder extends PureComponent {

  static propTypes = {
    orderConfirmDetails: object,
    items: array,
    giftCardPayment: number,
    /* gifting*/
    selectGiftBox: func,
    selectMessageCard: func,
    removeOrderAndContinue: func,
    saveConfirmedOrderNumber: func,
    isUniqloBrand: bool,
    brand: string,
    otherBrand: string,
    isOtherCartEmpty: bool,
    isUniqloStore: bool,
    plannedDates: object,
    userDefaultDetails: object,
    loadCatalogData: func,
    loadStyleData: func,
    timeFrameMessage: string,
    toggleNavigationAlert: func,
    isUQPaymentExpired: bool,
    loadAndSyncWishlist: func,
    isDefaultDetailsComplete: bool,
    customerNotesURL: string,
    error: string,
    isSplitOrderEnabled: bool,
    orders: object,
    isApplePayGuestUser: bool,
    paymentStoreDetails: object,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    uniqloRecmdProductsCount: 2,
    reltdRecmdProductsCount: 2,
    savedProductsCount: 2,
    isGotoCartPopupVisible: true,
  };

  componentDidMount() {
    const {
      brand,
      userDefaultDetails,
      loadCatalogData,
      loadStyleData,
      loadAndSyncWishlist,
      orders,
      paymentStoreDetails,
      isUniqloBrand,
      isApplePayGuestUser,
    } = this.props;
    const { payment: { uniqloStore } } = this.context.config;

    let allProductIds = [];
    let allOrderDetails = [];
    // store details sent to GA for GU

    const storeDetails = !isUniqloBrand
      ? { store_name: paymentStoreDetails.name, g1_ims_store_id_4: paymentStoreDetails.imsStoreId4 }
      : {};

    Object.keys(orders).forEach((key) => {
      const orderConfirmDetails = orders[key].orderDetails;
      const itemIds = orderConfirmDetails.order_detail_list.map(item => item.l1_goods_cd);

      allProductIds = [...allProductIds, ...itemIds];
      allOrderDetails = [...allOrderDetails, orderConfirmDetails];
    });

    let promise = Promise.resolve();

    if (allOrderDetails.length) {
      if (!isApplePayGuestUser) {
        loadAndSyncWishlist(brand)
          .then(() => loadStyleData(allProductIds, brand))
          .catch(noop);
      }

      promise = loadCatalogData(allProductIds, brand)
        .then((catalogData) => {
          const { items: catalogItems } = catalogData;

          return ClientStorage.get(localStorageKeys.orderPlacedFlag)
            .then((orderPlacedFlag) => {
              let doCVCall = false;
              const isSplitDelv = allOrderDetails && allOrderDetails.length > 1;
              const paymentType = allOrderDetails && allOrderDetails.length === 1 && allOrderDetails[0].payment_type;
              const isUQStorePayment = isUniqloBrand && paymentType === uniqloStore;

              // should send the GA CV call only if this the first visit after placing order.
              // should call GA PV call otherwise.
              // I had to use local storage here because review order page can redirect to bluegate
              // before coming back to confirmation page.
              if (orderPlacedFlag === 'y' && isSplitDelv || !isUQStorePayment) {
                doCVCall = true;
              }

              if (doCVCall) {
                trackOrderConfirmNavigation({
                  brand,
                  userDefaultDetails: userDefaultDetails || {},
                  catalogItems,
                  allOrderDetails,
                  storeDetails,
                });
              } else {
                trackCheckoutNavigation(brand, { transactionProducts: '' });
              }

              // a placeholder return
              return true;
            });
        });
    }

    promise.then(() => ClientStorage.set(localStorageKeys.orderPlacedFlag, 'n'));
  }

  onGoToCart = () => {
    const { applePay: { countryJP } } = this.context.config;
    const { isUQPaymentExpired } = this.props;
    const cartPath = getUrlWithQueryData(routes.cart, { brand: this.props.otherBrand });
    const region = window.location.pathname.split('/')[1] || countryJP.toLowerCase();
    const cartUrl = `${window.location.origin}/${region}/${cartPath}`;

    /*
    * we are using externalRedirect to avoid the partial rendering of cart page
    * which causes some APIs to not have been called.
    * the issue was observed when redirect to cart page from order confirmation page
    * popup of other brand.
    */
    if (isUQPaymentExpired) {
      this.handleNavigationAlert(() => externalRedirect(cartUrl));
    } else {
      externalRedirect(cartUrl);
    }
  }

  handleNavigationAlert = (onRedirect, analyticsProps) => {
    const {
      props: { toggleNavigationAlert },
      context: { i18n: { common, orderConfirmation } },
     } = this;
    const messageText = `${common.navigateWarning}\n\n${orderConfirmation.payAtStoreSubTitle[0]}`;

    toggleNavigationAlert(null, false, onRedirect, {
      confirmBtnLabel: common.confirmLabel,
      cancelBtnLabel: common.cancelText,
      warningMessage: messageText,
      analyticsProps,
    });
  }

  closePopup = () => {
    this.setState({ isGotoCartPopupVisible: false });
  };

  continueShopping = () => {
    const analyticsProps = {
      analyticsOn: 'Button Click',
      analyticsCategory: 'Checkout Funnel',
      analyticsLabel: 'Continue shopping',
    };

    const {
      props: {
        isUQPaymentExpired,
        removeOrderAndContinue: onContinue,
      },
    } = this;

    if (isUQPaymentExpired) {
      this.handleNavigationAlert(() => onContinue(), analyticsProps);
    } else {
      onContinue();
    }
  };

  gotoOrderHistory = (orderNo) => {
    const analyticsProps = {
      analyticsOn: 'Button Click',
      analyticsCategory: 'Checkout Funnel',
      analyticsLabel: 'Check order list',
    };
    const { isUQPaymentExpired, customerNotesURL } = this.props;
    const orderURL = `${routes.orderDetails}/${orderNo}`;

    if (customerNotesURL) {
      this.handleNavigationAlert(() =>
        redirect(customerNotesURL)
      );
    } else if (isUQPaymentExpired) {
      this.handleNavigationAlert(() => redirect(orderURL), analyticsProps);
    } else {
      redirect(orderURL);
    }
  };

  goToMemberEdit = () => {
    const { LINK_TO_EDIT_MEMBER } = this.context.config;

    this.handleNavigationAlert(() => redirect(LINK_TO_EDIT_MEMBER.replace('{%hostname}', getCurrentHost())), {});
  }

  render() {
    const { props, context } = this;
    const {
      orderConfirmDetails,
      isUniqloBrand,
      otherBrand,
      isOtherCartEmpty,
      isUniqloStore,
      brand,
      orders,
      isSplitOrderEnabled,
      isApplePayGuestUser,
      error,
    } = props;

    const { i18n: { orderConfirmation, common }, config: { payment: { uniqloStore } } } = context;
    const { payment_type: paymentType } = orderConfirmDetails || {};

    const continueShoppingLabel = common.continueShopping;
    let popupButtonLabel = orderConfirmation.gotoUQCart;
    let popupMessage = orderConfirmation.guPopupMessage;
    const showPopup = this.state.isGotoCartPopupVisible && !isOtherCartEmpty && paymentType !== uniqloStore;
    const orderList = [];

    if (brand === 'uq') {
      popupButtonLabel = orderConfirmation.gotoGUCart;
      popupMessage = orderConfirmation.uqPopupMessage;
    }

    let continueShoppingAnalyticsProps = {};

    if (!isUniqloStore) {
      continueShoppingAnalyticsProps = {
        analyticsOn: 'Button Click',
        analyticsCategory: 'Checkout Funnel',
        analyticsLabel: isApplePayGuestUser ? 'ApplePay_continue_shopping' : 'Continue shopping',
      };
    }

    Object.entries(orders).forEach(([key, order]) => {
      const orderProps = {
        orderShippingAddress: order.orderShippingAddress,
        orderConfirmDetails: order.orderDetails,
        hashKey: order.hashKey,
        orderSummary: order.orderSummary,
        items: order.items,
        cartGift: order.cartGift,
        deliveryMethod: order.deliveryMethod,
        barcodeInfo: order.barcodeInfo,
        renderDeliveryMethod: this.renderDeliveryMethod,
        selectGift: props.selectGift,
        selectGiftMessageCard: props.selectGiftMessageCard,
        gotoOrderHistory: this.gotoOrderHistory,
        customerNotesURL: props.customerNotesURL,
        isUniqloStore,
        giftCardPayment: props.giftCardPayment,
      };

      orderList.push(
        isSplitOrderEnabled ? <SplitOrder key={key} header={`${orderConfirmation.orderNo}: #${key}`}>
          <OrderDetails {...orderProps} />
        </SplitOrder> : <OrderDetails key={key} {...orderProps} />
      );
    });

    return (
      <Container className="z7">
        <Container className={styles.confirmOrderContainer}>
          <If
            if={error}
            then={ErrorMessage}
            message={error}
            type="error"
            scrollUpOnError
          />
          <If
            if={!isUniqloStore}
            then={ConfirmationMessage}
            paymentType={paymentType}
            showToolTip={!isApplePayGuestUser}
          />
          <If if={isApplePayGuestUser} then={ApplePay} />
          <If if={!isApplePayGuestUser}>
            <Container className={cx(styles.whiteBackGround, { [styles.orderListWrap]: isSplitOrderEnabled })}>
              {orderList}
            </Container>
          </If>
          <Container className={`z3 ${styles.continueShoppingButton}`}>
            <Button
              className={cx('default', 'medium', styles.commonBtn, {
                [styles.continueBtn]: !isApplePayGuestUser,
              })}
              label={continueShoppingLabel}
              onTouchTap={this.continueShopping}
              {...continueShoppingAnalyticsProps}
            />
          </Container>
        </Container>
        <If
          if={!isApplePayGuestUser}
          then={RecommendationsContainer}
          isDefaultDetailsComplete={this.props.isDefaultDetailsComplete}
          isUniqloBrand={isUniqloBrand}
          brand={brand}
          goToMemberEdit={this.goToMemberEdit}
        />
        <If
          if={!isOtherCartEmpty}
          then={BrandHeader}
          brand={otherBrand}
          goToCart={this.onGoToCart}
          wrapperClass={styles.brandHeader}
          isButtonShown
        />
        <If
          if={showPopup}
          then={MessageBox}
          rejectLabel={popupButtonLabel}
          message={popupMessage}
          titleClass={styles.alertTitle}
          variation="popup"
          title={orderConfirmation.popupHeading}
          onAction={this.onGoToCart}
          onClose={this.closePopup}
          rejectProps={{
            analyticsOn: 'Button Click',
            analyticsLabel: isUniqloBrand ? 'Check GUcart' : 'Check UQcart',
            analyticsCategory: 'Checkout Funnel',
            preventMultipleClicks: true,
          }}
        />
      </Container>
    );
  }
}
