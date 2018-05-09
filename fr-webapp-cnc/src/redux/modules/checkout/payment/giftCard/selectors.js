import { createSelector } from 'reselect';
import createBranchSelector from 'utils/branchedSelector';
import constants from 'config/site/default';
import { getCartOrderSummary, getTotalAmount } from 'redux/modules/cart/selectors';
import { hasIncompleteBillingAddress, getPaymentMethod } from 'redux/modules/checkout/payment/selectors';
import validator from 'components/uniqlo-ui/core/Validation/Validator';

const { payment: method } = constants;

/**
 * @private Gets the giftcard from props
 */
const getGiftCardFromProps = (state, props) => props.giftCard;

/**
 * @private Returns an array of giftcards already applied to the order
 */
const getAppliedGiftCards = state => state.giftCard.giftCards;

export const getShowContinueButton = state => state.giftCard.showContinueButton;

/**
 * Returns the active giftcard card on the redux state
 */
export const getActiveCard = state => state.giftCard.giftCard;

/**
 * @private Returns true if the active card is validated on server
 */
const isActiveCardValidatedOnServer = createSelector(
  [getActiveCard],
  giftCard => !!giftCard.requestNumber
);

/**
 * Returns the giftcard amount on the redux state
 */
export const getGiftCardBalanceAmount = state => state.giftCard.balanceAmount;

/**
 * @private Calculates the total balance for the applied giftcards
 */
const getTotalGiftCardsBalance = createSelector(
  [getAppliedGiftCards],
  giftCards => giftCards.reduce((prev, current) => prev + parseFloat(current.payment), 0)
);

/**
 * Calculates the balance due based on the applied giftcards.
 */
export const getBalanceDue = createSelector(
  [getTotalAmount, getTotalGiftCardsBalance],
  (totalAmount, balance) => totalAmount - balance
);

/**
 * Checks if the giftcard from props is applied or not
 */
export const isAppliedGiftCard = createBranchSelector(
  'isAppliedGiftCard',
  getGiftCardFromProps,
  () => createSelector(
    [getGiftCardFromProps],
    giftCard => !!(giftCard && giftCard.requestNumber)
  )
);

/**
 * Gets the available balance on the current giftcard.
 * To get the current giftcard, this selector looks into the `giftCard` prop on the component
 */
export const getBalanceAmount = createBranchSelector(
  'getBalanceAmount',
  getGiftCardFromProps,
  () => createSelector(
    [getGiftCardFromProps],
    giftCard => giftCard && parseInt(giftCard.payment, 10) || 0
  )
);

/**
 * Checks if there's an additional payment required.
 */
export const isAdditionalPaymentRequired = createSelector(
  [getBalanceDue],
  balanceDue => balanceDue > 0
);

/**
 * Checks if the current giftcard is being edited
 */
export const isEditingAppliedGiftCard = createBranchSelector(
  'isEditingAppliedGiftCard',
  getGiftCardFromProps,
  () => createSelector(
    [getGiftCardFromProps, getActiveCard],
    (giftCard, activeGiftCard) => giftCard && giftCard.index === activeGiftCard.index
  )
);

/**
 * Checks if the current giftcard is being edited
 */
export const isEditingValidGiftCard = createSelector(
  [getActiveCard, isActiveCardValidatedOnServer],
  (activeGiftCard, isActiveCardValidatedOnServerr) => isActiveCardValidatedOnServerr && activeGiftCard.index === undefined
);

/**
 * Checks if the input amount is valid or not.
 * This is a client side validation before sending the data to the server.
 */
export const isValidGiftCardAmount = createBranchSelector(
  'isValidGiftCardAmount',
  getGiftCardFromProps,
  () => createSelector(
    [getGiftCardFromProps, getActiveCard, getTotalAmount, getTotalGiftCardsBalance],
    (giftCard, activeCard, totalAmount, balance) => {
      const otherCards = balance > 0 ? Math.abs(balance - giftCard.payment) : balance;
      const balanceDue = totalAmount - otherCards;

      return !(
        // Is invalid if the input value is cero
        parseFloat(activeCard.payment, 10) === 0
        // Is invalid if is not a valid number
        || isNaN(activeCard.payment)
        // Is invalid if the input value is  is grater than card balance
        || parseFloat(activeCard.payment, 10) > parseFloat(activeCard.balance, 10)
        // Is invalid if the input value is grather than the balance due
        || parseFloat(activeCard.payment, 10) > parseFloat(balanceDue, 10)
      );
    }
  )
);

