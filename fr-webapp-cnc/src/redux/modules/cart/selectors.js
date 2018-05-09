import { createSelector } from 'reselect';
import constants from 'config/site/default';
import { getSkuId, getSpecialFlagsForSku } from 'utils/productUtils';
import { getCurrentBrand } from 'utils/routing';
import { formatPrice } from 'utils/format';
import { getTranslation } from 'i18n';
import { getGiftBags, getGiftBagAmounts } from 'redux/modules/checkout/gifting/selectors';
import { findSmallestId } from 'redux/modules/cart/cart';
import createBranchSelector from 'utils/branchedSelector';
import { getAuthenticated } from '../account/auth';

/**
 * Get location from the router
 */
export const getLocation = state => state.routing.locationBeforeTransitions;

/**
 * Get all gu recommended items
 */
const getSilvereggItems = state => state.silveregg.items;

/**
 * Get gu recommendation specType from props
 */
const getSpecTypeFromProps = (state, props) => props && props.specType;

/**
 * Just get props.brand
 */
const getBrandFromProps = (state, props) => (props ? props.brand : false);

/**
 * Get default brand, based on the URL
 */
export const getBrand = createSelector(
  [getBrandFromProps, getLocation],
  (brand, location) => brand || getCurrentBrand({ routing: { location } }) || 'uq');

export const getGuCart = state => state.cart.gu;

/**
 * Is Uniqlo?
 */
export const isUniqlo = createSelector([getBrand], brand => brand === 'uq');

/**
 * Is GU?
 */
export const isGU = createSelector([getBrand], brand => brand === 'gu');

/**
 * Just brand other than currentBrand
 */
export const getOtherBrand = createBranchSelector(
  'getOtherBrand',
  getBrand,
  () => createSelector(
    [getBrand], brand => (brand === 'gu' ? 'uq' : 'gu')));

/**
* Is cart (the one other than current cart from routing) empty?
*/
export const isOtherBrandCartEmpty = createBranchSelector(
  'isOtherBrandCartEmpty',
  getBrand,
  () => createSelector([getOtherBrand, state => state.cart],
    (otherBrand, cart) => !cart[otherBrand].items.length));

/**
 * Get brand's cart
 */
export const getCart = createBranchSelector(
  'cart',
  getBrand,
  () => createSelector([getBrand, state => state.cart], (brand, cart) => cart[brand])
);

/**
 * Get other brand's cart
 */
export const getOtherCart = createBranchSelector(
  'otherCart',
  getBrand,
  () => createSelector([getOtherBrand, state => state.cart], (brand, cart) => cart[brand]));

/**
 * Get list of cart item as array of objects
 */
export const getCartItems = createBranchSelector(
  'cartItems',
  getBrand,
  () => createSelector([getCart], cart => cart.items)
);

/**
 * Get list of cart item as array of IDs
 */
export const getCartItemIds = createBranchSelector(
  'getCartItemIds',
  getBrand,
  () => createSelector([getCartItems], items => items.map(item => item.id))
);

/**
 * Get list of cart item as a string
 */
export const getCartItemsAsString = createBranchSelector(
  'getCartItemsAsString',
  getBrand,
  () => createSelector([getCartItemIds], items => items.join(','))
);

/**
 * Get first cart item
 */
export const getFirstCartItem = createBranchSelector(
  'getFirstCartItem',
  getBrand,
  () => createSelector([getCartItemIds], items => items[0])
);

/**
 * Is cart (the one detected from routing) empty?
 */
export const isCartEmpty = createBranchSelector(
  'isCartEmpty',
  getBrand,
  () => createSelector([getCartItemIds], items => !items.length)
);

/**
 * Is other cart empty?
 */
export const isOtherCartEmpty = createBranchSelector(
  'isOtherCartEmpty',
  getBrand,
  () => createSelector([getOtherCart], cart => !cart.items.length));

/**
 * Get the total amount for the current cart, this selector returns the raw value from state,
 * we need the number to calculate the balance due if there are any giftcards applied.
 */
