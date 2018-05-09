import { createSelector } from 'reselect';
import createBranchSelector from 'utils/branchedSelector';
import { formatPrice } from 'utils/format';
import { getUrlWithQueryData } from 'utils/routing';
import { isShippingDeliveryType } from 'utils/deliveryUtils';
import { isStoreStaffEmail } from 'utils/validation';
import { getCart, getBrand } from 'redux/modules/cart/selectors';
import getSiteConfig from 'config/site';
import mapOrderSummary, { getBarcodeInfo } from 'redux/modules/checkout/mappings/orderSummaryMappings';

const { payment: { uniqloStore }, deliveryTypes: { STORE_PICKUP }, CUSTOMER_NOTES_BASE_URL, deliveryPreferences: { SPLIT_DELIVERY } } = getSiteConfig();

// check if a fromCart or fromCheckout boolean is passed from parent
const isOrderSummaryFromCartOrCheckout = (state, props) => props.fromCart || props.fromCheckout;

const isOrderSummaryFromMinibag = (state, props) => !!props.fromMinibag;

// get order data from state
export const getOrder = state => state.order;

export const getOrders = state => state.order.orders;

const getOrderSummaryFromProps = (state, props) => props.order;

export const getHashKey = state => state.order.hashKey;

export const getOrderItems = state => state.order.items;

const getDeliveryMethodType = state => state.order.deliveryMethod.deliveryType;

const getDeliveryPreference = state => state.delivery && state.delivery.deliveryPreference;

const getAllSplitDetails = state => state.delivery && state.delivery.splitDetails;

/**
 * Return first order details from multiple orders
 */
export const getFirstOrder = state =>
  state.order.orders &&
  state.order.orders[Object.keys(state.order.orders)[0]];

export const getFirstOrderDetails = createSelector(
  [getFirstOrder],
  order => order && order.orderDetails
);

export const getOrderDetails = createSelector(
  [(state, props) => props, getFirstOrderDetails],
  (props, orderDetails) => (props && props.orderConfirmDetails) || orderDetails
);

export const getCartGiftFromOrder = createSelector(
  [getFirstOrder],
  order => order && order.cartGift
);

/**
 * Checks if split delivery applied by the user
 */
export const isSplitOrder = state => state.order.orders && Object.keys(state.order.orders).length > 1;

/**
 * Checks if the payment type of order is pay_at_uniqlo_store
 */
export const isUniqloStorePayment = createSelector(
  [isSplitOrder, getFirstOrderDetails],
  (isSplitDelivery, orderDetails) => !isSplitDelivery && orderDetails && orderDetails.payment_type === uniqloStore
);

// get order_delv from orderDetails
const getDeliveryDetails = createSelector(
  [getOrderDetails],
  orderDetails => orderDetails && orderDetails.order_delv || {}
);

// get delv_type from orderDetails
const getDeliveryType = createSelector(
  [getDeliveryDetails],
  deliveryDetails => deliveryDetails.delv_type || ''
);

export const isSplitDeliverySelected = createSelector(
  [getDeliveryPreference],
  deliveryPreference => deliveryPreference === SPLIT_DELIVERY
);

export const getAmountForSplit = createSelector(
  [isSplitDeliverySelected, getAllSplitDetails], (isSplitDelivery, splitDetails) => {
    let serviceAmount = 0;
    let total = 0;
    let consumptionTax = 0;
    let totalMerchandise = 0;

    const splits = splitDetails && Object.keys(splitDetails);

    if (isSplitDelivery && splits && splits.length) {
      splits.forEach((splitNo) => {
        const orderSummaryOfSplit = mapOrderSummary(splitDetails[splitNo]);

        serviceAmount += orderSummaryOfSplit.additionalCharges.serviceAmount;
        total += orderSummaryOfSplit.total;
        consumptionTax += orderSummaryOfSplit.additionalCharges.consumptionTax;
        totalMerchandise += orderSummaryOfSplit.totalMerchandise;
      });
    }

    return { serviceAmount, total, consumptionTax, totalMerchandise };
  }
);

