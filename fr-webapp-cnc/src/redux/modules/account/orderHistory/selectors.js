import { createSelector } from 'reselect';
import constants from 'config/site/default';
import { getBarcodeInfo } from 'redux/modules/checkout/mappings/orderSummaryMappings';
import { getStoreDetails } from 'redux/modules/checkout/delivery/store/selectors';
import { getStructuredProducts } from 'redux/modules/cart/selectors';
import { getDeliveryMethodListOfDiv } from 'redux/modules/checkout/delivery/selectors';
import { getItems } from 'redux/modules/mappings/cartMappings';
import { constructTimeFrameMessage } from 'utils/formatDate';
import { getUrlWithQueryData } from 'utils/routing';
import { getShippingMethodDescription, isShippingDeliveryType, isCVSDeliveryType } from 'utils/deliveryUtils';
import { isStoreStaffEmail } from 'utils/validation';
import { getTranslation } from 'i18n';

const { deliveryTypes: { STORE_PICKUP, SEJ, LAWSON }, payment: { uniqloStore }, CUSTOMER_NOTES_BASE_URL } = constants;

/**
 * Get order details
 */
export const getOrderDetails = state => state.order.details;

/**
 * Get product genders
 */
export const getProductGenders = state => state.productGender;

/**
 * Gets locationBeforeTransitions from state
 */
export const getLocationBeforeTransitions = state => state.routing.locationBeforeTransitions;

/**
 * Get details of uniqlo_store chosen as payment option
 */
export const getPaymentStoreDetails = state => state.paymentStore && state.paymentStore.paymentStoreDetail || {};

/**
 * Returns true if payment type is pay at store otherwise false
 */
export const isPayAtUniqlo = createSelector(
  [getOrderDetails],
  orderDetails => orderDetails.payment_type === uniqloStore
);

/**
 * Gets delivery details from order details
 */
export const getDeliveryDetails = createSelector(
  [getOrderDetails],
  orderDetails => orderDetails.order_delv || {}
);

/**
 * Gets Shipping details from order details
 */
export const getShippingDetails = createSelector(
  [getOrderDetails],
  orderDetails => orderDetails.mwm_shipping_info_list || []
);

/**
 * Gets delivery type from order delivery details
 */
export const getDeliveryType = createSelector(
  [getDeliveryDetails],
  deliveryDetails => deliveryDetails.delv_type || ''
);

/**
 * Returns true if delivery type is any of the available shipping methods
 * otherwise false
 */
export const isShipping = createSelector(
  [getDeliveryType],
  deliveryType => isShippingDeliveryType(deliveryType)
);

/**
 * Returns true if delivery type is any of the available ConvenienceStore methods
 * otherwise false
 */
export const isConvenienceStore = createSelector(
  [getDeliveryType],
  deliveryType => isCVSDeliveryType(deliveryType)
);

/**
 * Returns true if delivery type is SEJ
 * otherwise false
 */
export const isSevenEleven = createSelector(
  [getDeliveryType],
  deliveryType => deliveryType === SEJ
);

/**
 * Returns true if delivery type is LAWSON
 * otherwise false
 */
export const isLawsonStore = createSelector(
  [getDeliveryType],
  deliveryType => deliveryType === LAWSON
);

/**
 * Returns true if delivery type is pick up at store otherwise false
 */
export const isPickUpAtStore = createSelector(
  [getDeliveryType],
  deliveryType => deliveryType === STORE_PICKUP
);

/**
 * Returns true if delivery type is pick up at store and
 * store details available, otherwise false
 */
export const isStoreDetailsAvailable = createSelector(
  [getStoreDetails, isPickUpAtStore],
  (storeDetails, pickUpAtStore) => !!(pickUpAtStore && Object.keys(storeDetails).length)
);

/**
 * Gets barcode details from order details
 * if the payment type is pay at uniqlo store
 */
export const getBarCode = createSelector(
  [getOrderDetails, isPayAtUniqlo],
  (orderDetails, isPayAtStore) => isPayAtStore && getBarcodeInfo(orderDetails) || null
);

/**
 * Returns true if gifting applied otherwise false
 */
export const isGiftingApplied = createSelector(
  [getOrderDetails],
  orderDetails => orderDetails.gift_flg === '1'
);

/**
 * Gets order brand from order details
 */
