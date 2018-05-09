import { createSelector } from 'reselect';
import { formatPrice } from 'utils/format';
import { getTranslation } from 'i18n';
import { getBrandFromQuery } from 'redux/modules/selectors';
import { MATCH_TEXT_BREAK_LINE } from 'helpers/regex';

const getCart = state => state.cart;

/**
 * Get gifting state tree
 */
const getGifting = state => state.gifting;

/**
 * Get gift from the order confirm
 */
const getOrderGift = state => state.order && state.order.cartGift;

const getSavedCartGift = createSelector(
  [getBrandFromQuery, getGifting, getCart],
  (brand, gifting, cart) => cart[brand].cartGift || gifting
);

// assumed prop in GiftPanel
const getGift = (state, props) => props && props.gift || {};

/**
 * Get gift bags
 */
export const getGiftBags = createSelector([getGifting], gifting => gifting.giftBags);

/**
 * Checks if the giftbags are loaded depending on the current brand
 */
export const isGiftBagsLoaded = createSelector(
  [getBrandFromQuery, getGiftBags],
  (brand, giftBags) => giftBags && giftBags.length > 0 && giftBags.find(giftBag => giftBag.brand === brand) !== undefined
);

/**
 * Get gift bag amounts (prices)
 */
export const getGiftBagAmounts = createSelector([getGifting], gifting => gifting.giftBagAmounts || {});

/**
 * Get selected gift box
 */
export const getSelectedGiftBox = createSelector([getGifting], gifting => gifting.selectedGiftBox);

/**
 * Find selected gift id either from gifting state or cart
 */
const getSelectedGiftId = createSelector(
  [getSelectedGiftBox, getSavedCartGift, getOrderGift, getGift],
  (gifting, cartGift, orderGift, gift) => {
    const id = gift && gift.id || gifting && gifting.id || cartGift && cartGift.id || orderGift && orderGift.id;

    return Array.isArray(id) ? id[0] : id;
  }
);

/**
 * Get giftbags based on the brand query parameter
 */
export const getGiftItems = createSelector(
  [getBrandFromQuery, getGiftBags, getGiftBagAmounts, getSelectedGiftId, getTranslation],
  (brand, bags, amounts, selected, i18n) => bags.filter(giftBag => giftBag.brand === brand).map(giftBag => ({
    ...giftBag,
    selected: giftBag.id === selected,
    price: formatPrice(amounts[giftBag.id].amount),
    description: giftBag.hasPacking ? i18n.gifting.withPacking : i18n.gifting.withoutPacking,
  }))
);

/**
 * Is any gift selected
 */
export const isAnyGiftSelected = createSelector(
  [getSelectedGiftBox, getGiftItems],
  (selectedGiftBox, giftItems) => !!(selectedGiftBox || giftItems.find(item => item.selected))
);

/**
 * Find data for the selected gift box item
 */
export const getSelectedGiftBoxData = createSelector(
  [getGiftItems, getSelectedGiftId],
  (items, selected) => selected && items.find(item => item.id === selected)
);

/**
 * Message card - similar to gift bags
 */
const getMessageCards = createSelector([getGifting], gifting => gifting.messageCards);

/**
 * Checks if the message cards are loaded depending on the current brand
 */
export const isMessageCardsLoaded = createSelector(
  [getBrandFromQuery, getMessageCards],
  (brand, cards) => {
    const keys = Object.keys(cards);

    return cards && keys.length > 0 && cards[keys[0]].brand === brand;
  }
);

/**
 * Get message card amounts
 */
const getMessageAmounts = createSelector([getGifting], gifting => gifting.messageAmounts);

/**
 * Find selected message id either from gifting state or cart
 */
export const getSelectedMessageId = createSelector(
  [getSelectedGiftBox, getSavedCartGift, getOrderGift, getGift],
  (gifting, cartGift, orderGift, gift) =>
    gift && gift.messageCard && gift.messageCard.id ||
    gifting && gifting.messageCard && gifting.messageCard.id ||
    cartGift && cartGift.messageCard && cartGift.messageCard.id ||
    orderGift && orderGift.messageCard && orderGift.messageCard.id
);

