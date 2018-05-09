import { createSelector } from 'reselect';
import { isValidCreditCard } from 'utils/validation';
import { mergeObjects } from 'utils/mergeObjects';
import { isCreditCardSaved } from 'utils/CardValidator/bluegate';
import { getCustomErrors } from 'redux/modules/errorHandler/selectors';
import { getDeliveryMethodType, isSplitDeliverySelected } from 'redux/modules/checkout/delivery/selectors';
import { isStoreStaff } from 'redux/modules/checkout/delivery/store/selectors';
import { getBrand, getCartOrderSummary, getBillingAddress as getCartBillingAddress } from 'redux/modules/cart/selectors';
import { isBillingAddressIncompleted } from 'redux/modules/checkout/payment/actions';
import constants from 'config/site/default';

const { payment: method, deliveryTypes: { STORE_PICKUP } } = constants;

const getEditedGiftCard = state => state.giftCard.giftCard;

/**
 * Gets the selected payment method
 */
export const getPaymentMethod = state => state.payment.paymentMethod;

/**
 * Gets the selected payment methods from the server response
 */
export const getPaymentMethods = state => state.payment.paymentMethods;

export const getCreditInfo = state => state.payment.creditInfo;

export const getBillingAddress = state => state.payment.billingAddress;

export const checkIfIsEditAddress = state => state.payment.isEditAddress;

export const getBalancePaymentMethod = state => state.giftCard.balancePaymentMethod;

export const getGiftCards = state => state.giftCard.giftCards;

export const getCreditCard = state => state.creditCard;

export const getSelectedStore = state => state.paymentStore.selectedStore;

export const getAppliedStore = state => state.paymentStore.appliedStore;

export const getDefaultDetails = state => state.userInfo.userDefaultDetails;

export const isGiftCardsAvailable = state => !!(state.giftCard && state.giftCard.giftCards.length);

export const isSaveCreditCardChecked = state => !!state.creditCard.isSaveThisCard;

const getPaymentStoreDetail = state => state.paymentStore.paymentStoreDetail;

/**
 * Get the error messages for the payment page
 */
export const getErrorMessages = createSelector(
  [getCustomErrors],
  customErrors => ({
    blueGateCreditCardError: customErrors.blueGateCreditCardError,
    applyGiftCard: customErrors.applyGiftCard,
    placeOrder: customErrors.placeOrder,
    removeGiftCard: customErrors.removeGiftCard,
    loadGiftCards: customErrors.loadGiftCards,
    getPaymentType: customErrors.getPaymentType,
    verifyGiftCard: customErrors.verifyGiftCard,
  })
);

/**
 * Get the default billing address, this selector merges the default address on APF with the billing address on GDS
 * This selector is used internally on the GiftCard Form component.
 */
export const getCurrentBillingAddress = createSelector(
  [getDefaultDetails, getBillingAddress],
  (userInfo, billingAddress) => mergeObjects({
    keys: Object.keys({ ...userInfo, ...billingAddress }),
    primObj: billingAddress,
    secObj: userInfo,
    considerEmpty: true,
  })
);

/**
 * Generates the payment methods component to display on the payment page.
 */
export const getAvailablePaymentMethods = createSelector(
  [getPaymentMethods, getGiftCards, getBrand, getEditedGiftCard, isSplitDeliverySelected],
  (paymentMethods, giftCards, brand, activeGiftCard, isSplitDelivery) => {
    const availableMethods = [...paymentMethods];
    const methods = [];
    let key = 0;
    let shouldRenderForm = true;

    // Remove the giftcard method payment from the server response,
    // we will add it locally later on this same method. We need to remove it,
    // in order to avoid rendering the same component twice.
    if (availableMethods.includes(method.giftCard)) {
      availableMethods.splice(availableMethods.indexOf(method.giftCard), 1);
    }

    // 1.- Show applied giftcards at the top of the page
    giftCards.forEach((item) => {
      // Do not render the new giftcard form if there is
      // a pending giftcard to set the amount to pay. This case
      // applies when the user refresh the page without selecting the
      // actual amount to pay on the valid giftcard.
      if (item.payment === 0) {
        shouldRenderForm = false;
      }

      methods.push({
        method: method.giftCard,
        giftCard: item,
        key,
      });

      key += 1;
    });

    // 2. Show methods coming from server response
    availableMethods.forEach((available) => {
      // If there's credit card available, we need to add giftcard method as well.
      if (available === method.creditCard) {
        methods.push({
          method: method.creditCard,
          key,
        });

        // Add up to three giftcards for Uniqlo only
        if (giftCards.length < 3 && brand === 'uq' && !isSplitDelivery) {
          key += 1;
          const newGiftCardForm = {
            method: method.giftCard,
            key,
          };

          // If the user is editing an existing giftcard card
          if (activeGiftCard.index !== undefined && giftCards[activeGiftCard.index]) {
            // We render the form to add a new giftcard, only if the payment
            // of the active card is greater than zero
            if (giftCards[activeGiftCard.index].payment > 0) {
              methods.push(newGiftCardForm);
            }
          } else if (shouldRenderForm) {
            // We always render the form if the user is not editing an existing giftcard
            methods.push(newGiftCardForm);
          }
        }

      // If available payement type is pay-in-uniqloStore (type "B")
      } else if (available === method.uniqloStore) {
        // user should have a registered account address to select payment type "B"
        methods.push({
          method: method.uniqloStore,
          key,
        });
      } else {
        methods.push({
          method: available,
          key,
        });
      }

      key += 1;
    });

    if (!availableMethods.includes(method.postPay) && !isSplitDelivery) {
      methods.push({
        method: method.postPay,
        disabled: true,
        key,
      });
    }

    return methods;
  }
);