export const getTotalAmount = createBranchSelector(
  'getTotalAmount',
  getBrand,
  () => createSelector([getCart], cart => cart.totalAmount)
);

/**
 * Get the goods amount for the current cart, this selector returns the raw value from state,
 */
const getGoodsTotal = createBranchSelector(
  'getGoodsTotal',
  getBrand,
  () => createSelector([getCart], cart => (cart.ordersummary && (cart.orderSummary.totalMerchandise || cart.orderSummary.totalMerchandiseOrder)))
);

/**
 * Get if the goods amount in cart is greater than the required threshold amount for free shipping
 */
export const getIfFreeShipping = createSelector(
  [getGoodsTotal, getBrand],
  (goodsTotal, brand) => goodsTotal >= constants.SHIPPING_THRESHOLD_PRICE[brand]);

/**
 * get Gender list
 */
const getGenderList = state => state.productGender;

/**
 * Get product gender
 */
export const getProductGender = createBranchSelector(
    'getProductGender',
    getBrand,
    () => createSelector([getGenderList, getBrand], (list, brand) => list[brand] || {})
  );

/**
 * Get valid gifts
 */
export const getValidGifts = createSelector(
  [
    state => state.gifting.selectedGiftBox,
    state => state.gifting.selectedMessageCard,
  ],
  (...gifts) => gifts.filter(gift => gift !== null));

/**
 * Get the gift flag for the
 * @return {String} selected 1 => selected, 0 => unselected
 */
const getGift = createSelector([getCart], cart => cart.gift);

/**
 * Get the isCartLoading flag
 * @return {Boolean} isCartLoading
 */
const getLoading = state => state.cart.isCartLoading;

/**
 * Get the gifting selection flag
 * @return {Boolean} selected
 */
const giftingSelected = state => state.gifting && state.gifting.selectedGiftBox;

/**
 * Get's the gift on cart based on the current brand
 */
export const getCartGift = createSelector([getCart], cart => cart.cartGift);

const getDefaultGifting = createBranchSelector(
  'getDefaultGifting',
  getBrand,
  () => createSelector([getGiftBags, getBrand],
    (giftBags, brand) => findSmallestId(giftBags, brand)
  )
);

/**
 * Check if use gift option selected
 * @props {Object} state - redux global state
 * @props {Object} props - component props
 * @return {string} selected gift id
 */
export const getGiftingSelected = createSelector(
  [getAuthenticated, getGift, getLoading, giftingSelected, getCartGift],
  (authenticated, gift, isLoading, selectedGifting, cartGift) => (
    selectedGifting ?
      selectedGifting.id :
      cartGift && cartGift.id ||
        !isLoading && gift !== '0' && gift
  ),
);

/**
 * TODO: check if the logic is correct
 * Get gifting id
 * @returns {string}
 */
export const getGiftingId = createSelector(
  [getGiftingSelected, getBrand, getDefaultGifting],
  (giftSelected, brand, defaultGifting) =>
    (giftSelected || defaultGifting));

/**
 * Make sure default gifting is matching a gift from giftbag or return default gifting
 */
export const getVerifiedGiftingId = createSelector(
  [getGiftBags, getGiftingId, getDefaultGifting],
  (giftBags, id, defaultGifting) => {
    if (id && ~~id > 0) { // eslint-disable-line no-bitwise
      const fromBag = giftBags.find(bag => ~~bag.id === ~~id); // eslint-disable-line no-bitwise

      // if it's found then return verified. Otherwise return id - maybe gift bags are not loaded
      return fromBag ? fromBag.id : id;
    }

    return defaultGifting;
  }
);

/**
 * Gets default gift bag from gifting state
 */
const getDefaultGift = createSelector(
  [getGiftBags, getVerifiedGiftingId],
  (bags, id) => bags.find(bag => ~~bag.id === ~~id), // eslint-disable-line no-bitwise
);

