import { getCurrentBrand, redirect as externalRedirect, getCurrentHost } from 'utils/routing';
import noop from 'utils/noop';
import constants from 'config/site/default';
import { routes, routePatterns, getBrandFromAPIEndpoint } from 'utils/urlPatterns';
import { trackError } from 'utils/gtm';
import scrollToTop from 'utils/scroll';
import { isApplePaySessionAvailable, applePayVersion, getLineItems } from 'utils/applePay';
import * as cartActions from 'redux/modules/cart';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import { setPaymentMethod, getPaymentMethodsSelectable } from 'redux/modules/checkout/payment/actions';
import { setCreditCard } from 'redux/modules/checkout/payment/creditCard/actions';
import * as giftingActions from 'redux/modules/checkout/gifting/actions';
import { removeAllGiftCards, updateFailedGiftCards, resetGiftCards } from 'redux/modules/checkout/payment/giftCard/actions';
import * as orderActions from 'redux/modules/checkout/order';
import { getRoutingPathName, getRoutingSearch } from 'redux/modules/selectors';
import { confirmLogout, forceLogin } from 'redux/modules/account/auth';
import { errorRedirect, pushAPIErrorMessage, pushDetailedErrorMessage } from 'redux/modules/errorHandler';
import { toggleApplePayLoginPopup } from 'redux/modules/applePay';
import { removeACoupon } from 'redux/modules/membership/coupons';
import getSiteConfig from 'config/site';
import { getErrors, getRegion, getTranslation } from 'i18n';
import reactionSet from './reactions';

const {
  deliveryTypes: { SEJ, SHIPPING },
  gds: { negative },
  deliveryPreferences: { SPLIT_DELIVERY },
} = constants;

function setPageFlag(flags, pathname) {
  const pageFlags = { ...flags };

  for (const route of Object.keys(routePatterns)) {
    const isCurrrentRoute = routePatterns[route].test(pathname);

    pageFlags[route] = isCurrrentRoute;

    if (isCurrrentRoute) {
      break;
    }
  }

  return pageFlags;
}

/**
 * A template class for defining error reaction thunks
 *
 * @export
 * @class ErrorReactor
 * @param {Object} state
 * @param {function} dispatch
 * @param {Object} action
 * @param {apiMethod} string
 * @param {apiMethod} string
 */
export default class ErrorReactor {
  constructor(store, action, apiMethod, applePaySession) {
    const { getState, dispatch } = store;
    const state = getState();
    const { routing } = state;
    const { locationBeforeTransitions: { pathname, query } } = routing;
    const { errorHandler, error } = action;

    this.dispatch = dispatch;
    this.state = state;
    this.error = error;
    this.currentLocation = pathname;
    this.queryParams = query;
    this.errorHandler = errorHandler;
    this.apiMethod = apiMethod;
    this.applePaySession = applePaySession;

    const { params = {}, endpoint = '' } = error;

    this.params = {
      cart: {
        l1Code: params.l1_goods_cd,
        l2Code: params.l2_goods_cd,
        quantity: params.goods_cnt,
      },
      coupon: {
        id: params.coupon_id,
      },
      giftBagId: params.gift_bag_id,
      brand: getBrandFromAPIEndpoint(endpoint) || getCurrentBrand({ routing }),
    };

    const pageFlags = {
      cart: false,
      delivery: false,
      gifting: false,
      login: false,
      orderHistory: false,
      payment: false,
      reviewOrder: false,
      coupons: false,
      orderCancel: false,
      creditCard: false,
      checkout: false,
      confirmOrder: false,
    };

    this.currentPage = setPageFlag(pageFlags, pathname);
  }

  /**
   * Reduce return values of an array of functions into
   * a single object by evaluating the functions
   * @returns {Object} - reaction thunks mapped to error code
   * @memberOf ErrorReactor
   */
  getReaction = () => reactionSet.reduce((reactions, reaction) => ({ ...reactions, ...reaction.call(this) }), {});

  /**
   * Get error message for a region
   * @returns {Object} - error messages
   * @memberOf ErrorReactor
   */
  getMessage = () => getErrors().call(this);