/**
 * Checks if the current card is the last applied card
 */
export const isLastAppliedCard = createBranchSelector(
  'isLastAppliedCard',
  getGiftCardFromProps,
  () => createSelector(
    [getAppliedGiftCards, getGiftCardFromProps],
    (giftCards, currentGiftCard) => currentGiftCard.index === (giftCards.length - 1)
  )
);

/**
 * Checks if the giftcard number and pin are valid or not.
 * This is just a client side validation, before sending the data to the server.
 */
export const isValidNumberAndPin = createSelector(
    [getActiveCard],
    giftCard => giftCard && validator.numericExactLength(giftCard.number, 16) && validator.numericExactLength(giftCard.pin, 4)
);

/**
 * On payment page we need to check if current payment is giftcards only
 * and make sure the cards are not paying above of the total.
 */
export const isGiftCardUpdateRequired = createSelector(
  [getCartOrderSummary, getTotalGiftCardsBalance, getPaymentMethod],
  (orderSummary, currentBalance, paymentMethod) => (
    // We need to make sure to check giftcard or credit card payment
    (paymentMethod === method.giftCard || paymentMethod === method.creditCard) &&
    // If giftcard balance is grather than total on cart, we need to show an error
    currentBalance > orderSummary.total
  )
);

/**
 * Returns true if GiftCard payment from props is selected
 */
export const isGiftCardPaymentSelected = createBranchSelector(
  'isGiftCardPaymentSelected',
  getGiftCardFromProps,
  () => createSelector(
    [getGiftCardFromProps, getPaymentMethod],
    (giftCard, paymentMethod) => {
      // Applied giftcards can not be unselected
      if (giftCard) {
        return !!giftCard.requestNumber;
      }

      // Not applied giftcards are selected only if the payment method is giftcard
      return paymentMethod === method.giftCard;
    }
  )
 );

/**
 * Returns the index of the giftcard from props
 */
export const getGiftCardIndex = createBranchSelector(
  'getGiftCardIndex',
  getGiftCardFromProps,
  () => createSelector(
    [getGiftCardFromProps, getAppliedGiftCards],
    (giftCard, giftCards) => {
      if (giftCard) {
        return giftCard.index;
      }

      return giftCards.length;
    }
  )
 );

 /**
 * Checks if the billing address form should be displayed or not on the giftcard payment method.
 * We should show the form if there are not giftcards applied and the billing address is incompleted.
 */
export const shouldShowBillingAddressForm = createSelector(
  [getAppliedGiftCards, hasIncompleteBillingAddress],
  (giftCards, hasIncompleteBillingAddresss) =>
    giftCards.length === 0 && hasIncompleteBillingAddresss
);

/**
 * Checks if the giftcard should show the continue button.
 * Only the last card should show the button and there needs to be a balance due
 */
export const shouldShowContinueButton = createBranchSelector(
  'shouldShowContinueButton',
  getGiftCardFromProps,
  () => createSelector(
    [getGiftCardFromProps, getAppliedGiftCards, isEditingAppliedGiftCard, getBalanceDue, getShowContinueButton],
    (giftCard, giftCards, isEditingGiftCardd, balanceDue, showContinueButton) =>
      showContinueButton && !isEditingGiftCardd && balanceDue === 0 && giftCard && giftCard.index === (giftCards.length - 1)
  )
);

/**
 * Checks if the giftcard from props is pending to set a payment amount
 */
export const isGiftCardPendingAmountSelected = createBranchSelector(
  'isGiftcardPendingAmmountSelection',
  getGiftCardFromProps,
  () => createSelector(
    [getGiftCardFromProps],
    giftCard => giftCard && giftCard.index !== undefined && !!giftCard.requestNumber && giftCard.payment === 0
  )
);
