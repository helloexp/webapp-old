import { createSelector } from 'reselect';
import config from 'config';
import getSiteConfig from 'config/site';
import { getTranslation } from 'i18n';
import { isValidCreditCard } from 'utils/validation';
import { compareAddresses } from 'utils/compare';
import CardValidator from 'utils/CardValidator';
import { mergeObjects } from 'utils/mergeObjects';
import {
  getCreditInfo,
  getPaymentMethod,
  getBillingAddress,
  checkIfIsEditAddress,
  getCreditCard,
  getGiftCards,
  hasIncompleteBillingAddress,
  isSaveCreditCardChecked,
} from 'redux/modules/checkout/payment/selectors';
import { getCurrentShippingAddress, isSplitDeliverySelected } from 'redux/modules/checkout/delivery/selectors';
import { getGiftCardFlag } from 'redux/modules/cart/selectors';

const siteConfig = getSiteConfig(config.region);

/**
 * TODO: move this function to corresponding selectors file
 * Get user default details
 */
const getUserDefaultDetails = state => state.userInfo.userDefaultDetails;

/**
 * TODO: change name to better one
 */
export const isPositiveGiftCardFlagAndGiftCardsExist = createSelector(
  [getGiftCardFlag, getGiftCards],
  (giftCardFlag, giftCards) =>
    giftCardFlag === siteConfig.gds.positive && giftCards.length);

/**
 * Check if credit card payment method is selected
 */
export const isSelected = createSelector(
  [getPaymentMethod],
  paymentMethod => paymentMethod === siteConfig.payment.creditCard);

/**
 * Get section title
 */
export const getBoxTitle = createSelector(
  [isPositiveGiftCardFlagAndGiftCardsExist, getTranslation],
  (isPositive, i18n) =>
    (isPositive
      ? i18n.payWithGiftCard.payBalanceWithCreditCard
      : i18n.payment.payWithCreditCard));

/**
 * Check if address form should be shown
 */
export const isAddressFormVisible = createSelector(
  [checkIfIsEditAddress, hasIncompleteBillingAddress],
  (isEditAddress, hasIncompleteBillingAddresss) =>
    isEditAddress || hasIncompleteBillingAddresss
  );

/**
 * Validates the current credit card number
 */
export const isCreditCardNumberValid = createSelector(
  [getCreditCard, getCreditInfo],
  (creditCard, cardSavedOnBluGate) => {
    const result = CardValidator.number(creditCard.ccLastFourDigits);

    // If we have a credit card saved on bluegate
    if (cardSavedOnBluGate && cardSavedOnBluGate.dbKey) {
      // The user might be using a different credit card, if that's the case
      // we need to validate the credit card number
      if (creditCard.ccLastFourDigits) {
        return result.isValid;
      }

      // If there's not a new credit card typed by the user
      // The card number on blugate is valid for sure!
      return true;
    }

    // If there's not a credit card on bluegate, this card is new,
    // therefore we need to validate the number.
    return result.isValid;
  }
);

/**
 * Check if credit card is validation
 */
export const isCreditCardValid = createSelector(
  [getCreditCard],
  creditCard => isValidCreditCard(creditCard)
);

/**
 * Get current billing address
 */
export const getCurrentBillingAddress = createSelector(
  [getUserDefaultDetails, getBillingAddress],
  (userDefaultDetails, billingAddress) => mergeObjects({
    keys: Object.keys({ ...userDefaultDetails, ...billingAddress }),
    primObj: billingAddress,
    secObj: userDefaultDetails,
    considerEmpty: true,
  })
);
/**
 * TODO: change name to better one
 */
export const isCreditCardHasTypeAndLastFourDigits = createSelector(
  [getCreditCard],
  creditCard => !!(creditCard.cardType && creditCard.ccLastFourDigits));

export const isSetToAddressBook = createSelector(
  [getCurrentShippingAddress, getUserDefaultDetails, getCurrentBillingAddress],
  (currentShippingAddress, userDefaultDetails, currentBillingAddress) =>
    compareAddresses(currentShippingAddress, userDefaultDetails)
      && !compareAddresses(currentShippingAddress, currentBillingAddress));

export const isCreditCardNotApplicable = createSelector(
  [isCreditCardValid, isSplitDeliverySelected, isSaveCreditCardChecked],
  (isCCValid, isSplitDelivery, isSaveCreditCard) =>
    (!isCCValid || (isSplitDelivery && !isSaveCreditCard))
);

export const isTemporalCCExistsAndIsInvalid = createSelector(
  [getCreditCard, isCreditCardValid], (creditCard, isCCValid) => !!(creditCard.ccLastFourDigits && creditCard.cardCvv && !isCCValid)
);