  /**
   * CORE THUNKS
   * @returns {Promise}
   */
  redirect = (targetPath, brandQuery, reload = false, scrollUp = false) => {
    const pathPattern = new RegExp(`${targetPath}$`);
    const isCurrentPage = pathPattern.test(this.currentLocation);

     // dispatch router action only if target location is not
     // same as current location OR if reload flag is enabled
    if (!this.errorHandler.isFakeError && (!isCurrentPage || reload)) {
      const { brand } = this.params;

      targetPath = `/${getRegion()}/${targetPath}`;
      const route = brandQuery && brand ? `${targetPath}?brand=${brand}` : targetPath;

      this.dispatch(errorRedirect(route, reload, scrollUp));
    } else if (isCurrentPage && scrollUp) {
      scrollToTop();
    }

    return Promise.resolve();
  };
  forceUserLogin = () => {
    const pathname = getRoutingPathName(this.state);
    const search = getRoutingSearch(this.state);

    this.dispatch(forceLogin(`${pathname}${search}`));
  };
  deleteLocalCart = () => Promise.resolve(this.dispatch(cartActions.resetCart(this.params.brand)));
  resetDeliveryType = () => (
    this.dispatch(deliveryActions.loadDeliveryMethodOptions())
      .then(() => this.dispatch(deliveryActions.setDeliveryWithDefaultPreferenceIfNeeded(true)))
    );
  setLocalDeliveryType = (deliveryType = '') => this.dispatch(deliveryActions.setDeliveryMethodOption(deliveryType));
  updateGifting = () => this.dispatch(giftingActions.updateGifting(this.params.giftBagId, this.params.brand));
  resetGiftingMessage = () => this.dispatch(giftingActions.onMessageCancel());
  resetGiftCard = () => this.dispatch(giftingActions.onCardCancel());
  deleteCart = () => this.dispatch(cartActions.removeCart(this.params.brand));
  createNewCart = () => this.dispatch(cartActions.addToCart(this.params.cart));
  loadCart = () => this.dispatch(cartActions.load(this.params.brand));
  showCartModal = () => this.dispatch(cartActions.showCartModal(true));
  logoutAndGoToLogin = () => this.dispatch(confirmLogout());
  cancelOrder = () => this.dispatch(orderActions.getOrderAndCancel());
  closeUserRegistrationPopup = () => this.dispatch(orderActions.closeUserRegistrationPopup());
  deleteOrder = () =>
    this.dispatch(orderActions.removeOrder())
      .then(() => this.dispatch(orderActions.removeOrderCookie()))
      .catch(noop);
  abortApplePaySession = () => {
    const session = this.applePaySession;

    if (isApplePaySessionAvailable && session) {
      session.abortactivesession();
    }
  }

  /**
   * REDIRECTION THUNKS
   * @returns {Promise} promised redirection callback
   */
  goToLogin = () => this.redirect(routes.login);
  goToL1Page = () => {
    const { UQ_LINK_TO_TOP_PAGE } = getSiteConfig();
    const l1Url = `${UQ_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(true))}`;

    // only track errors with HTTP 5xx
    if (this.error.statusCode >= 500) {
      trackError(this.error);
    }

    externalRedirect(l1Url);
  }
  goToCartPage = () => this.redirect(routes.cart, true);
  goToOrderHistory = () => this.redirect(routes.orderHistory, false, true);
  goToReviewOrderPage = () => this.redirect(routes.reviewOrder, true);
  goToPaymentPage = () => this.redirect(routes.payment, true, false, true);
  goToGiftingPage = () => this.redirect(routes.gifting);
  goToDeliveryPage = () => this.redirect(routes.delivery, true);
  goToAccountCreditCard = () => this.redirect(routes.creditCard, true);
  reloadPayment = () => this.redirect(routes.payment, true, true);
  reloadReviewOrderPage = () => {
    const { creditInfo } = this.state.payment;

    if (creditInfo.dbKey) {
      // Reset cvv if there is a credit card
      this.dispatch(setCreditCard('cvv', '', creditInfo));
    }

    return this.redirect(routes.reviewOrder, true, true);
  }

  /**
   * GOTO cart > DELETE local cart
   */
  cartPageDeleteLocalCart = () =>
    this.goToCartPage().then(this.deleteLocalCart);

  /**
   * GOTO cart > DELETE cart > DELETE local cart
   */
  cartPageDeleteCart = () =>
    this.goToCartPage().then(this.deleteCart);

  /**
   * DELETE local cart > CREATE new cart
   */
  deleteLocalAndCreateNewCart = () =>
    this.deleteLocalCart().then(this.createNewCart);

  /**
   * GOTO delivery  > SET deliveryType to '' (null)
   */
  deliveryPageResetDeliveryType = () =>
    this.goToDeliveryPage()
    .then(this.resetDeliveryType)
    .then(() => this.dispatch(deliveryActions.reloadDeliveryMethodOptions()));

  /**
   * Reset delivery type  > SET deliveryType to SEJ > GOTO delivery
   * The order is important here, this is the forth time I fix this,
   * Please do not change the order of the calls again ;)
   */
  deliveryPageSetDeliveryTypeCVS = () => {
    this.resetDeliveryType().then(() => {
      this.dispatch(deliveryActions.reloadDeliveryMethodOptions());
      this.setLocalDeliveryType(SEJ);
      this.goToDeliveryPage();
    });
  }

