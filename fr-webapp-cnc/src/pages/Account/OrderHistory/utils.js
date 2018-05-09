import char from 'utils/characters';
import { getDateFromValue, getDayString, timeForCode } from 'utils/formatDate';
import castArray from 'utils/castArray';
import { isCVSDeliveryType } from 'utils/deliveryUtils';
import { mapOrderHistory } from 'redux/modules/account/mappings/orderHistoryMappings';
import { sortInAscendingOrder, sortInDescendingOrder } from 'utils/sort';
import getSiteConfig from 'config/site';

const config = getSiteConfig();
const { SHIPPING, SEJ, LAWSON, FM, YU_PACKET, YAMATO_MAIL, SAME_DAY, STORE_PICKUP } = config.deliveryTypes;
const { creditCard, giftCard, cashOnDelivery, uniqloStore, postPay, applePay } = config.payment;
const orderRecievedStatus = config.order.orderStatus;

// Order status text based on delv_type, disp_store_recev_stts and ord_sts
export function getStatusValue(item, orderHistory) {
  let statusValue;
  const { deliveryType, storeReceiveStatus, orderStatus } = item;

  if (storeReceiveStatus && storeReceiveStatus !== '0') {
    switch (deliveryType) {
      case STORE_PICKUP:
        statusValue = orderHistory.UQStoreOrderStatus[storeReceiveStatus];
        break;
      case SEJ:
        statusValue = orderHistory.SEJOrderStatus[storeReceiveStatus];
        break;
      case LAWSON:
        statusValue = orderHistory.lawsonOrderStatus[storeReceiveStatus];
        break;
      case FM:
        statusValue = orderHistory.familyMartOrderStatus[storeReceiveStatus];
        break;
      default:
        statusValue = '';
        break;
    }
  } else {
    statusValue = orderHistory.shippingOrderStatus[orderStatus];
  }

  return statusValue;
}

export function getFormattedDate(date) {
  return date ? getDateFromValue(date.substring(0, 8)) : '';
}

function getLatestDate(list, key) {
  let data = {};

  if (key === 'receiveExpireDate') {
    data = sortInAscendingOrder(list, key)[0];
  } else {
    data = sortInDescendingOrder(list, key)[0];
  }

  return getDateFromValue((data && data[key] && data[key] || '').substring(0, 8));
}

function getDeliveryDate(order, i18n, deliverySelectableDates) {
  const {
    orderStatus,
    deliveryType,
    orderReceiptDate,
    plannedDeliveryDateFrom,
    plannedDeliveryDateTo,
    deliveryRequestDate,
    deliveryRequestTime,
  } = order;

  let plannedDateFrom = '';
  let plannedDateTo = '';
  let formattedPlannedDelvDateFrom = '';
  let formattedPlannedDelvDateTo = '';
  let plannedDelvDate = '';

  if (deliverySelectableDates) {
    plannedDateFrom = deliverySelectableDates.plannedDateFrom;
    plannedDateTo = deliverySelectableDates.plannedDateTo;
    formattedPlannedDelvDateFrom = plannedDateFrom && getFormattedDate(plannedDateFrom) || null;
    formattedPlannedDelvDateTo = plannedDateTo && getFormattedDate(plannedDateTo) || null;
    const datesAreOK = formattedPlannedDelvDateFrom && formattedPlannedDelvDateTo;
    const dayFrom = datesAreOK && getDayString(formattedPlannedDelvDateFrom, i18n);
    const dayTo = datesAreOK && getDayString(formattedPlannedDelvDateTo, i18n);

    plannedDelvDate = datesAreOK ?
      `${formattedPlannedDelvDateFrom}(${dayFrom})${char['~']}${formattedPlannedDelvDateTo}(${dayTo})` :
      '';
  }

  if (orderStatus === orderRecievedStatus && plannedDelvDate) {
    return plannedDelvDate;
  }

  const formattedPlannedDateFrom = plannedDeliveryDateFrom && getDateFromValue(plannedDeliveryDateFrom) || null;
  const formattedPlannedDateTo = plannedDeliveryDateTo && getDateFromValue(plannedDeliveryDateTo) || null;
  const formattedDeliveryRequestDate = deliveryRequestDate && getDateFromValue(deliveryRequestDate) || null;
  const datesAreOK = formattedPlannedDateFrom && formattedPlannedDateTo;
  const dayFrom = datesAreOK && getDayString(formattedPlannedDateFrom, i18n);
  const dayTo = datesAreOK && getDayString(formattedPlannedDateTo, i18n);
  const plannedDeliveryDate = datesAreOK ?
    `${formattedPlannedDateFrom}(${dayFrom})${char['~']}${formattedPlannedDateTo}(${dayTo})` :
    '';
  let deliveryDate = plannedDeliveryDate;

  switch (deliveryType) {
    case SAME_DAY:
      const formattedOrderReceiptDate = orderReceiptDate && getDateFromValue(orderReceiptDate.substring(0, 8)) || null;
      const dateDay = getDayString(formattedOrderReceiptDate, i18n) && `(${getDayString(formattedOrderReceiptDate, i18n)})` || '';

      deliveryDate = formattedOrderReceiptDate
        ? `${formattedOrderReceiptDate} ${dateDay}`
        : '';
      break;
    case SHIPPING:
      if (deliveryRequestDate && deliveryRequestTime && deliveryRequestTime !== '00') {
        deliveryDate = `${formattedDeliveryRequestDate}(${getDayString(formattedDeliveryRequestDate, i18n)})
        ${timeForCode(deliveryRequestTime, i18n.delivery)}`;
      } else if (deliveryRequestDate && (!deliveryRequestTime || deliveryRequestTime === '00')) {
        deliveryDate = formattedDeliveryRequestDate
          ? `${formattedDeliveryRequestDate}(${getDayString(formattedDeliveryRequestDate, i18n)})`
          : '';
      } else if (deliveryRequestTime && deliveryRequestTime !== '00') {
        deliveryDate = `${plannedDeliveryDate} ${timeForCode(deliveryRequestTime, i18n.delivery)}`;
      } else if (plannedDeliveryDateFrom === plannedDeliveryDateTo) {
        deliveryDate = plannedDeliveryDateTo
          ? `${formattedPlannedDateTo}(${getDayString(formattedPlannedDateTo, i18n)})`
          : '';
      }

      break;
    default:
      break;
  }

  return deliveryDate;
}

