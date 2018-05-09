import { createSelector } from 'reselect';
import { routes } from 'utils/urlPatterns';
import { getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import { required } from 'utils/validation';
import {
  getReceiptFlag,
  getBillingAddress,
  getCartPaymentType,
  getCartShippingAddress,
  getTotalAmount,
  getCart,
} from 'redux/modules/cart/selectors';
import {
  getGiftCards,
  getCreditCard,
  getCreditInfo,
  getAppliedStore,
  isCreditCardValid,
} from 'redux/modules/checkout/payment/selectors';
import { getDeliveryMethodList, getDeliveryMethod, getDeliveryPreference } from 'redux/modules/checkout/delivery/selectors';
import { getOrder } from 'redux/modules/checkout/order/selectors';
import defaultConstants from 'config/site/default';

const {
  gds,
  payment: paymentConfig,
  pages: { REVIEW_ORDER },
} = defaultConstants;

const getPaymentTypeFromProps = (state, props) => props.paymentType;

/**
 * Return is receipt is required
 */
export const isReceiptRequired = createSelector(
  [getReceiptFlag, getCartPaymentType],
  (receiptFlag, paymentType) => (
    receiptFlag === gds.positive &&
    paymentType !== paymentConfig.uniqloStore &&
    paymentType !== paymentConfig.cashOnDelivery &&
    paymentType !== paymentConfig.postPay
  )
);

/**
 * Get coupons link
 */
export const getCouponsLink = (state) => {
  const brand = getCurrentBrand(state);

  return getUrlWithQueryData(routes.coupons, { from: REVIEW_ORDER, brand });
};

/**
 * Check if credit required
 */
export const isCreditRequired = createSelector(
  [getCartPaymentType, getGiftCards, getTotalAmount],
  (paymentType, giftCards, totalAmount) => {
    if (paymentType === paymentConfig.creditCard && giftCards && giftCards.length) {
      return totalAmount === giftCards.reduce((prev, current) => parseInt(current.payment, 10) + prev, 0);
    }

    return false;
  }
);

/**
 * Check if credit required
 */
export const isCreditCardSaved = ({ payment }) => !!(
  payment.creditInfo
  && payment.creditInfo.maskedCardNo
  && payment.creditInfo.dbKey
);

/**
 * Segment 0: onLoad Delivery Validation
 * Checks:
 *     - No First Katakana name (To ensure shipping Address)
 *     - Invalid Delivery Type for current cart
 */
export const isValidDelivery = createSelector(
  [getCartShippingAddress, getDeliveryMethodList, getDeliveryMethod, getDeliveryPreference],
  (shippingAddress, deliveryMethodList, deliveryMethods, deliveryPreference) => {
    const isValid = deliveryMethods.every((deliveryMethod) => {
      const { splitNo, deliveryType } = deliveryMethod;
      const availableDeliveryMethods = deliveryMethodList
        && deliveryMethodList[splitNo]
        && deliveryMethodList[splitNo][deliveryPreference]
        && deliveryMethodList[splitNo][deliveryPreference].deliveryTypes;

      return availableDeliveryMethods && availableDeliveryMethods.includes(deliveryType);
    });

    return !(required(shippingAddress && shippingAddress.firstNameKatakana) || !isValid);
  }
);

/**
 * Segment 0: onLoad Payment Verification
 * Checks:
 *     - No Billing Email ( To ensure billing Address)
 *     - Credit Card without card number
 *     - Invalid Payment Method for current cart
 */
export const isValidPayment = createSelector(
  [getBillingAddress, getCreditCard, getCreditInfo, isCreditRequired, getAppliedStore, getCartPaymentType],
  (billingAddress, creditCard, creditInfo, isAmountCoveredInCard, appliedStore, paymentType) => {
    let creditCardInformation = creditInfo;

    if (creditCard.ccLastFourDigits) {
      creditCardInformation = creditCard;
    }

    return !(
      required(billingAddress && billingAddress.email) || (
        paymentType === paymentConfig.creditCard
        && !isAmountCoveredInCard
        && (
          required(creditCardInformation.maskedCardNo || creditCardInformation.ccLastFourDigits) ||
          (creditCardInformation.ccLastFourDigits && required(creditCardInformation.cardCvv))
        )
      ) ||
      (paymentType === paymentConfig.uniqloStore && !appliedStore)
    );
  }
);

export const isPaymentWithCreditCard = createSelector(
  [getCartPaymentType, getCreditCard],
  (paymentType, creditCard) =>
  !!(paymentType === paymentConfig.creditCard && creditCard.ccLastFourDigits)
);

export const getIfPayAtStoreSelected = createSelector(
  [getPaymentTypeFromProps, getAppliedStore],
  (paymentType, appliedStore) => !!(paymentType === paymentConfig.uniqloStore && appliedStore)
);

/**
 * Check if payment type selected is credit card or gift card
 */
export const isPaymentGiftCardOrCreditCard = createSelector(
  [getCartPaymentType],
  paymentType => ([paymentConfig.giftCard, paymentConfig.creditCard].includes(paymentType))
);

/**
 * Checks if there's a difference in the total
 */
export const isTotalUpdated = createSelector(
  [getOrder],
  order => order.difference.delta !== 0
);

/**
 * Returns the selected credit card.
 */
export const getSelectedCreditCard = createSelector(
  [isCreditCardSaved, getCreditInfo, getCreditCard, isCreditCardValid],
  (isCardSaved, savedCreditCard, newCreditCard, isNewCardValid) => {
    // If the saved card is selected OR if (when refreshing review order apge)
    // there's not a valid temporal credit card we need to return the saved one.
    if (isCardSaved && savedCreditCard.selected || !isNewCardValid) {
      return savedCreditCard;
    }

    return newCreditCard;
  }
);

/**
 * Checks if the selected credit card contains a valid CVV number.
 * We use this selector to show the input field
 */
export const isSelectedCreditCardApplied = createSelector(
  [getSelectedCreditCard],
  card => (card.cvv && card.cvv.length >= 3 || card.cardCvv && card.cardCvv.length >= 3)
);

/**
 * Return true if receipt checkbox is visible
 */
export const isReceiptVisible = createSelector(
  [getCartPaymentType, getCart],
  (paymentType, cart) => (
    paymentType !== paymentConfig.uniqloStore &&
    paymentType !== paymentConfig.cashOnDelivery &&
    paymentType !== paymentConfig.postPay &&
    !cart.hasGift
  )
);