export const getOrderBrand = createSelector(
  [getOrderDetails],
  orderDetails => orderDetails.ord_brand_kbn === '10' && constants.brandName.uq || constants.brandName.gu
);

/**
 * Gets product list for the present order brand
 */
export const getBrandedProductGender = createSelector(
  [getProductGenders, getOrderBrand],
  (productGender, brand) => productGender[brand] || {}
);

/**
 * Returns true if receipt flag is 1 otherwise false
 */
export const isReceiptAvailable = createSelector(
  [getOrderDetails],
  orderDetails => orderDetails.receipt_flg === '1'
);

/**
 * Returns true if bracode info and pay_at_uq_store details are available
 */
export const getIfBarCodeIsShown = createSelector(
 [getBarCode, getPaymentStoreDetails],
 (barcodeInfo, paymentStoreDetail) => !!(barcodeInfo && Object.keys(paymentStoreDetail).length)
);

export const getStructuredOrderItems = createSelector(
  [getOrderDetails, getBrandedProductGender],
  (details, genderList) =>
    getStructuredProducts(details.order_detail_list.map(item => getItems(item)), genderList)
);

export const getDeliveryDatesFromSelectable = createSelector(
  [getDeliveryMethodListOfDiv],
  deliveryMethodList => (deliveryMethodList.deliveryDetails
    ? deliveryMethodList.deliveryDetails.find(item => item.plannedDateFrom || item.plannedDateTo)
    : {})
);

const getDeliveryMethod = createSelector(
  [getDeliveryType, getDeliveryDetails],
  (deliveryType, deliveryDetails) =>
  ({
    deliveryType,
    deliveryReqTime: deliveryDetails.delv_req_time,
    deliveryReqDate: deliveryDetails.delv_req_dt,
  })
);

const getPlannedDates = createSelector(
  [getShippingDetails, isPayAtUniqlo, getDeliveryDatesFromSelectable],
  (shippingDetails, isPayAtUniqloStore, deliveryDatesFromSelectable) => {
    const shippingData = shippingDetails[0] || {};

    return isPayAtUniqloStore
      ? { ...deliveryDatesFromSelectable }
      : {
        plannedDateFrom: shippingData.planned_delivery_date_from,
        plannedDateTo: shippingData.planned_delivery_date_to,
      };
  }
);

const getDeliveryMethodListFromOrder = createSelector(
  [getDeliveryType, getPlannedDates],
  (deliveryType, plannedDates) =>
  ({
    deliveryDetails: [
      { deliveryType, ...plannedDates },
    ],
  })
);

export const getTimeFrameInfo = createSelector(
  [getDeliveryMethod, getDeliveryMethodListFromOrder],
  (deliveryMethod, deliveryMethodList) => {
    const shippingFrame = constructTimeFrameMessage(deliveryMethod, getTranslation(), deliveryMethodList, true);
    const timeFrameMessage = shippingFrame
      ? shippingFrame.title
      : getTranslation().orderHistory.ifYouDonotSpecifiedDelivery;
    const estimatedArrival = shippingFrame
      ? shippingFrame.shipping
      : getShippingMethodDescription({ shippingType: 'defaultDelivery', deliveryMethodList });

    return { estimatedArrival, timeFrameMessage };
  }
);

export const showAddBackToCartButton = createSelector(
  [getOrderDetails],
  orderDetails => (
    orderDetails.payment_type === constants.payment.postPay &&
    constants.order.postPayOrderCancelStatus.includes(orderDetails.cancel_target_flg)
  )
);

/**
 * Get customer notice link, if barcode info and pickup store code is available in orderDetails
 * and user email contains '@uniqlo.store'
 */
export const getCustomerNoticeLink = createSelector(
  [getBarCode, isPickUpAtStore, getOrderDetails, getDeliveryDetails],
  (barcodeInfo, isUQPickup, orderDetails, deliveryDetails) => {
    const recieveStoreCode = isUQPickup ? deliveryDetails.receiver_tel_no : null;

    return barcodeInfo && recieveStoreCode && isStoreStaffEmail(orderDetails.orderer_eml_id)
      ? getUrlWithQueryData(
          CUSTOMER_NOTES_BASE_URL,
          { orderNo: orderDetails.ord_no, barCd: barcodeInfo.barcodeNumber, storeNo: recieveStoreCode },
        )
      : '';
  }
);