function getPickupDeadlineOrCompletionDate(item, i18n) {
  const { orderHistory } = i18n;
  const { deliveryType, storeReceiveStatus, storeReceiveDetailList, recieverStoreExpireNoticeDate } = item;
  let pickupDeadlineDate;
  const latestReceiveExpireDate = storeReceiveDetailList && storeReceiveDetailList.length
    ? getLatestDate(storeReceiveDetailList, 'receiveExpireDate')
    : '';
  const formattedReceiveExpireDate = latestReceiveExpireDate
    && `${orderHistory.pickupDeadlineDate}: ${latestReceiveExpireDate} (${getDayString(latestReceiveExpireDate, i18n)})`;
  const expireNoticeDate = recieverStoreExpireNoticeDate && getFormattedDate(recieverStoreExpireNoticeDate);
  const formattedExpireNoticeDate = expireNoticeDate
    && `${orderHistory.pickupDeadlineDate}: ${expireNoticeDate} (${getDayString(expireNoticeDate, i18n)})`;
  const latestStoreArrivalDate = storeReceiveDetailList && storeReceiveDetailList.length
    ? getLatestDate(storeReceiveDetailList, 'storeArrivalDate')
    : '';

  const formattedStoreArrivalDate = latestStoreArrivalDate
    && `${orderHistory.storeArrivalDate}: ${latestStoreArrivalDate} (${getDayString(latestStoreArrivalDate, i18n)})`;

  switch (storeReceiveStatus) {
    // orderStatus = '10' packet arrived to store
    case '10':
      if (isCVSDeliveryType(deliveryType)) {
        pickupDeadlineDate = formattedReceiveExpireDate
          ? [formattedReceiveExpireDate, formattedStoreArrivalDate]
          : '';
      } else if (deliveryType === STORE_PICKUP) {
        pickupDeadlineDate = formattedExpireNoticeDate
         ? [formattedExpireNoticeDate, formattedStoreArrivalDate]
         : '';
      }
      break;
    // orderStatus = '30' Return preparation
    // orderStatus = '40' Return completed
    case '30':
    case '40':
      if (isCVSDeliveryType(deliveryType)) {
        pickupDeadlineDate = formattedReceiveExpireDate || '';
      } else if (deliveryType === STORE_PICKUP) {
        pickupDeadlineDate = formattedExpireNoticeDate || '';
      }
      break;
    // orderStatus = '20' Delivery completed
    case '20':
      const delvCompletionDate = storeReceiveDetailList && storeReceiveDetailList.length
        ? getLatestDate(storeReceiveDetailList, 'storeReceiptDate')
        : '';

      pickupDeadlineDate = delvCompletionDate
      ? `${orderHistory.deliveryCompletionDate}: ${delvCompletionDate} (${getDayString(delvCompletionDate, i18n)})`
      : '';
      break;
    default:
      pickupDeadlineDate = '';
      break;
  }

  return pickupDeadlineDate;
}