  /**
   * GOTO gifting > RESET delivery type to ''
   */
  giftPageResetDeliveryType = () =>
    this.goToGiftingPage().then(this.resetDeliveryType);

  /**
   * GOTO delivery > RESET delivery type to '' > UPDATE gifting
   * This action may be called in cart page gift checkbox.
   * In this case the state will be lost when user switches the domain, http to https.
   * The cookie `{brand}-saveGiftMessage` is used to push this error message.
   */
  deliveryPageResetDeliveryTypeUpdateGifting = () =>
    this.deliveryPageResetDeliveryType().then(this.updateGifting);

  /**
   * GOTO gifting > RESET gifting message
   */
  giftPageResetGiftMsg = () =>
    this.goToGiftingPage().then(this.resetGiftingMessage);

  /**
   * GOTO gifting > RESET gift card
   */
  giftPageResetGiftCard = () =>
    this.goToGiftingPage().then(this.resetGiftCard);

  /**
   * Cancel order > GOTO review order page
   */
  reviewOrderPageRemoveOrder = () => {
    const { resultCode, resultOrdNo, resultHashKey, resultUpdDate } = this.queryParams;

    // If ord_no, upd_date, hash_key are included in the redirect URL
    // it means that SPA should explicitly cancel the order.
    if (resultCode && resultOrdNo && resultHashKey && resultUpdDate) {
      return this.cancelOrder().then(this.goToReviewOrderPage);
    }

    // GDS itself has cancelled the order
    return Promise.resolve();
  }

  /**
   * If the error is returned from set payment method > then go to payment page.
   * If the error is from any other pages: Reset deliveryMethod and go to delivery page.
   */
  handleDeliveryAndPaymentChange = () => {
    const customErrorKey = this.errorHandler && this.errorHandler.customErrorKey;

    if (customErrorKey === 'setPaymentMethod') {
      this.goToPaymentPage();
    } else {
      this.deliveryPageResetDeliveryType();
    }
  }

  /**
   * If the error is returned by get store details  no redirect to L1 default
   */
  handleL1Redirect = () => {
    if (!this.currentPage.paymentStore && !this.currentPage.deliveryStore) {
      this.goToL1Page();
    }
  }

  /**
   * Go to delivery page -> do PIB and load delivery_selectable -> show address form
   */
  deliveryPageAddressForm = () => this.goToDeliveryPage()
    .then(() => this.dispatch(cartActions.bookAndLoadDeliveryOptions(this.params.brand)))
    .then(() => this.dispatch(deliveryActions.toggleDeliveryEdit(false)));

  /**
   * Go to delivery page -> show address book
   */
  deliveryPageShowAddressBook = () => {
    this.dispatch(deliveryActions.reloadDeliveryMethodOptions());

    return this.goToDeliveryPage()
      .then(() => {
        this.dispatch(deliveryActions.setDeliveryMethodOption(SHIPPING));
        this.dispatch(deliveryActions.saveAndContinue());
        this.dispatch(deliveryActions.toggleDeliveryEdit(false));
      });
  }

  /**
   * Reload order review page and set receipt_flg "0"
   */
  reviewOrderPageResetReceiptFlg = () => {
    this.dispatch(cartActions.setReceiptStatus(this.params.brand, negative));
    this.reloadReviewOrderPage();
  }

  removeGiftCardSelection = () => {
    const customErrorKey = this.errorHandler && this.errorHandler.customErrorKey;
    const hasGiftCardInfoList = this.error.response && Array.isArray(this.error.response.card_info_list);
    const errorCodeMessages = this.getMessage()[this.error.resultCode];
    const errorMessage = errorCodeMessages && (
      errorCodeMessages.hasOwnProperty(this.apiMethod)
        ? errorCodeMessages[this.apiMethod]
        : errorCodeMessages.DEFAULT
    );

    const removeSelection = () =>
      this.dispatch(removeAllGiftCards(true)).catch(() => true)
      .then(() => this.dispatch(resetGiftCards()))
      .then(() => this.dispatch(setPaymentMethod('')))
      .then(() => {
        if (errorMessage) {
          this.dispatch(pushAPIErrorMessage(errorMessage, this.errorHandler.customErrorKey));
        }

        return Promise.resolve;
      })
      .then(() => this.dispatch(getPaymentMethodsSelectable()));

    if (
      customErrorKey === 'setPaymentMethod' ||
      customErrorKey === 'verifyGiftCard' ||
      customErrorKey === 'applyGiftCard'
    ) {
      removeSelection();
    } else if (customErrorKey === 'loadGiftCards' && hasGiftCardInfoList) {
      this.dispatch(updateFailedGiftCards(this.error));
      removeSelection();
    }

    scrollToTop();
  }