/**
 * Gets default gift bag amount from gifting state
 */
const getDefaultGiftAmount = createSelector(
  [getGiftBagAmounts, getVerifiedGiftingId],
  (bags, id) => bags[id], // eslint-disable-line no-bitwise
);

/**
 * Returns default gifting and amount
 */
export const getDefaultGiftOption = createSelector(
  [getDefaultGift, getDefaultGiftAmount],
  (gift, giftAmount) => ({
    amount: giftAmount && formatPrice(giftAmount.amount),
    title: gift && gift.title,
    image: gift && gift.image,
  })
);

/**
 * Group items by property
 * @param  {Array} collection  List of items
 * @param  {Object} entities   Object with item data
 * @param  {String} property   Grouping property
 * @return {Array}             Array of items
 */
function createGroupMultiBuySelector(groupKey) {
  const getKey = () => groupKey;

  return createSelector([getCartItems, getKey], (collection, property) => {
    const values = [];
    const result = [];
    let count = 0;
    const limit = collection.length;

    for (; count < limit; count++) {
      const item = collection[count];
      const val = item[property];
      const index = values.indexOf(val);

      if (index > -1) {
        result[index].push(item);
      } else {
        values.push(val);
        result.push([item]);
      }
    }

    return result;
  });
}

/**
 *  This method prepares the multibuy products to be renderer (If applicable)
 *  the logic is farily complex, a sequence diagram can be found on the wiki:
 *  https://frit.rickcloud.jp/wiki/display/ASRFS/Multi-Buy
 *
 */
