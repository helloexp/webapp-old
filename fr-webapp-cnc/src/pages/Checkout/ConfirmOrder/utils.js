import { createSelector } from 'reselect';
import { getOrderDetails } from 'redux/modules/checkout/order/selectors';
import { getDeliveryMethodListOfDiv } from 'redux/modules/checkout/delivery/selectors';
import { constructTimeFrameMessage } from 'utils/formatDate';
import { getTranslation } from 'i18n';
import { getGuestUserOrderDeliveryString } from 'utils/applePay';
import { getDelvDateTime, getShippingMethodDescription, isShippingDeliveryType } from 'utils/deliveryUtils';
import getSiteConfig from 'config/site';

export function isUqStorePayment(orderDetails) {
  const { payment: { uniqloStore } } = getSiteConfig();

  return orderDetails && orderDetails.payment_type === uniqloStore;
}

export function renderPaymentMethod(orderConfirmDetails, giftCardPayment = '', i18n) {
  const { gds, payment: { cashOnDelivery, creditCard, giftCard, postPay, applePay } } = getSiteConfig();
  const { orderConfirmation, paymentMethod } = i18n;

  switch (orderConfirmDetails && orderConfirmDetails.payment_type) {
    case giftCard:
      return orderConfirmation.giftCard;

    case creditCard:
      if (orderConfirmDetails.gift_card_flg === gds.positive) {
        return orderConfirmation.giftCredit;
      }

      return orderConfirmation.creditCard;

    case cashOnDelivery:
      return orderConfirmation.cashOnDelivery;

    case postPay:
      return paymentMethod.postPay.join('');

    case applePay:
      return orderConfirmation.applePay;

    default:
      break;
  }

  return null;
}

/**
 * @public
 * Get delivery_details of selectd delivery_type from order api,
 */
const getDeliveryMethodDetail = createSelector(
  [getOrderDetails],
  orderDetails => ({
    deliveryReqTime: orderDetails.order_delv.delv_req_time,
    deliveryReqDate: orderDetails.order_delv.delv_req_dt,
    deliveryType: orderDetails.order_delv.delv_type,
  })
);

/**
 * @private
 * Get delivery_details of selectd delivery_type from delivery_selectable api,
 */
const getSelectedDeliveryDetail = createSelector(
  [getDeliveryMethodListOfDiv, getOrderDetails],
  (deliveryMethodList, orderDetails) =>
  deliveryMethodList.deliveryDetails && deliveryMethodList.deliveryDetails.find(item => item.deliveryType === orderDetails.order_delv.delv_type)
);

/**
 * @private
 * For Pay_at_store orders, planned delivery dates are fetched using delivery_selectable api,
 * which are returned by this selector.
 */
const getUQPlannedDates = createSelector(
  [getSelectedDeliveryDetail],
  selectedDeliveryDetail => selectedDeliveryDetail && { ...selectedDeliveryDetail } || {}
);

/**
 * @public
 * Return planned_delivery_dates of the order.
 */
export const getPlannedDates = createSelector(
  [getOrderDetails, getUQPlannedDates],
  (orderDetails, plannedDates) => {
    const [dateInfo = {}] = orderDetails && orderDetails.mwm_shipping_info_list || [];

    if (isUqStorePayment(orderDetails)) {
      return { ...plannedDates };
    }

    return {
      plannedDateFrom: dateInfo.planned_delivery_date_from,
      plannedDateTo: dateInfo.planned_delivery_date_to,
    };
  }
);

/**
 * @public
 * Get delivery_details of selectd delivery_type from order api,
 */
const getOrderDeliveryMethodList = createSelector(
  [getOrderDetails, getPlannedDates],
  (orderDetails, plannedDates) =>
  ({
    deliveryDetails: [{
      deliveryType: orderDetails.order_delv.delv_type,
      ...plannedDates,
    }],
  })
);

/**
 * @private
 * Get shipping timeframe from order api,
 */
const getShippingFrame = createSelector(
  [getDeliveryMethodDetail, getOrderDeliveryMethodList],
  (deliveryMethod, deliveryMethodList) =>
  constructTimeFrameMessage(deliveryMethod, getTranslation(), deliveryMethodList)
);

/**
 * @public
 * Get timeframe message to be shown from order api,
 */
export const getTimeFrameMessage = createSelector(
  [getShippingFrame],
  shippingFrame =>
  (shippingFrame ? shippingFrame.title : getTranslation().checkout.standardTime)
);

/**
 * @public
 * Get getOrderArrivalDate using order api,
 */
export const getOrderArrivalDate = createSelector(
  [getShippingFrame, getOrderDeliveryMethodList, getOrderDetails],
  (shippingFrame, deliveryMethodList, orderDetails) => {
    const deliveryTypeApplied = orderDetails.order_delv.delv_type;
    const isShipping = !!isShippingDeliveryType(deliveryTypeApplied);

    if (isShipping) {
      return (shippingFrame
        ? shippingFrame.shipping
        : getShippingMethodDescription({ shippingType: 'defaultDelivery', deliveryMethodList })
      );
    }

    return getDelvDateTime(deliveryTypeApplied, { deliveryTypeApplied, deliveryMethodList });
  }
);

/**
 * @public
 * For guest users, we get delivery date and time selected from applePay state.
 * Returns the order arrival string to be displayed based on the user selection.
 */
export const getGuestUserOrderDeliveryDate = state => getGuestUserOrderDeliveryString(state.applePay.shippingMethod.identifier);

/**
 * @public
 * The emailAddress used by guest users must be prefilled in the account registration form.
 * Returns the contact emailId given by user for placing order
 */
export const getGuestUserEmail = state => state.applePay.shippingContact.emailAddress;

export const isAccountRegistrationComplete = state => state.order.isRegistrationSuccess;

export const shouldShowRegistrationModal = state => state.order.isRegistrationModalActive;