export function getPlannedDeliveryDate(item, i18n, deliverySelectableDates) {
  const {
    storeReceiveStatus,
    storeReceiveDetailList,
    orderStatus,
    deliveryType,
  } = item;

  const { orderHistory } = i18n;
  let plannedDeliveryDate = '';

  /*  Conditions to display Planned Delivery Date or Pickup Available Date or Delivery Completion Data
  based on delv_type, disp_store_recev_stts and ord_sts */
  if ((storeReceiveStatus === '05' && deliveryType !== SEJ) ||
  (storeReceiveStatus === '0' && ['010', '020', '030', '040'].includes(orderStatus))) {
    plannedDeliveryDate = `${orderHistory.estimatedDeliveryDate}: ${getDeliveryDate(item, i18n, deliverySelectableDates)}`;
  } else if (storeReceiveStatus === '05' && deliveryType === SEJ) {
    const storeReceiveList = storeReceiveDetailList[storeReceiveDetailList.length - 1] || {};
    const storeReceiveDate = getDateFromValue(storeReceiveList.receivePosssibleDate.substring(0, 8));
    const storeReceiveDay = getDayString(storeReceiveDate, i18n);

    plannedDeliveryDate = `${orderHistory.pickupAvailableDate}: ${storeReceiveDate} (${storeReceiveDay})`;
  } else {
    plannedDeliveryDate = getPickupDeadlineOrCompletionDate(item, i18n);
  }

  return plannedDeliveryDate;
}

export function getUniqueStatus(item) {
  const {
    deliveryType,
    deliverySlipNumber,
    deliveryTraderNumber,
    recieverStoreName,
    recieverStoreCode,
    paymentNumber,
    storeReceiveDetailList,
    barcodeURL,
    orderStatus,
    recieverCorporateName,
    storeReceiveStatus,
  } = item;
  const {
    uniqueShippingStatus,
    uniqueUQStoreStatus,
    uniqueSEJStatus,
    uniqueLawsonStatus,
    uniqueFMStatus,
  } = config;
  const isOrderCancelled = orderStatus === '060';
  const waitingForArrival = storeReceiveStatus === '05';
  let uniqueStatus = {};
  let labelText1;
  let labelText2;
  let statusText1;

  switch (deliveryType) {
    case SHIPPING:
    case YU_PACKET:
    case YAMATO_MAIL:
    case SAME_DAY:
      const shippingStatus = deliveryTraderNumber && uniqueShippingStatus[deliveryTraderNumber];
      const slipNoLink = shippingStatus
        ? shippingStatus.slipNumberLink && [`${shippingStatus.slipNumberLink}${deliverySlipNumber}`] || [shippingStatus.companyLink]
        : [];

      uniqueStatus = {
        uniqueStatusLabel1: uniqueShippingStatus.deliveryCompany,
        uniqueStatusLabel2: uniqueShippingStatus.deliverySlipNumber,
        uniqueStatusTexts1: shippingStatus ? [shippingStatus.companyText] : [],
        uniqueStatusLinks1: shippingStatus ? [shippingStatus.companyLink] : [],
        uniqueStatusTexts2: castArray(deliverySlipNumber),
        uniqueStatusLinks2: slipNoLink,
      };
      break;
    case STORE_PICKUP:
      labelText1 = !isOrderCancelled && recieverStoreName && recieverCorporateName ? uniqueSEJStatus.delieryStoreName : '';
      statusText1 = recieverCorporateName && recieverStoreName ? `${recieverCorporateName} ${recieverStoreName}` : '';
      uniqueStatus = {
        uniqueStatusLabel1: labelText1,
        uniqueStatusTexts1: castArray(statusText1),
        uniqueStatusLinks1: recieverStoreCode
          ? [`${uniqueUQStoreStatus.deliveryStoreLink}${recieverStoreCode}`]
          : [],
      };
      break;
    case SEJ:
      labelText1 = !isOrderCancelled && recieverStoreName && recieverCorporateName ? uniqueSEJStatus.delieryStoreName : '';
      labelText2 = !isOrderCancelled && paymentNumber && barcodeURL ? uniqueSEJStatus.deliverySlipNumber : '';
      statusText1 = recieverCorporateName && recieverStoreName ? `${recieverCorporateName} ${recieverStoreName}` : '';
      uniqueStatus = {
        uniqueStatusLabel1: labelText1,
        uniqueStatusLabel2: labelText2,
        uniqueStatusTexts1: castArray(statusText1),
        uniqueStatusTexts2: castArray(paymentNumber),
        uniqueStatusLinks2: castArray(barcodeURL),
      };
      break;
    case LAWSON:
      labelText1 = !isOrderCancelled && recieverStoreName && recieverCorporateName ? uniqueLawsonStatus.delieryStoreName : '';
      labelText2 = !isOrderCancelled && storeReceiveDetailList.length && !waitingForArrival ? uniqueLawsonStatus.pickupNumberOrPassword : '';
      statusText1 = recieverCorporateName && recieverStoreName ? `${recieverCorporateName} ${recieverStoreName}` : '';
      uniqueStatus = {
        uniqueStatusLabel1: labelText1,
        uniqueStatusLabel2: labelText2,
        uniqueStatusTexts1: castArray(statusText1),
        uniqueStatusTexts2: labelText2 && storeReceiveDetailList.map(storeRecieveDetail => (
          storeRecieveDetail.deliveryNumber && storeRecieveDetail.recieverAuthKey
            && `${storeRecieveDetail.deliveryNumber} / ${storeRecieveDetail.recieverAuthKey}`
        )) || [],
        uniqueStatusLinks2: storeReceiveDetailList.map(storeRecieveDetail => (
          storeRecieveDetail.barcodePageURL || ''
        )),
      };
      break;
    case FM:
      labelText1 = !isOrderCancelled && recieverStoreName && recieverCorporateName ? uniqueFMStatus.delieryStoreName : '';
      labelText2 = !isOrderCancelled && storeReceiveDetailList.length && !waitingForArrival ? uniqueFMStatus.pickupNumberOrPassword : '';
      statusText1 = recieverCorporateName && recieverStoreName ? `${recieverCorporateName} ${recieverStoreName}` : '';
      uniqueStatus = {
        uniqueStatusLabel1: labelText1,
        uniqueStatusLabel2: labelText2,
        uniqueStatusTexts1: castArray(statusText1),
        uniqueStatusTexts2: labelText2 && storeReceiveDetailList.map(storeRecieveDetail => (
          storeRecieveDetail.deliveryNumber && storeRecieveDetail.recieverAuthKey
            && `${storeRecieveDetail.deliveryNumber} / ${storeRecieveDetail.recieverAuthKey}`
        )) || [],
      };
      break;
    default:
      uniqueStatus = {
        uniqueStatusLabel1: null,
        uniqueStatusLabel2: null,
        uniqueStatusTexts1: [''],
        uniqueStatusTexts2: [''],
        uniqueStatusLinks1: [],
        uniqueStatusLinks2: [],
      };
      break;
  }

  return uniqueStatus;
}