export function getStructuredProducts(item, genderList) {
  const multiBuyItems = [];
  const { cart: { multiBuy } } = constants;

  item.forEach((prod) => {
    const productItem = { ...prod };
    // moreData is from catalog API to get more details for the product, such us gender, promotion id, ....
    const moreData = genderList[productItem.id] || {};

    // set some flags
    productItem.isMultiBuy = parseInt(productItem.promoDtlFlg, 10) > 1;
    productItem.secondItem = productItem.promoJoinNum === '-1';
    productItem.is999Rule = parseInt(productItem.promoDtlFlg, 10) >= 5;

    // In the case of multi buy with multiple SKUs, `promoJoinNum` for one of the item in the group will be 2 or 3.
    productItem.isMultipleSkuBuy = parseInt(productItem.promoJoinNum, 10) > 1;

    productItem.currentSkuId = getSkuId(productItem.id, productItem.colorCode, productItem.sizeCd);
    productItem.genderName = moreData.gender;
    productItem.alterationUnit = moreData.alterationUnit;
    productItem.promotionId = productItem.promoId;

    productItem.isXYPatternMessage = (productItem.applyType === multiBuy.patternX || productItem.applyType === multiBuy.patternY)
      && parseInt(productItem.promoJoinNum, 10) < 2;
    productItem.isXYPattern = productItem.applyType === multiBuy.patternX || productItem.applyType === multiBuy.patternY;

    // Show item price in Red color if (price is discounted):
    // 1. ('promo_dtl_flag' > 1) and ('apply_type' is 'X' or 'Y')
    //  OR
    // 2. ('promo_dtl_flag' > 1) and ('promo_join_num' is 1 or 0)
    productItem.multiBuyPrice = productItem.isMultiBuy && (productItem.isXYPattern || (!productItem.secondItem && !productItem.isMultipleSkuBuy));

    // calculate flags and sku stuff here
    // TODO once flag item values are confirmed, it will be pushed to flagitems below.
    /*
    [Alex Lazar]: i'm not sure who wrote this code, but i'm expecting a comment to explain a bit why is it like that!
    Temporary i've added SKU workaround to support flag discount within ProductCard
    */
    const flagItems = [];
    const SKUflags = {};
    const { flags } = productItem;

    for (const key in flags) {
      if (flags.hasOwnProperty(key)) {
        if (flags.discount !== '0') {
          flagItems.push('');
          SKUflags.discount = true;
        } else if (flags.online_limit !== '0') {
          flagItems.push('');
          SKUflags.onlineLimited = true;
        } else {
          SKUflags[key] = !!parseInt(flags[key], 10);
        }
      }
    }

    productItem.SKUflags = SKUflags;
    productItem.flagItems = flagItems;

    // If `promoId` contains a value, it means this product
    // suports one kind of multibuy.
    if (productItem.promoId) {
      // cart is multibuy
      multiBuyItems.isMultiBuyCart = true;

      // If the API has applied already the discount we need to update
      // the new price based on the server response.
      if (productItem.promoApplyCnt > 0
      && !productItem.isMultipleSkuBuy
      && !productItem.secondItem) {
        productItem.price = parseInt(productItem.promoApplyDiscountAmt, 10);
      }

      if (productItem.applyType === multiBuy.patternX || productItem.applyType === multiBuy.patternY) {
        productItem.price = parseInt(productItem.salePriceAmount, 10);
      }

      // `promoDtlFlg` defines if this product supports multibuy
      const promoDtlFlg = productItem.promoDtlFlg;

      // If `promoDtlFlg` is `1`, it means this product is applicable
      // for multibuy but is not qualified yet.
      if (promoDtlFlg === multiBuy.notQualified) {
        multiBuyItems.push(productItem);

      // if `promoDtlFlg` 2 ~ 4, multibuy is applicable and already qualified
      } else if (multiBuy.alreadyQualified.includes(promoDtlFlg)) {
        // if `promoJoinNum` is equals 0, display neither the product box
        // nor the price. Adds its product quantity to the quantity of the
        // product of the previous item on the cart, which should be the same
        // kind of product as we are grouping it before calling this function.
        if (productItem.promoJoinNum === multiBuy.notApplicable) {
          const lastItem = multiBuyItems.length - 1;
          let itemCount = parseInt(multiBuyItems[lastItem].count, 10);

          itemCount += parseInt(productItem.count, 10);
          multiBuyItems[lastItem].count = itemCount.toString();
        } else {
          // Just display the product
          multiBuyItems.push(productItem);
        }

      // if `promoDtlFlg` is `5`, multibuy is applicable and apply
      // "buy over XX-items and YY-yen per item"
      } else if (promoDtlFlg === multiBuy.applicable) {
        if (productItem.promoJoinNum !== multiBuy.notApplicable) {
          multiBuyItems.push(productItem);
        }
      }
    } else {
      // Multibuy is not applicable therefore
      // just display the product.
      multiBuyItems.push(productItem);
    }
  });

  return multiBuyItems;
}

/**
 * Create a selector for a brand that returns structured products
 * This memoizes data just for that brand
 */
export function createStructuredProductsSelector(groupKey) {
  const multiBuySelector = createGroupMultiBuySelector(groupKey);

  return createBranchSelector(
    'itemsNormalization',
    getBrand,
    () => createSelector([multiBuySelector, getProductGender], (items, genderList) =>
      items.map(item => getStructuredProducts(item, genderList))
    )
  );
}

/**
 * Get product flags
 */
export const getFlagsForSKU = createSelector(
  [
    state => state.cart.catalogData || {},
    () => getTranslation().pdp.priceSpecials,
  ],
  (catalogData, priceSpecials) => Object.keys(catalogData).reduce((normalizedFlags, key) => {
    const product = catalogData[key];
    const flags = getSpecialFlagsForSku(product, priceSpecials);

    normalizedFlags.specialFlags[key] = flags.special;
    normalizedFlags.normalFlags[key] = flags.normal;

    return normalizedFlags;
  }, { specialFlags: {}, normalFlags: {} })
);

/**
 * Get cart payment type
 */
export const getCartPaymentType = createBranchSelector(
  'getCartPaymentType',
  getBrand,
  () => createSelector([getCart], cart => cart.paymentType)
);

/**
 * Get cart shipping address
 */