/**
 * Message card parser
 */
export const getMessageCardItems = createSelector(
  [getMessageCards, getMessageAmounts, getSelectedMessageId, getTranslation],
  (cards, amounts, selected, i18n) => cards.map(card => ({
    ...card,
    selected: card.id === selected,
    price: amounts[card.id].amount ? formatPrice(amounts[card.id].amount) : i18n.common.free,
    description: i18n.gifting.cardExplanatoryText,
  }))
);

// Gift Panel stuff

/**
 * @private
 * Get the gift message from any of the available sources
 */
const getAvailableGiftMessage = createSelector(
  [getGift, getGifting, getSelectedGiftBox, getSavedCartGift],
  (gift, gifting, selectedGiftBox, cartGift) =>
    gift && gift.message ||
    gifting && gifting.message ||
    selectedGiftBox && selectedGiftBox.message ||
    cartGift && cartGift.message
);

/**
 * Get gift message being entered by user
 */
export const getGiftMessageEntered = createSelector(
  [getGifting],
  gifting => gifting.message && gifting.message.replace(MATCH_TEXT_BREAK_LINE, '\n')
);

/**
 * Get gift message
 */
export const getGiftMessage = createSelector(
  [getAvailableGiftMessage],
  message => message && message.replace(MATCH_TEXT_BREAK_LINE, '\n')
);

/**
 * Get gift box from gift object (props)
 */
export const getGiftBoxFromGift = createSelector(
  [getGiftBags, getSelectedGiftId],
  (giftBags, giftId) => giftId && giftBags.find(item => item.id === giftId)
);

/**
 * Get message card from gift object (props)
 */
export const getMessageCardFromGift = createSelector(
  [getMessageCards, getSelectedMessageId],
  (cards, msgId) => msgId && cards.find(item => item.id === msgId)
);

/**
 * Get gift amount from gift property if exists
 */
const getGiftBoxPriceFromProps = createSelector([getGift], gift => gift && gift.amount);

/**
 * Get gift box price
 * Either find it from gift that's passed from the props or gift amounts
 */
const getGiftBoxPrice = createSelector(
  [getGiftBagAmounts, getGiftBoxFromGift, getGiftBoxPriceFromProps],
  (amounts, giftBox, propPrice) => propPrice || (giftBox && amounts[giftBox.id] ? amounts[giftBox.id].amount : 0)
);

/**
 * Get formatted total price
 */
export const getFormattedGiftBoxPrice = createSelector([getGiftBoxPrice], formatPrice);

/**
 * Get message card price from gift property if exists
 */
const getMsgCardPriceFromProps = createSelector([getGift], gift => gift && gift.messageCard && gift.messageCard.amount);

/**
 * Get message card price
 */
export const getMessageCardPrice = createSelector(
  [getMessageAmounts, getMessageCardFromGift, getMsgCardPriceFromProps],
  (amounts, card, propPrice) => propPrice || (card && amounts[card.id] ? amounts[card.id].amount : 0)
);

const getCartGift = state => state.cart.cartGift || {};

/**
 * Check if there is gifting in an order
 */
export const getIsGifting = createSelector(
  [getGift, getCartGift],
  (gift, cartGift) => !!(gift && (gift.id || gift.messageCard && gift.messageCard.id) || cartGift && cartGift.id)
);
/**
 * Check if a gift is applied
 **/
export const isGiftApplied = state => !!state.gifting.gift;

/**
 * Returns the selected card id
 */
export const getSelectedMessageCardId = createSelector(
  [getGifting],
  gifting => gifting && gifting.selectedMessageCard && gifting.selectedMessageCard.id[0]
);

/**
 * Get formatted total price
 */
export const getFormattedGiftCardAmount = createSelector([getGiftBoxPrice], formatPrice);

/**
 * Get formatted message card price
 */
export const getFormattedMessageCardAmount = createSelector([getMessageCardPrice], formatPrice);