  setSplitDeliveryResetPayment = () => {
    const { delivery: { deliveryMethod }, giftCard } = this.state;
    const removeGiftCards = () => (
      giftCard
        ? this.dispatch(removeAllGiftCards(true)).catch(() => true)
          .then(() => this.dispatch(resetGiftCards()))
        : Promise.resolve()
      );

    return removeGiftCards()
    .then(() => this.dispatch(setPaymentMethod('')))
    .then(() => this.dispatch(deliveryActions.setDeliveryMethods(deliveryMethod, SPLIT_DELIVERY)))
    .then(() => this.dispatch(cartActions.bookProvisionalInventory(this.params.brand)))
    .then(() => this.goToPaymentPage());
  }

  handleGetRequestLoginError = () => {
    const { customErrorKey, isFakeError } = this.errorHandler;
    const { orderList } = this.state.order;

    if (
      this.currentPage.confirmOrder &&
      customErrorKey === 'getOrderDetails' &&
      orderList && orderList.length
    ) {
      // We have a order cookie possibly from a different user's order
      this.dispatch(orderActions.removeOrderCookie());
      this.goToCartPage();
    } else if (!isFakeError) {
      this.logoutAndGoToLogin();
    }
  }

  /**
   * Remove a coupon from server.
   */
  couponDelete = () => this.dispatch(removeACoupon(this.params.coupon.id));

  abortApplePayAndGoToCart = () => {
    this.abortApplePaySession();

    return this.goToCartPage();
  }

  paymentSheetPostalCodeError = () => {
    const postalCodeErrorList = this.error && this.error.dtlList || [];
    const code = postalCodeErrorList.length && postalCodeErrorList[0].messageCode;
    const errorCodeMessages = this.getMessage();
    let errorMessage = errorCodeMessages[code] && errorCodeMessages[code].DEFAULT;

    if (!errorMessage) {
      return this.abortApplePayAndGoToCart();
    }

    if (!(['118', '101'].includes(code))) {
      errorMessage = errorCodeMessages.APPLE_PAY_PAYMENT_SHEET && errorCodeMessages.APPLE_PAY_PAYMENT_SHEET.DEFAULT;
      this.dispatch(pushAPIErrorMessage(errorMessage, this.errorHandler.customErrorKey));

      return this.abortApplePayAndGoToCart();
    }

    const isVersion3 = applePayVersion === 3;
    const cart = cartActions.getCart(this.state, this.params.brand);
    const total = {
      label: getTranslation().cart.total,
      amount: cart.orderSummary.paymentsAmt,
    };
    const newLineItems = getLineItems(cart.orderSummary);
    const argsArray = isVersion3 ? [{
      errors: [
        new window.ApplePayError(
          'shippingContactInvalid',
          'postalCode',
          errorMessage,
        ),
      ],
      newLineItems,
      newShippingMethods: [],
      newTotal: total,
    }] : [
      window.ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
      [],
      total,
      newLineItems,
    ];

    return this.applePaySession.completeShippingContactSelection(...argsArray);
  }

  abortApplePayDeleteLocalCartAndGoToCart = () => {
    this.deleteLocalCart();

    return this.abortApplePayAndGoToCart();
  }

  abortApplePayAndGoToLogin = () => {
    this.abortApplePaySession();

    return this.goToLogin();
  }

  abortApplePayAndShowPopUp = () => {
    this.abortApplePaySession();

    return this.dispatch(toggleApplePayLoginPopup());
  }

  handleDetailedErrorsAbortApplePayAndGoToCart = () => {
    const errorList = this.error.response && this.error.response.cartDtlList || [];

    if (errorList.length) {
      const cart = cartActions.getCart(this.state, this.params.brand);
      const allL2Codes = cart.items.map(item => item.l2Code);
      const detailedErrorMessages = allL2Codes.map((l2Code) => {
        const error = errorList.find(item => item.l2_goods_cd === l2Code);
        // 2231, 2217, 2218, 2219, 2220, 2221, 2231
        const errorCode = error && error.detailResultCode;
        const errorMessages = this.getMessage();
        const errorMessage = errorMessages[errorCode] && (
          errorMessages[errorCode].hasOwnProperty(this.apiMethod)
            ? errorMessages[errorCode][this.apiMethod]
            : errorMessages[errorCode].DEFAULT
        );

        return { [l2Code]: errorMessage };
      });

      this.dispatch(pushDetailedErrorMessage(detailedErrorMessages, 'cartItems'));
    }

    return this.abortApplePayAndGoToCart();
  }

  handleInventoryErrorsAbortApplePayAndGoToCart = () => {
    const errorList = this.error.response && this.error.response.cartDtlList || [];

    if (errorList.length) {
      this.dispatch(cartActions.updateItemsInventoryStatus(this.params.brand, errorList));
    }

    return this.abortApplePayAndGoToCart();
  }
}