export const getCartShippingAddress = createBranchSelector(
  'getCartShippingAddress',
  getBrand,
  () => createSelector([getCart], cart => cart.shippingAddress)
);

/**
 * Get gift card flag
 */
export const getGiftCardFlag = state => state.cart.giftCardFlag;

/**
 * Get receipt flag
 */
export const getReceiptFlag = createBranchSelector(
  'getReceiptFlag',
  getBrand,
  () => createSelector([getCart], cart => cart.receiptFlag)
);

/**
 * Get delivery method
 */
export const getDeliveryMethod = state => state.cart.deliveryMethod;

/**
 * Get billing address
 */
export const getBillingAddress = state => state.cart.billingAddress;

/**
 * Returns the current brand that's going through the checkout process.
 * The value of this field is saved in a cookie.
 */
export const getCheckoutBrand = state => state.cart.checkoutBrand;

/**
 * @private
 * Returns the items from props
 */
const getItemFromProps = (state, props) => props.item;

/**
 * @private
 * Returns the inventory errors for the current cart
 */
const getInventoryDetails = createSelector(
  [getCart],
  cart => cart.inventoryDetails
);

/**
 * Checks if the product is out of stock
 */
export const isOutOfStock = createBranchSelector(
  'isOutOfStock',
  getItemFromProps,
  () => createSelector(
    [getInventoryDetails, getItemFromProps],
    (inventory, item) => {
      const product = inventory[item.l2Code];

      return product && product.secured === 0;
    }
  )
);

/**
 * Checks if the product has low inventory
 */
export const isLowInventory = createBranchSelector(
  'isLowInventory',
  getItemFromProps,
  () => createSelector(
    [getInventoryDetails, getItemFromProps],
    (inventory, item) => {
      const { l2Code, isMultiBuy, count: itemCount } = item;
      const { secured, count: l2TotalCount = 0 } = inventory[l2Code] || {};

      if (isMultiBuy) {
        return l2TotalCount > 0;
      }

      return !!secured && secured < itemCount;
    }
  )
);

/**
 * Returns the secured items on the inventory
 */
export const getAvailableItemsOnStock = createBranchSelector(
  'getAvailableItemsOnStock',
  getItemFromProps,
  () => createSelector(
    [getInventoryDetails, getItemFromProps],
    (inventory, item) => {
      const { l2Code, isMultiBuy } = item;
      const { secured: securedCount = 0, count = 0 } = inventory[l2Code] || {};

      // In the case of multi-buy products we have a single l2Code with mulitple lines
      // the property 'count' gives the total number of items with same l2Code.
      return isMultiBuy ? count : securedCount;
    }
  )
);

/**
 * Get the order summary from the selected cart
 */
export const getCartOrderSummary = createSelector(
  [getCart],
  cart => cart.orderSummary
);

/**
 * Checks if there are inventory errors, then loop the items on cart to check if the user
 * has fixed those errors to enable/disable the checkout button on cart page.
 */
export const isCheckoutAvailable = createSelector(
  [getCartItems, getInventoryDetails],
  (items, inventory) => {
    const l2Codes = Object.keys(inventory);

    // If there are items and errors in inventory, we need to check if
    // those errors are solved for the giving items.
    if (items.length > 0 && l2Codes.length > 0) {
      const error = items.find((item) => {
        const product = inventory[item.l2Code];

        if (product) {
          return (
            // Check if is out of stock
            product.secured === 0 ||
            // Check if is low inventory
            product.secured < item.count
          );
        }

        return false;
      });

      return !error;
    }

    // If there are not inventory errors, we are good to go!
    return true;
  }
);

/**
 * Check for first order
 */
export const isFirstOrder = createSelector(
  [getCart],
  cart => cart && cart.firstOrderFlag === '1'
);

/**
 * Get gu recommended items for the given specType
 */
export const getGuProductRecomendations = createSelector(
  [getSilvereggItems, getSpecTypeFromProps],
  (silvereggItems, specType) => silvereggItems[specType]
);
