import { createSelector } from 'reselect';
import { getTranslation } from 'i18n';
import constants from 'config/site/default';
import { constructTimeFrameMessage } from 'utils/formatDate';
import { getShippingMethodDescription, getDelvDateTime } from 'utils/deliveryUtils';
import {
  getSplitDetailsOfDiv,
  isSplitDeliverySelected,
  getDeliveryTypeApplied,
  getDeliveryMethodOfDiv,
  getDeliveryMethodListOfDiv,
  getItems as getItemsOfDiv,
} from 'redux/modules/checkout/delivery/selectors';
import { getOrderSummary as getOrderSummarySelector } from 'redux/modules/checkout/order/selectors';
import getOrderSummary from 'redux/modules/checkout/mappings/orderSummaryMappings';
import { getCartItems as _getCartItems, getCartGift } from 'redux/modules/cart/selectors';

const getShippingFrame = createSelector(
  [getDeliveryMethodOfDiv, getDeliveryMethodListOfDiv],
  (deliveryMethod, deliveryMethodList) =>
    constructTimeFrameMessage(deliveryMethod, getTranslation(), deliveryMethodList)
);

export const getTimeFrameMessage = createSelector(
  [getShippingFrame],
  shippingFrame => (shippingFrame ? shippingFrame.title : getTranslation().checkout.standardTime)
);

export const getShippingFrameMessage = createSelector(
  [getShippingFrame, getDeliveryMethodListOfDiv],
  (shippingFrame, deliveryMethodList) => (
    (shippingFrame && shippingFrame.shipping)
      ? shippingFrame.shipping
      : getShippingMethodDescription({ shippingType: 'defaultDelivery', deliveryMethodList })
    )
);

export const getLeadDateTime = createSelector(
  [getDeliveryMethodListOfDiv, getDeliveryTypeApplied],
  (deliveryMethodList, deliveryTypeApplied) =>
    getDelvDateTime(deliveryTypeApplied, { deliveryTypeApplied, deliveryMethodList })
);

const getOrderSummaryOfDiv = createSelector(
  [getOrderSummarySelector, isSplitDeliverySelected, getSplitDetailsOfDiv],
  (orderSummary, isSplitDelivery, splitDetails) => (isSplitDelivery ? getOrderSummary(splitDetails) : orderSummary)
);

export const getShippingCost = createSelector(
  [getOrderSummaryOfDiv],
  orderSummary =>
    (orderSummary && orderSummary.shippingCost
      ? `${constants.CURRENCY_SYMBOL} ${orderSummary.shippingCost}`
      : getTranslation().common.free)
);

export const getGiftItem = createSelector(
  [getCartGift],
  cartGift =>
    (cartGift && cartGift.id && { image: `${constants.gifting.pathPrefix}${cartGift.id}${constants.gifting.pathSuffix}` })
);

export const getCartItems = createSelector(
  [getGiftItem, _getCartItems, getItemsOfDiv, isSplitDeliverySelected],
  (giftItem, items, splitItems, isSplitDelivery) => {
    if (isSplitDelivery) {
      return splitItems;
    }

    return (giftItem ? [...items, giftItem] : items);
  }
);