export function getPaymentMethodText(orderItemsDetail, paymentMethod, brand = config.brandName.uq) {
  switch (orderItemsDetail.payment_type) {
    case creditCard:
      if (orderItemsDetail.gift_card_flg === '1') {
        return [paymentMethod.creditCard, paymentMethod.giftCard];
      }

      return [paymentMethod.creditCard];
    case cashOnDelivery:
      return [paymentMethod.cashOnDelivery];
    case giftCard:
      return [paymentMethod.giftCard];
    case uniqloStore:
      return [paymentMethod.payAtStore[brand]];
    case postPay:
      return [paymentMethod.postPay.join('')];
    case applePay:
      return [paymentMethod.applePay];
    default:
      return [];
  }
}

export function getTitleAndVariation(deliveryType, orderHistory) {
  let title;
  let variation;

  switch (deliveryType) {
    case SHIPPING:
    case YU_PACKET:
    case SAME_DAY:
    case YAMATO_MAIL:
      title = orderHistory.address;
      break;
    case STORE_PICKUP:
      title = orderHistory.pickupUniqlo;
      variation = 'uqStoreAddress';
      break;
    case SEJ:
    case LAWSON:
    case FM:
      title = orderHistory.pickupConvenience;
      variation = 'cvsAddress';
      break;
    default:
      title = orderHistory.shipping;
      break;
  }

  return { title, variation };
}

export function getOrderData(orderItemsDetail, i18n, deliverySelectableDates) {
  const item = orderItemsDetail.orderNumber ? orderItemsDetail : mapOrderHistory(orderItemsDetail);
  const uniqueStatus = { uniqueStatus: getUniqueStatus(item) };

  return {
    isMultiDelivery: item.isMultiDelivery,
    formatedOrderDate: getFormattedDate(item.orderReceiptDate),
    statusValue: getStatusValue(item, i18n.orderHistory),
    plannedDeliveryDate: getPlannedDeliveryDate(item, i18n, deliverySelectableDates),
    barcodeURL: item.barcodeURL,
    ...uniqueStatus,
  };
}
