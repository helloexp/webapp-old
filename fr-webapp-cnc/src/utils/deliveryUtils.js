import { getDateFromValue, getDayString, getDateAfter, timeForCode, addDays } from 'utils/formatDate';
import char from 'utils/characters';
import constants, { brandName } from 'config/site/default';
import { getTranslation } from 'i18n';
import { getCurrentBrand, getCurrentBrandFromLocation } from 'utils/routing';

const {
  deliveryTypes: {
    SEJ,
    LAWSON,
    FM,
    SHIPPING,
    YU_PACKET,
    YAMATO_MAIL,
    SAME_DAY,
    STORE_PICKUP,
  },
  shippingTypes,
  deliveryAfterDays: {
    cvsDays,
    uqStoreDays,
  },
  cvsStoreNames,
  SHIPPING_THRESHOLD_PRICE,
  NULL_TIMEFRAME,
  brand: brandCode,
} = constants;

// cache i18n across functions. But trigger the getTranslation call late.
let i18n;

function setTranslation() {
  if (!(i18n && i18n.common)) {
    i18n = getTranslation();
  }
}

function findDeliveryDetails(deliveryMethodList, deliveryType) {
  return (
    deliveryMethodList &&
    deliveryMethodList.deliveryDetails &&
    deliveryMethodList.deliveryDetails.find(item => item.deliveryType === deliveryType)
  );
}

/**
 * Utility for getting the address panel title and variation for different deliveyr types.
 * @param  {String}   deliveryType
 * @param  {Object}   deliveryText - titles for different delivery types
 * @param  {String}   brand -Current brand
 * @return {Object}  { title, variation }
 */
export function getDeliveryMethodInfo(deliveryType, deliveryText, brand = brandName.uq) {
  const details = {
    title: deliveryText.shipping,
    variation: '',
  };

  switch (deliveryType) {
    case SHIPPING:
    case YU_PACKET:
    case SAME_DAY:
      details.title = deliveryText.shipping;
      break;
    case STORE_PICKUP:
      details.title = deliveryText.pickupStore[brand];
      details.variation = 'uqStoreAddress';
      break;
    case SEJ:
    case LAWSON:
    case FM:
      details.title = deliveryText.pickupConvenience[brand];
      details.variation = 'cvsAddress';
      break;
    default:
      details.title = deliveryText.shipping;
      break;
  }

  return details;
}

export function getShippingFee(deliveryType, shippingFeeParams, sameDayDeliveryCharges) {
  setTranslation();
  const { shippingThreshold, totalAmount, isFirstOrder } = shippingFeeParams;
  const brand = getCurrentBrandFromLocation();
  let fee = '';
  let sameDayshippingFee = '';
  let freeShippingText = i18n.checkout.free;

  const deliveryItem = shippingThreshold.find(item => item.deliveryType === deliveryType && item.brandCode === brandCode[brand]);
  const thresholdPrice = (deliveryItem && deliveryItem.thresholdPrice && deliveryItem.deliveryType === STORE_PICKUP)
    ? parseInt(deliveryItem.thresholdPrice, 10)
    : SHIPPING_THRESHOLD_PRICE[brand];

  if (shippingThreshold.length) {
    if (deliveryType === SAME_DAY && sameDayDeliveryCharges) {
      const sameDayItem = sameDayDeliveryCharges.find(item => item.brandCode === brandCode[brand]);

      freeShippingText = `${i18n.common.currencySymbol} ${sameDayItem.shippingFee}`;
      sameDayshippingFee = ` + ${i18n.checkout.shippingCharge} ${freeShippingText}`;
    }

    if (deliveryItem && ~~deliveryItem.shippingFee === 0) {
      fee = freeShippingText;
    } else {
      fee = deliveryItem && totalAmount < thresholdPrice
      ? `${i18n.common.currencySymbol} ${deliveryItem.shippingFee}${sameDayshippingFee}`
      : freeShippingText;
    }
  }

  if (isFirstOrder && totalAmount < thresholdPrice) {
    return freeShippingText;
  }

  return fee;
}

/**
 * Utility for checking if the shipping fee(or any formatted amount) has an amount or the "free"
 * label inside it. Useful in situations where the style of label varies depending on this.
 * Passing falsy amounts will return false as that is not free shipping text.
 *
 * @param  {String}   shippingFee Formatted amount text
 * @return {Boolean}              True if this is a free shipping message
 */
export function isFreeShippingText(shippingFee) {
  setTranslation();

  return shippingFee && !shippingFee.includes(i18n.common.currencySymbol);
}

