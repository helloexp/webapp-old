import noop from 'utils/noop';
import scrollToTop from 'utils/scroll';
import iff from 'utils/iff';

/**
 * <errorCode, <REST_method, reaction> >
 * mappings for cart and checkout API errors.
 */
export default function cncReactions() {
  const {
    currentPage: {
      cart: isCartPage,
      reviewOrder: isReviewOrderPage,
      delivery: isDeliveryPage,
      payment: isPaymentPage,
      coupons: isCouponsPage,
      creditCard: isCreditCardPage,
      checkout: isCheckout,
      confirmOrder: isOrderConfirm,
      orderCancel: isOrderCancelPage,
    },
    cartPageDeleteLocalCart,
    cartPageDeleteCart,
    deleteLocalAndCreateNewCart,
    deleteLocalCart,
    goToCartPage,
    goToOrderHistory,
    deliveryPageResetDeliveryType,
    forceUserLogin,
    logoutAndGoToLogin,
    giftPageResetGiftCard,
    giftPageResetGiftMsg,
    goToReviewOrderPage,
    goToPaymentPage,
    deliveryPageResetDeliveryTypeUpdateGifting,
    goToL1Page,
    deliveryPageSetDeliveryTypeCVS,
    cancelOrder,
    reviewOrderPageRemoveOrder,
    handleDeliveryAndPaymentChange,
    goToAccountCreditCard,
    reloadPayment,
    handleL1Redirect,
    deliveryPageAddressForm,
    reviewOrderPageResetReceiptFlg,
    deliveryPageShowAddressBook,
    removeGiftCardSelection,
    setSplitDeliveryResetPayment,
    handleGetRequestLoginError,
    abortApplePayAndGoToCart,
    paymentSheetPostalCodeError,
    abortApplePayDeleteLocalCartAndGoToCart,
    abortApplePayAndGoToLogin,
    abortApplePayAndShowPopUp,
    handleDetailedErrorsAbortApplePayAndGoToCart,
    handleInventoryErrorsAbortApplePayAndGoToCart,
    closeUserRegistrationPopup,
    errorHandler: { customErrorKey },
    queryParams: { cart_no: cartNo, token, from: fromQry },
    goToDeliveryPage,
  } = this;

  /**
   * LEGEND :)
   * ---------
   * D - DELETE
   * G - GET
   * P - POST
   * U - PUT (update)
   */
  const orderPageAction = isReviewOrderPage
    ? goToCartPage : deleteLocalCart;

  const noCartPostAction = isCouponsPage || isOrderConfirm || isReviewOrderPage || isPaymentPage
    ? cartPageDeleteLocalCart
    : orderPageAction;

  const deleteCartAction = (cartNo && token) ? cartPageDeleteLocalCart : cartPageDeleteCart;

  return {
    '5xx': {
      G: customErrorKey === 'couponLoad' ? noop : handleL1Redirect,
      DEFAULT: iff(
        customErrorKey === 'registerUserAddress',
        closeUserRegistrationPopup,
        goToL1Page,
      ),
    },
    out_of_range: {
      P: isDeliveryPage && deliveryPageShowAddressBook,
    },
    0: {
      DEFAULT: noop,
    },
    401: {
      DEFAULT: customErrorKey === 'registerUserAddress' && closeUserRegistrationPopup,
    },
    422: {
      DEFAULT: iff(
        customErrorKey === 'registerUserAddress',
        closeUserRegistrationPopup,
        noop,
      ),
    },
    1001: {
      DEFAULT:
      iff(customErrorKey === 'applePayOrder',
        abortApplePayAndGoToCart,
        iff(customErrorKey === 'applePayPIB',
          paymentSheetPostalCodeError,
          iff(customErrorKey === 'loadSplitDetails',
            noop,
            iff(customErrorKey === 'saveShippingAddress',
              goToDeliveryPage,
              isCheckout && deliveryPageAddressForm,
            )
          ),
        ),
      ),
    },
    2001: {
      G: isPaymentPage && customErrorKey === 'blueGateCreditCardError' && scrollToTop,
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
      U: abortApplePayAndGoToCart,
    },
    2002: {
      G: goToPaymentPage,
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
      U: customErrorKey === 'applePayPIB' && abortApplePayAndGoToCart,
    },
    2101: {
      D: cartPageDeleteLocalCart,
      G: cartPageDeleteLocalCart,
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayDeleteLocalCartAndGoToCart : noCartPostAction,
      // U: applePayPIB
      U: iff(
          isCartPage,
          iff(customErrorKey === 'applePayPIB', abortApplePayDeleteLocalCartAndGoToCart, deleteLocalCart),
          cartPageDeleteLocalCart,
        ),
    },
    2102: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
    },
    2103: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
    },
    2104: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
    },
    2107: {
      G: (
        isDeliveryPage ||
        (customErrorKey === 'loadGiftCards' && isPaymentPage)
      ) ? noop : goToPaymentPage,
      U: goToPaymentPage,
      D: goToPaymentPage,
    },
    2108: {
      P: goToCartPage,
      G: !isCheckout && goToPaymentPage,
    },
    2110: {
      G: goToCartPage,
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
    },
    2112: {
      P: goToPaymentPage,
    },
    2114: {
      U: goToCartPage,
      D: goToCartPage,
    },
    2116: {
      G: isPaymentPage ? noop : goToOrderHistory,
      D: goToOrderHistory,
    },
    2123: {
      G: deliveryPageSetDeliveryTypeCVS,
    },
    2124: {
      // G: loadSplitDetails
      G: noop,
      U: customErrorKey === 'applePayPIB' && abortApplePayAndGoToCart,
    },
    2201: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
      // U: applePayPIB
      U: customErrorKey === 'applePayPIB' ? abortApplePayAndGoToCart : goToCartPage,
    },
    2202: {
      P: iff(
          customErrorKey === 'applePayOrder',
          abortApplePayAndGoToCart,
          (isReviewOrderPage || customErrorKey === 'backToCart') ? goToCartPage : noop
        ),
      // U: applePayPIB
      U: iff(
        customErrorKey === 'applePayPIB',
        abortApplePayAndGoToCart,
        isCheckout ? goToCartPage : scrollToTop
      ),
      G: goToCartPage,
    },
    2203: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
      // U: applePayPIB
      U: iff(
          customErrorKey === 'applePayPIB',
          abortApplePayAndGoToCart,
          isCheckout ? goToCartPage : scrollToTop
        ),
    },
    2204: {
      P: iff(
          customErrorKey === 'applePayOrder',
          abortApplePayAndGoToCart,
          iff(
            isPaymentPage,
            goToCartPage,
            deliveryPageResetDeliveryType,
          )
        ),
      U: (isPaymentPage || isDeliveryPage) && customErrorKey !== 'setDeliveryType' ? goToCartPage : deliveryPageResetDeliveryType,
    },
    2205: {
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
      U: customErrorKey === 'setBillingAddress' ? noop : deliveryPageResetDeliveryType,
    },
    2206: {
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
      U: iff(
        isCartPage,
        iff(customErrorKey === 'applePayPIB', abortApplePayAndGoToCart, noop),
        goToCartPage,
      ),
    },
    2207: {
      D: logoutAndGoToLogin,
      G: handleGetRequestLoginError,
      P: logoutAndGoToLogin,
      // U: applePayPIB
      U: customErrorKey === 'applePayPIB' ? abortApplePayAndGoToLogin : logoutAndGoToLogin,
    },
    2208: {
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
      U: deliveryPageResetDeliveryType,
    },
    2209: {
      P: deliveryPageResetDeliveryType,
      U: deliveryPageResetDeliveryType,
    },
    2210: {
      P: deliveryPageResetDeliveryType,
      U: isDeliveryPage
          ? deliveryPageResetDeliveryType
          : deliveryPageResetDeliveryTypeUpdateGifting,
    },
    2211: {
      P: deliveryPageResetDeliveryType,
      U: handleDeliveryAndPaymentChange,
    },
    2212: {
      P: deliveryPageResetDeliveryType,
      U: handleDeliveryAndPaymentChange,
    },
    2213: {
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToReviewOrderPage,
      U: deliveryPageResetDeliveryType,
    },
    2214: {
      P: goToPaymentPage,
      U: goToPaymentPage,
    },
    2215: {
      P: goToPaymentPage,
      U: goToPaymentPage,
    },
    2216: {
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToReviewOrderPage,
    },
    2217: {
      U: noop,
    },
    2227: {
      P: isReviewOrderPage ? noop : goToPaymentPage,
      // Order is deleted by GDS server
      G: goToPaymentPage,
    },
    2232: {
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
    },
    2237: {
      P: goToPaymentPage,
    },
    2238: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
    },
    2239: {
      G: (customErrorKey === 'loadGiftCards' && isPaymentPage) ? noop : goToPaymentPage,
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToPaymentPage,
      U: customErrorKey === 'applePayPIB' ? abortApplePayAndGoToCart : goToPaymentPage,
    },
    2240: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToPaymentPage,
    },
    2241: {
      G: goToPaymentPage,
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToPaymentPage,
      U: goToPaymentPage,
    },
    2242: {
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToPaymentPage,
      G: isCreditCardPage ? noop : goToPaymentPage,
    },
    2243: {
      P: iff(
          customErrorKey === 'applePayOrder',
          abortApplePayAndGoToCart,
          customErrorKey === 'placeOrder' && goToReviewOrderPage
        ),
      G: isCreditCardPage ? noop : goToPaymentPage,
    },
    2244: {
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : goToPaymentPage,
      G: isCreditCardPage ? noop : goToPaymentPage,
    },
    2245: {
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToPaymentPage,
      G: isCreditCardPage ? noop : goToPaymentPage,
    },
    2246: {
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : goToPaymentPage,
      G: isCreditCardPage ? noop : goToPaymentPage,
    },
    2251: {
      P: goToPaymentPage,
    },
    2252: {
      P: deliveryPageResetDeliveryType,
    },
    2254: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToReviewOrderPage,
    },
    2255: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToPaymentPage,
      G: goToPaymentPage,
    },
    2256: {
      G: isPaymentPage ? noop : goToOrderHistory,
      D: goToOrderHistory,
    },
    2257: {
      G: isPaymentPage ? noop : goToOrderHistory,
      D: goToOrderHistory,
    },
    2258: {
      G: logoutAndGoToLogin,
      D: logoutAndGoToLogin,
    },
    2259: {
      G: isPaymentPage ? noop : goToOrderHistory,
      D: goToOrderHistory,
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
    },
    2260: {
      G: isPaymentPage ? noop : goToOrderHistory,
      D: goToOrderHistory,
    },
    2262: {
      P: goToPaymentPage,
    },
    2263: {
      P: goToPaymentPage,
      G: goToPaymentPage,
    },
    2264: {
      P: goToPaymentPage,
      G: goToPaymentPage,
    },
    2265: {
      P: customErrorKey === 'placeOrder' && goToPaymentPage,
      G: goToReviewOrderPage,
    },
    2266: {
      G: isOrderCancelPage ? goToOrderHistory : cancelOrder,
      D: goToOrderHistory,
      P: goToReviewOrderPage,
    },
    2267: {
      G: goToAccountCreditCard,
      P: goToAccountCreditCard,
    },
    2272: {
      P: deliveryPageResetDeliveryType,
      U: isDeliveryPage ? deliveryPageResetDeliveryType : goToPaymentPage,
    },
    2273: {
      P: goToPaymentPage,
      U: goToPaymentPage,
    },
    2274: {
      P: deliveryPageResetDeliveryType,
      U: goToPaymentPage,
    },
    2275: {
      P: deliveryPageResetDeliveryType,
      U: goToPaymentPage,
    },
    2276: {
      P: deliveryPageResetDeliveryType,
      U: goToPaymentPage,
    },
    2277: {
      P: goToPaymentPage,
      U: goToPaymentPage,
    },
    2279: {
      P: goToPaymentPage,
    },
    2280: {
      G: isPaymentPage ? noop : goToOrderHistory,
      D: goToOrderHistory,
    },
    2281: {
      P: goToPaymentPage,
    },
    2282: {
      U: deliveryPageResetDeliveryTypeUpdateGifting,
      P: deliveryPageResetDeliveryTypeUpdateGifting,
    },
    2284: {
      U: giftPageResetGiftMsg,
    },
    2285: {
      U: giftPageResetGiftCard,
    },
    2287: {
      G: reviewOrderPageRemoveOrder,
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
    },
    2288: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : !isCouponsPage && goToReviewOrderPage,
      G: reviewOrderPageRemoveOrder,
    },
    2289: {
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
    },
    2290: {
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
    },
    2291: {
      G: reviewOrderPageRemoveOrder,
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : !isCouponsPage && goToReviewOrderPage,
    },
    2292: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
    },
    2293: {
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
    },
    2294: {
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
    },
    2295: {
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
    },
    2296: {
      G: reviewOrderPageRemoveOrder,
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : goToReviewOrderPage,
    },
    2297: {
      G: reviewOrderPageRemoveOrder,
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : goToReviewOrderPage,
    },
    2298: {
      U: goToCartPage,
    },
    2299: {
      D: goToCartPage,
    },
    2300: {
      P: customErrorKey === 'applePayOrder' && abortApplePayAndGoToCart,
    },
    2301: {
      // P: backToCart
      D: cartPageDeleteLocalCart,
      // G: loadSplitDetails and others
      G: cartPageDeleteLocalCart,
      P: iff(
          isCartPage,
          iff(
            customErrorKey === 'applePayOrder',
            abortApplePayDeleteLocalCartAndGoToCart,
            deleteLocalAndCreateNewCart
          ),
          cartPageDeleteLocalCart
        ),
      U: iff(
          isCartPage,
          iff(customErrorKey === 'applePayPIB', abortApplePayDeleteLocalCartAndGoToCart, deleteLocalCart),
          cartPageDeleteLocalCart,
        ),
    },
    2302: {
      G: isPaymentPage ? noop : goToOrderHistory,
      D: goToOrderHistory,
    },
    2303: {
      DEFAULT: ['applePayPIB', 'applePayOrder'].includes(customErrorKey) ? abortApplePayAndShowPopUp : forceUserLogin,
    },
    2306: {
      U: cartPageDeleteLocalCart,
    },
    2307: {
      U: cartPageDeleteLocalCart,
    },
    2401: {
      G: customErrorKey === 'loadGiftCards' && isCheckout ? noop : goToPaymentPage,
    },
    2402: {
      D: goToCartPage,
      G: (customErrorKey === 'loadSplitDetails' || !isCartPage) ? goToCartPage : deleteCartAction,
      P: iff(
          customErrorKey === 'applePayOrder',
          abortApplePayAndGoToCart,
          iff(
            customErrorKey === 'backToCart' || isCouponsPage,
            noop,
            goToCartPage,
          )
        ),
      U: customErrorKey === 'applePayPIB' ? abortApplePayAndGoToCart : goToCartPage,
    },
    2403: {
      G: isPaymentPage ? noop : goToOrderHistory,
      D: goToOrderHistory,
    },
    2406: {
      P: goToCartPage,
    },
    2408: {
      U: goToPaymentPage,
    },
    2409: {
      P: deliveryPageResetDeliveryType,
      U: deliveryPageResetDeliveryType,
    },
    2410: {
      G: reviewOrderPageRemoveOrder,
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : goToReviewOrderPage,
      // U: applePayPIB
      U: customErrorKey === 'applePayPIB' && abortApplePayAndGoToCart,
    },
    2411: {
      G: reviewOrderPageRemoveOrder,
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : goToReviewOrderPage,
    },
    2414: {
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : deliveryPageResetDeliveryType,
      U: deliveryPageResetDeliveryType,
    },
    2415: {
      P: deliveryPageResetDeliveryType,
      U: deliveryPageResetDeliveryType,
    },
    2416: {
      P: deliveryPageResetDeliveryType,
      U: deliveryPageResetDeliveryTypeUpdateGifting,
    },
    2418: {
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : deliveryPageResetDeliveryType,
      U: deliveryPageResetDeliveryType,
    },
    2419: {
      P: deliveryPageResetDeliveryType,
      U: deliveryPageResetDeliveryType,
    },
    2420: {
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : deliveryPageResetDeliveryType,
      G: deliveryPageResetDeliveryType,
    },
    2421: {
      P: deliveryPageResetDeliveryType,
      U: isDeliveryPage ? deliveryPageResetDeliveryType : goToPaymentPage,
    },
    2422: {
      P: deliveryPageResetDeliveryType,
      U: deliveryPageResetDeliveryType,
    },
    2423: {
      U: customErrorKey === 'applePayPIB'
        ? abortApplePayAndGoToCart
        : !isCartPage && deliveryPageResetDeliveryType,
    },
    2424: {
      U: deliveryPageResetDeliveryType,
    },
    2425: {
      U: deliveryPageResetDeliveryType,
    },
    2426: {
      D: reloadPayment,
    },
    2427: {
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : deliveryPageResetDeliveryTypeUpdateGifting,
      U: deliveryPageResetDeliveryTypeUpdateGifting,
    },
    2428: {
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : deliveryPageResetDeliveryTypeUpdateGifting,
      U: deliveryPageResetDeliveryTypeUpdateGifting,
    },
    2429: {
      P: customErrorKey === 'applePayOrder'
        ? abortApplePayAndGoToCart
        : deliveryPageResetDeliveryType,
      U: deliveryPageResetDeliveryType,
    },
    2430: {
      G: customErrorKey === 'loadGiftCards' && goToPaymentPage,
      P: (customErrorKey === 'placeOrder' || customErrorKey === 'verifyGiftCard') && goToPaymentPage,
    },
    2431: {
      P: customErrorKey === 'placeOrder' && reviewOrderPageResetReceiptFlg,
    },
    2432: {
      P: iff(
          customErrorKey === 'applePayOrder',
          abortApplePayAndGoToCart,
          customErrorKey === 'placeOrder' && reviewOrderPageResetReceiptFlg
        ),
    },
    2433: {
      P: deliveryPageResetDeliveryType,
      U: deliveryPageResetDeliveryType,
    },
    2434: {
      // G: loadGiftCards ■ U: setPaymentMethod ■ P: placeOrder, verifyGiftcard
      DEFAULT: removeGiftCardSelection,
      P: customErrorKey === 'placeOrder' ? goToPaymentPage : removeGiftCardSelection,
      D: noop,
    },
    2435: {
      P: customErrorKey === 'placeOrder' && reviewOrderPageResetReceiptFlg,
    },
    2436: {
      P: customErrorKey === 'placeOrder' && goToPaymentPage,
      U: customErrorKey === 'setPaymentMethod' && goToPaymentPage,
    },
    2437: {
      P: customErrorKey === 'placeOrder' && deliveryPageResetDeliveryType,
      U: customErrorKey === 'setPaymentMethod' && deliveryPageResetDeliveryType,
    },
    2438: {
      P: customErrorKey === 'placeOrder' && deliveryPageResetDeliveryType,
      U: customErrorKey === 'setPaymentMethod' && deliveryPageResetDeliveryType,
    },
    2440: {
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
    },
    2441: {
      // G: loadGiftCards ■ P: verifyGiftCard, placeOrder ■ U: setDeliveryType (?)
      DEFAULT: goToPaymentPage,
      D: noop,
      G: (customErrorKey === 'loadGiftCards' && isPaymentPage) ? noop : goToPaymentPage,
    },
    2442: {
      // P: addACoupon, placeOrder ■ U: setDeliveryType (?)
      DEFAULT: (customErrorKey === 'coupon' && fromQry === 'cart') ? goToCartPage : goToPaymentPage,
      D: noop,
      G: noop,
    },
    2443: {
      // U: adding gifting option, setDeliveryType (?) ■ P: placeOrder
      DEFAULT: deliveryPageResetDeliveryTypeUpdateGifting,
      G: noop,
      D: noop,
    },
    2444: {
      // ■ P: placeOrder
      DEFAULT: goToPaymentPage,
      D: noop,
      G: noop,
      U: setSplitDeliveryResetPayment,
    },
    2445: {
      // P: placeOrder
      P: deliveryPageResetDeliveryType,
      // U: setDeliveryType (?)
      U: deliveryPageResetDeliveryType,
    },
    2448: {
      // P: placeOrder ■ U: setDeliveryType (?)
      DEFAULT: deliveryPageResetDeliveryType,
      G: noop,
      D: noop,
    },
    2449: {
      // P: placeOrder ■ U: setDeliveryType (?)
      DEFAULT: deliveryPageResetDeliveryType,
      G: noop,
      D: noop,
    },
    2451: {
      // P: placeOrder
      P: goToPaymentPage,
    },
    2456: {
      // P: placeOrder
      P: deliveryPageResetDeliveryType,
    },
    2457: {
      P: abortApplePayAndGoToCart,
    },
    2458: {
      // P: applePayOrder
      P: abortApplePayAndGoToCart,
    },
    2459: {
      P: abortApplePayAndGoToCart,
      U: abortApplePayAndGoToCart,
    },
    2460: {
      D: noop,
      G: noop,
      // U: applePayPIB ■ P: applePayOrder
      DEFAULT: abortApplePayAndGoToCart,
    },
    3001: {
      D: noop,
      DEFAULT: (customErrorKey === 'applePayPIB' || customErrorKey === 'applePayOrder')
        ? handleDetailedErrorsAbortApplePayAndGoToCart
        : goToCartPage,
    },
    3002: {
      P: goToCartPage,
      U: customErrorKey === 'applePayPIB' ? handleInventoryErrorsAbortApplePayAndGoToCart : goToCartPage,
    },
    3003: {
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
      DEFAULT: customErrorKey === 'applePayPIB' ? abortApplePayAndGoToCart : goToCartPage,
    },
    3004: {
      U: iff(
        customErrorKey === 'applePayPIB',
        abortApplePayAndGoToCart,
        isCheckout ? goToCartPage : noop
      ),
      P: customErrorKey === 'applePayOrder' ? abortApplePayAndGoToCart : goToCartPage,
    },
  };
}