// get order summary from state.cart or state.order based on the flag 'fromCart'
export const getOrderSummary = createBranchSelector(
  'orderSummary',
  getBrand,
  () => createSelector(
    [isOrderSummaryFromCartOrCheckout, getOrder, getCart, getOrderSummaryFromProps, getFirstOrder,
      getAmountForSplit, isOrderSummaryFromMinibag, isSplitDeliverySelected],
    (isFromCart, order, cart, summaryFromProps, firstOrder,
      { serviceAmount, consumptionTax, totalMerchandise }, isFromMinibag, isSplitDelivery) => {
      const orderSummary = Object.keys(order.orderSummary).length > 0
        ? order.orderSummary
        : (firstOrder && firstOrder.orderSummary || {});

      const update = isFromMinibag && isSplitDelivery
        ? { ...orderSummary, totalMerchandise, additionalCharges: { ...orderSummary.additionalCharges, serviceAmount, consumptionTax } }
        : {};

      return (summaryFromProps || (isFromCart ? { ...cart.orderSummary, ...update } : { ...orderSummary, ...update }));
    }
  )
);

// get total gifting amount based on values of gift fee and message card fee
// preventing NaN with bitwise ~~
export const getGiftFee = createBranchSelector(
  'giftFee',
  getBrand,
  () => createSelector(
    [getOrderSummary],
    ({ giftFee, messageCardFee }) => ~~giftFee + ~~messageCardFee
  )
);

/**
 *  Get total merchandise value. The total goods amount
 *  before applying taxes.
 */
export const getOrderTotal = createBranchSelector(
  'orderTotal',
  getBrand,
  () => createSelector(
    [getOrderSummary],
    ({ totalMerchandise, totalMerchandiseOrder }) => totalMerchandise || totalMerchandiseOrder || 0
  )
);

// get coupon amount applied to order
export const getOrderCoupon = createBranchSelector(
  'orderCoupon',
  getBrand,
  () => createSelector([getOrderSummary], ({ coupon }) => coupon || 0)
);

// get resultant total amount payable for the order
export const getTotalAmount = createBranchSelector(
  'totalAmount',
  getBrand,
  () => createSelector(
    [
      isOrderSummaryFromMinibag,
      getOrderSummary,
      getAmountForSplit,
    ],
    (
      isFromMinibag,
      { total, paymentsAmt },
      splitAmount,
    ) => {
      if (isFromMinibag && splitAmount.total) return splitAmount.total;

      return paymentsAmt;
    }
  )
);

// get amount applied from using a giftcard
export const getGiftCardPayment = createBranchSelector(
  'giftCardPayment',
  getBrand,
  () => createSelector(
    [getOrderSummary],
    ({ giftCardPayment }) => (giftCardPayment)
  )
);

/**
 * Checks if the delivery type of order, it's any of the available shipping methods
 */
export const isShipping = createSelector(
  [getDeliveryMethodType],
  deliveryType => isShippingDeliveryType(deliveryType)
);

/**
 * Gets barcode details from order details
 * if the payment type is pay at uniqlo store
 */
export const isUQPaymentTimeExpired = createSelector(
  [getOrderDetails, isUniqloStorePayment],
  (orderDetails, isPayAtStore) => {
    const barcodeInfo = getBarcodeInfo(orderDetails);

    return !!(isPayAtStore && barcodeInfo && barcodeInfo.orderTimeLimit);
  }
);

/**
 * Checks if the delivery type of order is pickup_at_uniqlo_store
 */
export const isUniqloStorePickup = createSelector(
  [getDeliveryType],
  deliveryType => deliveryType === STORE_PICKUP
);

/**
 * Get customer notice link, if barcode info and pickup store code is available in orderDetails
 * and user email contains '@uniqlo.store'
 */
export const getCustomerNoticeLink = createSelector(
  [getOrderDetails, isUniqloStorePickup],
  (orderDetails, isUQPickup) => {
    const barcodeInfo = getBarcodeInfo(orderDetails);
    const recieveStoreCode = (isUQPickup && orderDetails) ? orderDetails.order_delv.receiver_tel_no : null;

    return barcodeInfo && recieveStoreCode && isStoreStaffEmail(orderDetails.orderer_eml_id)
      ? getUrlWithQueryData(
          CUSTOMER_NOTES_BASE_URL,
          { orderNo: orderDetails.ord_no, barCd: barcodeInfo.barcodeNumber, storeNo: recieveStoreCode },
        )
      : '';
  }
);

/**
* Get total payments amount
*/
export const getTotalCartValue = createBranchSelector(
  'getTotalCartValue',
  getBrand,
  () => createSelector([getCart, getAmountForSplit], (cart, splitAmount) => {
    const totalAmount = splitAmount.total || cart.paymentAmount;

    return formatPrice(totalAmount, true, true);
  })
);