// Generic function to get formated delivery lead times with texts
function getFormattedDeliveryDateTime({ type, initialDate, finalDate, time, isShipping }) {
  setTranslation();
  const {
    deliveryScheduleOn,
    deliveryScheduleBetween,
    deliveryScheduleUntil,
    deliveryScheduleToday,
  } = i18n.delivery;
  const initialDateString = `${initialDate}(${getDayString(initialDate, i18n)})`;
  const finalDateString = `${char['~']}${finalDate}(${getDayString(finalDate, i18n)})`;
  let scheduleString = deliveryScheduleUntil;

  switch (type) {
    case 'today':
      return deliveryScheduleToday;
    case 'on':
      scheduleString = isShipping ? scheduleString : deliveryScheduleOn;

      return `${initialDateString} ${time}${scheduleString}`;
    case 'between':
      scheduleString = isShipping ? scheduleString : deliveryScheduleBetween;

      return `${initialDateString}${finalDateString}${scheduleString}`;
    case 'betweenWithTime':
      scheduleString = isShipping ? scheduleString : deliveryScheduleBetween;

      return `${initialDateString}${finalDateString} ${time} ${scheduleString}`;
    case 'until':
      return `${initialDateString} ${deliveryScheduleUntil}`;
    case 'untilWithTime':
      return `${initialDateString} ${time} ${deliveryScheduleUntil}`;
    default:
      return '';
  }
}

function getDeliveryDateTimeForNonShipping(deliveryData) {
  const { plannedDateFrom, plannedDateTo, equalTypes, deliveryDays, between } = deliveryData;
  const args = { ...between };

  if (equalTypes && plannedDateFrom && plannedDateTo) {
    args.initialDate = getDateFromValue(plannedDateFrom.slice(0, 8));
    if (plannedDateFrom === plannedDateTo) {
      args.type = 'on';
      args.time = '';
    } else {
      args.finalDate = getDateFromValue(plannedDateTo.slice(0, 8));
    }
  } else {
    args.initialDate = getDateAfter(deliveryDays.initial);
    args.finalDate = getDateAfter(deliveryDays.final);
  }

  return args;
}

/**
 * Get delivery lead time to be displayed in delivery methods
 * @param {String} deliveryType
 * @param {Object} deliveryData
 * @param {DeliveryMethodList} deliveryData.deliveryMethodList
 * @param {String} deliveryData.deliveryTypeApplied
 * @param {Bool} isSelectionView set as true for delivery edit top.
 * You only need to check planned_date_from and planned_time in that case.
 * @return {string}
 */
export function getDelvDateTime(deliveryType, deliveryData, isSelectionView = false) {
  setTranslation();
  const { deliveryMethodList = {}, deliveryTypeApplied } = deliveryData;
  const equalTypes = deliveryTypeApplied === deliveryType;
  const deliveryOption = findDeliveryDetails(deliveryMethodList, deliveryType);
  let args = null;

  if (deliveryOption) {
    const { plannedDateFrom, plannedDateTo, plannedTime, spareDate = 0 } = deliveryOption;
    const equalDates = plannedDateFrom === plannedDateTo;
    const deliveryArgs = { ...deliveryOption, equalTypes, between: { type: 'between' } };

    switch (deliveryType) {
      case YAMATO_MAIL:
      case SHIPPING:
        if (plannedDateFrom && plannedDateTo && plannedTime && !isSelectionView) {
          args = equalDates
            ? {
              type: 'on',
              initialDate: addDays(plannedDateTo, spareDate),
              time: plannedTime,
            }
            : {
              type: 'between',
              initialDate: getDateFromValue(plannedDateFrom.slice(0, 8)),
              time: plannedTime,
              finalDate: addDays(plannedDateTo, spareDate),
            };
        } else if (plannedDateFrom && plannedTime) {
          args = {
            type: 'on',
            initialDate: getDateFromValue(plannedDateFrom.slice(0, 8)),
            time: plannedTime,
          };
        } else if (equalTypes && plannedDateFrom && plannedDateTo && !plannedTime) {
          args = equalDates
            ? {
              type: 'until',
              initialDate: addDays(plannedDateTo, spareDate),
            }
            : {
              type: 'between',
              initialDate: getDateFromValue(plannedDateFrom.slice(0, 8)),
              finalDate: addDays(plannedDateTo, spareDate),
            };
        }
        break;
      case SEJ:
      case LAWSON:
      case FM:
        args = getDeliveryDateTimeForNonShipping({ ...deliveryArgs, deliveryDays: cvsDays });
        break;
      case STORE_PICKUP:
        args = getDeliveryDateTimeForNonShipping({ ...deliveryArgs, deliveryDays: uqStoreDays });
        break;
      default:
        break;
    }
  }

  return args
    ? getFormattedDeliveryDateTime(args)
    : '';
}