/**
 * Check if Uniqlo store payment method is selected
 * @param {Object} state - global state
 * @returns {boolean}
 */
export const isUniqloStorePaymentSelected = createSelector(
  [getPaymentMethod],
  paymentMethod =>
    (paymentMethod === method.uniqloStore));

/**
 * Check if the uniqlostore address has been selected for pay at store payment option
 * @param {object} state - global state
 * @returns {boolean}
 */
export const isUniqloStoreSelected = createSelector(
  [getAppliedStore],
  storeData => !!(storeData && storeData.name && storeData.city && storeData.municipality && storeData.number)
);

/**
 * Checks if giftcard payment is selected and if the payment user is paying
 * everything with giftcards only.
 */
export const isGiftCardFullPayment = createSelector(
  [getPaymentMethod, getCartOrderSummary],
  (paymentMethod, orderSummary) => paymentMethod === method.giftCard && orderSummary.giftCardPayment < orderSummary.total
);

/**
 * Checks if credit card in memory is valid or not.
 */
export const isCreditCardValid = createSelector(
  [getCreditCard],
  creditCard => isValidCreditCard(creditCard)
);

/**
 * Check if user has only an unsaved credit card
 */
export const isCreditCardUnsaved = createSelector(
  [getCreditInfo, isCreditCardValid],
  (savedCreditCard, isUnsavedCreditCardValid) => !isCreditCardSaved(savedCreditCard) && isUnsavedCreditCardValid,
);

export const hasIncompleteBillingAddress = createSelector(
  [getCartBillingAddress],
  billingAddress => isBillingAddressIncompleted(billingAddress)
);

/**
* Checks if the partial billing address form should be displayed or not for the uniqloStore payment method.
* We should show the form if there are no giftcards applied, billing address is incompleted and delivery method is STORE_PICKUP.
*/
export const shouldShowBillingAddressFormForNewUserStoresSelection = createSelector(
 [state => state.giftCard, getCartBillingAddress, getDeliveryMethodType],
 (giftCard, billingAddress, deliveryType) => !!(
    giftCard.giftCards.length === 0 && !(
       billingAddress.lastName &&
       billingAddress.firstName &&
       billingAddress.postalCode &&
       billingAddress.phoneNumber &&
       billingAddress.email
     ) && deliveryType === STORE_PICKUP
   )
);

/**
* Checks if billing address is saved or incomplete
*/
const shouldSetBillingAddress = createSelector(
 [state => state.giftCard, hasIncompleteBillingAddress],
 (giftCard, hasIncompleteBillingAddresss) =>
   giftCard.giftCards.length === 0 && hasIncompleteBillingAddresss
);

/**
* Checks if billing address need to be updated in case of complete/incomplete 001
*/
export const shouldUpdateBillingAddress = createSelector(
  [shouldShowBillingAddressFormForNewUserStoresSelection, shouldSetBillingAddress],
  (shouldShowBillingAddressFormForNewUserStoresSelectionn, shouldSetBillingAddresss) =>
    shouldShowBillingAddressFormForNewUserStoresSelectionn || shouldSetBillingAddresss
);

/**
* Checks if the complete billing address form should be displayed or not on the giftcard payment method.
* We should show the form if there are not giftcards applied and the billing address is incompleted.
*/
export const shouldShowBillingAddressForm = createSelector(
 [getDeliveryMethodType, shouldShowBillingAddressFormForNewUserStoresSelection, shouldSetBillingAddress],
 (deliveryType, shouldShowBillingAddressFormForNewUserStoresSelectionn, shouldSetBillingAddresss) =>
   deliveryType !== STORE_PICKUP && !shouldShowBillingAddressFormForNewUserStoresSelectionn && shouldSetBillingAddresss
);

// Check if we have to show payment store history
export const shouldShowPaymentStore = createSelector(
  [getPaymentStoreDetail, isStoreStaff], (storeDetail, isStoreStaffEmailId) =>
    !!(isStoreStaffEmailId || (storeDetail && storeDetail.storeDeliveryFlag === 1))
);