// function to get delivery lead time to be diplayed in shipping methods
export function getShippingMethodDescription(props) {
  setTranslation();
  let args = null;
  const { shippingType, deliveryMethodList, deliveryMethod, fromOrderConfirm } = props;
  const shippingSelectOption = findDeliveryDetails(deliveryMethodList, SHIPPING) || {};
  const { plannedDateFrom, plannedDateTo, spareDate = 0 } = shippingSelectOption;

  switch (shippingType) {
    case 'today':
      const sameDaytOption = findDeliveryDetails(deliveryMethodList, SAME_DAY);

      if (sameDaytOption) {
        args = {
          type: 'today',
        };
      }
      break;
    case 'defaultDelivery':
      if (plannedDateFrom && plannedDateTo) {
        args = plannedDateFrom === plannedDateTo
          ? {
            type: 'until',
            initialDate: addDays(plannedDateTo, spareDate),
            isShipping: true,
          }
          : {
            type: 'between',
            initialDate: getDateFromValue(plannedDateFrom.slice(0, 8)),
            finalDate: addDays(plannedDateTo, spareDate),
            isShipping: true,
          };
      }
      break;
    case 'selectedDelivery':
      if (shippingSelectOption && deliveryMethod) {
        const { deliveryReqDate, deliveryReqTime } = deliveryMethod;

        if (deliveryReqDate && deliveryReqTime && deliveryReqTime !== NULL_TIMEFRAME) {
          args = {
            type: 'untilWithTime',
            initialDate: getDateFromValue(deliveryReqDate.slice(0, 8)),
            time: timeForCode(deliveryReqTime, i18n.delivery),
            isShipping: true,
          };
        } else if (deliveryReqDate && !deliveryReqTime || deliveryReqTime === NULL_TIMEFRAME) {
          args = {
            initialDate: getDateFromValue(deliveryReqDate.slice(0, 8)),
            type: 'until',
            isShipping: true,
          };
        } else if (!deliveryReqDate && deliveryReqTime && deliveryReqTime !== NULL_TIMEFRAME) {
          if (plannedDateFrom && plannedDateTo) {
            args = {
              type: 'betweenWithTime',
              initialDate: getDateFromValue(plannedDateFrom.slice(0, 8)),
              finalDate: addDays(plannedDateTo, spareDate),
              time: timeForCode(deliveryReqTime, i18n.delivery),
              isShipping: true,
            };
          } else if (fromOrderConfirm) {
            return timeForCode(deliveryReqTime, i18n.delivery);
          }
        }
      }
      break;
    case 'yuPacket':
      const yuPacketOption = findDeliveryDetails(deliveryMethodList, YU_PACKET);

      if (yuPacketOption) {
        const { plannedDateFrom: yuPlannedDateFrom, plannedDateTo: yuPlannedDateTo } = yuPacketOption;

        if (yuPlannedDateFrom && yuPlannedDateTo) {
          args = {
            type: 'between',
            initialDate: getDateFromValue(yuPlannedDateFrom.slice(0, 8)),
            finalDate: getDateFromValue(yuPlannedDateTo.slice(0, 8)),
          };
        }
      }
      break;
    case 'nekoposPacket': {
      const option = findDeliveryDetails(deliveryMethodList, YAMATO_MAIL);

      if (option) {
        const { plannedDateFrom: nekoPlannedDateFrom, plannedDateTo: nekoPlannedDateTo } = option;

        if (nekoPlannedDateFrom && nekoPlannedDateTo) {
          args = {
            type: 'between',
            initialDate: getDateFromValue(nekoPlannedDateFrom.slice(0, 8)),
            finalDate: getDateFromValue(nekoPlannedDateTo.slice(0, 8)),
          };
        }
      }
      break;
    }
    default:

  }

  return args
    ? getFormattedDeliveryDateTime(args)
    : '';
}

/**
 * Util method to obtain CVS store address in display format.
 * @param {Object} cvsAddress - Saved CVS store address if any
 * @return {Object}        Return CVS Store Address in  proper format
 **/
export function buildCvsStoreAddress(cvsAddresses) {
  setTranslation();
  const { address: { postalPrefix } } = i18n;

  const formatedAddresses = cvsStoreNames.reduce((address, brand) => {
    const cvsAddress = cvsAddresses[brand];

    address[brand] = null;
    if (cvsAddress && cvsAddress.addressNumber) {
      address[brand] = [
        `${cvsAddress.firstName}`,
        `${postalPrefix}${cvsAddress.postalCode}`,
        `${cvsAddress.prefecture}${cvsAddress.street}`,
      ];
    }

    return address;
  }, {});

  return formatedAddresses;
}

/**
 * Utility to check shipping delivery type
 * @param {String} Saved deliveryType
 * @return {Boolean} Returns true if it is a Shipping delivery type
 */
export function isShippingDeliveryType(deliveryType) {
  return shippingTypes.includes(deliveryType);
}

/**
 * Check if delivery methods are coming under 'shipping' category
 * @param {Array.<DelvMethodObj>} deliveryMethods
 * @returns {Boolean}
 */
export function isShippingDeliveryMethods(deliveryMethods = []) {
  // using negation for iteration could be pre-emptive.
  return !deliveryMethods.find(item => !isShippingDeliveryType(item.deliveryType));
}

/**
 * Utility to ckeck CVS store delivery type
 * @param {String} Saved deliveryType
 * @return {Boolean} Returns true if it is a CVS delivery type
 */
export function isCVSDeliveryType(deliveryType) {
  return [SEJ, FM, LAWSON].includes(deliveryType);
}

/**
 * Utility to check CVS store address
 * @param {Object} Saved CVS address
 * @return {String} Returns string if it is a valid uq store address
 */
export function isCVSAddress(address) {
  return address
    && address.receiverCorporateName
    && address.receiverDeptName
    && address.prefecture;
}

/**
 * Utility to check UQ store address *
 * @return {Object} Saved store address
 * @return {String} Returns string if it is a valid uq store address
 */
export function isPickupStoreAddress(address) {
  return address
    && address.street
    && address.city
    && address.prefecture
    && address.phoneNumber;
}

/**
 * Utility to ckeck STORE_PICKUP delivery type
 * @return {String} Saved store address
 * @return {Boolean} Returns true if it is a STORE_PICKUP delivery type
 */
export function isStorePickupDeliveryType(deliveryType) {
  return deliveryType === STORE_PICKUP;
}

/**
 * Utility to ckeck if arrays inside object is empty
 * @params {object} filterObject - object to be checked
 * @return {Boolean} Returns true if arrays inside object is not empty.
 */
export function isFilterActive(filterObject) {
  return Object.keys(filterObject || {}).some(key => filterObject[key].length);
}

/**
 * Method to return freeShipping message if cart does't qualify for free shipping.
 * @param {Number} totalAmount - total amount of products in cart
 * @param {String} price - Shipping fee
 * @param {String} shippingThreshold - The threshold amount to avail free shipping
 * @return {String} - Free shipping message.
 */
export function getFreeShippingMessage(totalAmount, price, shippingThreshold) {
  setTranslation();
  const brand = getCurrentBrandFromLocation();
  const { cart: { free: freeText }, checkout: { freeShippingMessage: freeShippingText } } = i18n;
  const remainingAmount = (shippingThreshold || SHIPPING_THRESHOLD_PRICE[brand]) - totalAmount;
  const freeShippingMessage = remainingAmount > 0 && price !== freeText
    ? freeShippingText.replace('XXX', remainingAmount)
    : '';

  return freeShippingMessage;
}

/**
 * @typedef {Object} DelvMethodObj
 * @property {String} splitNo
 * @property {String} deliveryType
 * @property {String} deliveryReqDate
 * @property {String} deliveryReqTime
 */

/**
 * Creates an object whose keys are encoded query strings (as per GDS `PUT /delivery` doc)
 * @param {Array.<DelvMethodObj>} deliveryMethods
 * @param {Boolean} isApplePayOrder - True for Apple Pay order
 * @returns {Object}
 */
export function getDeliveryReqListParams(deliveryMethods, isApplePayOrder = false) {
  return deliveryMethods.reduce((acc, method, index) => {
    const prefix = isApplePayOrder ? `delv_req_list[${index}].` : encodeURIComponent(`delvReqList[${index}].`);
    const reqMethod = {
      ...acc,
      [`${prefix}split_no`]: method.splitNo,
      [`${prefix}delv_type`]: method.deliveryType || '',
    };

    if (shippingTypes.includes(method.deliveryType)) {
      reqMethod[`${prefix}delv_req_dt`] = method.deliveryReqDate || '';
      reqMethod[`${prefix}delv_req_time`] = method.deliveryReqTime || '';
    }

    return reqMethod;
  }, {});
}

export function isUserDefaultAddressComplete(defaultAddress) {
  return !!(defaultAddress
    && defaultAddress.firstName
    && defaultAddress.lastName
    && defaultAddress.firstNameKatakana
    && defaultAddress.lastNameKatakana
    && defaultAddress.prefecture
    && defaultAddress.street
    && defaultAddress.city
    && defaultAddress.phoneNumber
  );
}

export function getShippingThresholdOfDeliveryType(globalState, deliveryType) {
  const { delivery: { shippingThreshold } } = globalState;
  const brand = getCurrentBrand(globalState);
  const deliveryItem = shippingThreshold.find(item => item.deliveryType === deliveryType && item.brandCode === brandCode[brand]);

  return (deliveryItem && deliveryItem.thresholdPrice) ? parseInt(deliveryItem.thresholdPrice, 10) : SHIPPING_THRESHOLD_PRICE[brand];
}
