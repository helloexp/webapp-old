import config from 'config';
import getSiteConfig from 'config/site';
import { LocalStorage } from 'helpers/WebStorage';
import { isSecuredConnection } from 'utils/routing';
import { routePatterns } from 'utils/urlPatterns';
import Validator from 'components/uniqlo-ui/core/Validation/Validator';
import { getDateFromValue, timeForCode, getDayString } from 'utils/formatDate';
import constants from 'config/site/default';
import { getTranslation } from 'i18n';

const { app: { localStorageKeys } } = config;

/**
 * Indicates whether the Apple Pay JS API is available
 * @type {Boolean}
 */
const isApplePaySessionAvailable = isSecuredConnection() && !!window.ApplePaySession;

/**
 * Gets ApplePay version from ApplePay JS API
 * @type {Number(2|3)|undefined}
 */
const applePayVersion = (() => {
  if (isApplePaySessionAvailable) {
    return [3, 2, 1].find(ver => window.ApplePaySession.supportsVersion(ver));
  }

  return undefined;
})();

/**
 * Gets required `shippingContact` fields for validation.
 * @returns {Array.<String>}
 */
function getRequiredShippingContactFields() {
  return [
    'postalAddress',
    'name',
    'phone',
    'email',
  ];
}
/*
* Convert the amounts used in Apple Pay from Number type to String type.
*/
function convertAmountToString(amount) {
  if (amount || amount === 0) return amount.toString();

  return null;
}

/**
 * Gets lineItems for ApplyPay payment request object for session instantiation.
 * @param {Object}
 * @property {String} totalMerchandise - actual item price
 * @property {String} giftFee - gift fee
 * @property {String} correctionFee
 * @property {String} settlementFee
 * @property {String} coupon - coupon fee
 * @property {String} giftCardPayment
 * @property {String} shippingCost - shipping fee
 * @property {Object} additionalCharges - includes consumption tax and service amount
 * @returns {lineItems} - Array of Objects representing the order summary.
 */
function getLineItems(orderSummary) {
  const { orderSummary: {
    consumptionTax,
    correctionFee,
    coupon,
    giftFee,
    serviceAmount,
    settlementFee,
    shippingCost,
    totalMerchandise,
  } } = getTranslation();

  const totalLineItems = [
    { label: totalMerchandise, amount: convertAmountToString(orderSummary.totalMerchandise) },
    { label: correctionFee, amount: convertAmountToString(orderSummary.correctionFee) },
    { label: coupon, amount: convertAmountToString(-(orderSummary.coupon)) },
    { label: settlementFee, amount: convertAmountToString(orderSummary.settlementFee) },
    { label: giftFee, amount: convertAmountToString(orderSummary.giftFee) },
    { label: shippingCost, amount: convertAmountToString(orderSummary.shippingCost) },
    { label: consumptionTax, amount: convertAmountToString(orderSummary.additionalCharges.consumptionTax) },
    { label: serviceAmount, amount: convertAmountToString(-(orderSummary.additionalCharges.serviceAmount)) },
  ];

  const lineItems = totalLineItems.filter(items => items.label === shippingCost || ~~items.amount);

  return lineItems;
}

/**
 * @typedef {Object} PaymentReqObj
 * @property {Array.<String>} requiredShippingContactFields
 * @property {String('JP')} countryCode
 * @property {String('JPY')} currencyCode
 * @property {Array.<String>} supportedNetworks
 * @property {Object.<{label: String, amount: String}>} total
 * @property {Array.<String>} merchantCapabilities
 * @property {Array} lineItems
 */

/**
 * @typedef {Object} ShippingMethodsObj
 * @property {String} label - option label displayed on the payment sheet
 * @property {String} amount - shipping fee
 * @property {String('C')} identifier - deliveryPreference, we don't support 'S'
 * @property {String} detail - details that explains what this option is.
 */

/**
 * @typedef {Object} deliveryOption
 * @property {String} delv_dt - Delivery date in YYYYMMDD format.
 * @property {Array} delv_time_list - Array of available delivery time slots.
 */

/**
* @typedef {Object} OrderSummaryObj
* @property {String} totalMerchandise - actual item price
* @property {String} giftFee - gift fee
* @property {String} shippingCost - shipping fee
* @property {Object} additionalCharges - includes consumptionTax and serviceAmount
* @property {String} paymentsAmt - total payable amount
*/

/**
 * Gets ApplePay payment request object for session instantiation
 * @param {OrderSummaryObj} orderSummary
 * @param {String} [currentBrand="uq"]
 * @param {Boolean} isGUNativeApp
 * @returns {PaymentReqObj}
 */
function getPaymentRequestObj(orderSummary, currentBrand = 'uq', isGUNativeApp = false) {
  const {
    applePay,
    applePay: {
      supportedNetworks,
      merchantCapabilities,
      countryJP,
      currencyJP,
      ver1UnsupportedCard,
    },
  } = getSiteConfig();
  const { common } = getTranslation();
  const requiredShippingContactFields = getRequiredShippingContactFields();
  const paymentReqObj = {
    requiredShippingContactFields,
    countryCode: countryJP,
    currencyCode: currencyJP,
    supportedNetworks: applePayVersion === 1
      ? supportedNetworks.filter(card => card !== ver1UnsupportedCard)
      : supportedNetworks,
    merchantCapabilities,
  };

  if (orderSummary && orderSummary.paymentsAmt) {
    paymentReqObj.lineItems = getLineItems(orderSummary);
    paymentReqObj.total = {
      label: currentBrand === 'uq' ? common.uniqlo : common.gu,
      amount: convertAmountToString(orderSummary.paymentsAmt),
    };
  } else {
    paymentReqObj.merchantIdentifier = applePay[isGUNativeApp ? 'gu' : 'uq'].merchantIdentifier;
  }

  return paymentReqObj;
}

/**
 * Construct ShippingMethodsObj using the delivery date and timeslot.
 * @param {Object.<{delv_dt: String, delv_time_list: Array}>} deliveryRequestedDateTimes - It consist of a delivery
 * date and corresponding delivery time options.
 * @param {String} shippingCost - Shipping charges obtained from cart API.
 * @param {Object} i18n - The i18n object to get the cart and common translations.
 * @returns {Array} - Array of ShippingMethodsObj corresponding to one delivery date.
 */
function mapDateTimeOptions(deliveryRequestedDateTime, shippingCost, i18n) {
  const { NULL_TIMEFRAME } = constants;
  const { delivery, applePay: { defaultDeliveryOption } } = i18n;
  const nullText = timeForCode(NULL_TIMEFRAME, delivery);
  let dateTimeOption = {
    amount: convertAmountToString(shippingCost),
    detail: '',
    identifier: '',
    label: defaultDeliveryOption,
  };

  for (let i = 0; i < deliveryRequestedDateTime.delv_time_list.length; i++) {
    dateTimeOption = deliveryRequestedDateTime.delv_time_list.map((timeframe) => {
      let optionLabel = `${(deliveryRequestedDateTime.delv_dt === NULL_TIMEFRAME || !deliveryRequestedDateTime.delv_dt) && nullText ||
        getDateFromValue(deliveryRequestedDateTime.delv_dt)} ${timeForCode(timeframe, delivery)}`;

      optionLabel = optionLabel.split(nullText).length > 2
        ? defaultDeliveryOption
        : optionLabel;

      const newDateTimeOption = {
        amount: convertAmountToString(shippingCost),
        detail: '',
        identifier: `${deliveryRequestedDateTime.delv_dt || NULL_TIMEFRAME} ${timeframe || NULL_TIMEFRAME}`,
        label: optionLabel,
      };

      return newDateTimeOption;
    });
  }

  return dateTimeOption;
}

/**
 * Checks if a user has landed on order confirmation page after placing order using Apple Pay and as a guest.
 * @param {String} path
 * @returns {Boolean} True if user placed order through Apple Pay and is a guest and reached order confirm page.
 */
function checkIfApplePayGuestUserInConfirmPage(path) {
  return LocalStorage.getItem(localStorageKeys.applePayFlag) === 'true' && routePatterns.confirmOrder.test(path);
}

/**
 * @param {String} state.applePay.shippingMethod.identifier <date time> Eg: <20180118 08>, <00 08>, <00 00>, <20180118 00>,
 * The functon creates the arrival string to be displayed based on the user selection. Eg:
 * date and time selected: 2018/01/19(金) 19:00～21:00 までにお届け予定
 * only date selected: 2018/01/19(金) までにお届け予定
 * only time selected: 19:00～21:00 までにお届け予定
 * morning selected: 午前中 までにお届け予定
 * @returns {String} order arrival date time string
 */
function getGuestUserOrderDeliveryString(userSelection) {
  const { NULL_TIMEFRAME } = constants;
  const i18n = getTranslation();
  const { applePay: { scheduledToDeliver } } = i18n;
  const dateTimeKeys = userSelection ? userSelection.split(' ') : [];
  const dateKey = dateTimeKeys[0];
  const timeKey = dateTimeKeys[1];

  if (dateTimeKeys.length) {
    const timeString = timeForCode(timeKey, getTranslation().delivery);
    const date = getDateFromValue(dateKey.slice(0, 8));
    const dateString = `${date}(${getDayString(date, i18n)})`;
    const hasSelectedDate = dateKey && dateKey !== NULL_TIMEFRAME;
    const hasSelectedTime = timeKey && timeKey !== NULL_TIMEFRAME;

    if (hasSelectedDate && hasSelectedTime) {
      return `${dateString} ${timeString} ${scheduledToDeliver}`;
    } else if (hasSelectedDate && (!timeKey || timeKey === NULL_TIMEFRAME)) {
      return `${dateString} ${scheduledToDeliver}`;
    } else if (hasSelectedTime && (!dateKey || dateKey === NULL_TIMEFRAME)) {
      return `${timeString} ${scheduledToDeliver}`;
    }
  }

  return '';
}

/**
 * Indicates whether the Apple Pay JS API is available and if making payment using the Apple Pay wallet is supported.
 * @type {Boolean}
 */
const canMakePayments = isApplePaySessionAvailable && window.ApplePaySession.canMakePayments();

/**
 * @typedef {Array.<deliveryOption>} DelvMethodObj
 */

/**
 * Gets a single array of delivery date and time options from dateOptions
 * @param {Array.<DelvMethodObj>} deliveryMethods - Array consisting of arrays that has each delivery date and corresponding time options.
 * @param {String} shippingCost - Shipping charges obtained from cart API.
 * @returns {dateTimeOptionArray} - An array of all possible ShippingMethodsObj.
 */
function createShippingMethodObject(deliveryOptions, shippingCost) {
  const i18n = getTranslation();
  const dateOptions = deliveryOptions &&
    deliveryOptions.map(item => mapDateTimeOptions(item, shippingCost, i18n));
  let dateTimeOptionArray = [...dateOptions[dateOptions.length - 1]];

  for (let i = 0; dateOptions && i < dateOptions.length - 1; i++) {
    dateTimeOptionArray = [...dateTimeOptionArray, ...dateOptions[i]];
  }

  return dateTimeOptionArray;
}

/**
 * Gets error messages and contactField for invalid fields if any.
 * @param {Object} address - address from ApplePay wallet
 * @param {Boolean} fieldVaildation - false: Treat as a whole address and not just validate the key passed.
 * Introduced to implement version-2 addressLines issue.
 * Use when validating the address before place order. (further info below)
 * @returns {Array.<{message: String, contactField: String}>}
 */
function getErrorsForInvalidFields(address, fieldVaildation) {
  const fields = Object.keys(address);
  const { common: { validation } } = getTranslation();

  function reducer(acc, field) {
    const value = address[field];

    let contactField = '';
    let validations = [];

    if (field === 'givenName' || field === 'familyName') {
      contactField = 'name';
      validations = [{
        rule: 'required',
        message: field === 'givenName'
          ? validation.nameRequired
          : validation.lastNameRequired,
      }];
    } else {
      contactField = field;
      validations = {
        phoneNumber: [
          {
            rule: 'required',
            message: validation.walletPhoneNumber,
          },
          {
            rule: 'walletPhoneNumber',
            message: validation.walletPhoneNumber,
          },
        ],
        emailAddress: [
          {
            rule: 'required',
            message: validation.emailRequired,
          },
          {
            rule: 'email',
            message: validation.emailNotValid,
          },
        ],
        postalAddress: [],
        addressLines: [{
          rule: 'required',
          message: validation.streetRequired,
        }],
        locality: [],
        subLocality: [],
        postalCode: [
          {
            rule: 'required',
            message: validation.walletZipCode,
          },
          {
            rule: 'walletZipCode',
            message: validation.walletZipCode,
          },
        ],
        administrativeArea: [
          {
            rule: 'required',
            message: validation.stateRequired,
          },
          {
            rule: 'prefecture',
            message: validation.invalidPrefecture,
          },
        ],
        phoneticGivenName: [],
        phoneticFamilyName: [],
        subAdministrativeArea: [],
        country: [],
        countryCode: [],
      }[field];
    }

    // check if the <field, value> pair fails for any of the rules
    const error = validations.length
      ? validations.find(
        ({ rule, message }) => (!Validator[rule](value) ? message : '')
      ) : '';

    // push field's contactField and error message if the value was invalid,
    // if at all the same contactField is not already been pushed
    return error && !acc.find(item => item.contactField === contactField)
      ? [...acc, { message: error.message, contactField }]
      : acc;
  }

  /**
  * These are the required fields. ['givenName', 'familyName', 'emailAddress', 'addressLines', 'postalCode', 'administrativeArea'];
  * Among these, If any are missing:
  * A) the payment sheet either validates
  * OR
  * B) send an empty string as the value of the key in shipping contact. eg: locality: ''
  * Except for the key addressLines in version 2.
  * If addressLines are not present, then the key 'addressLines' will be missing in the shipping contact object.
  * Thus our validation has to consider this particular case as given below:
  * This will also result in validating the field addressLines first, before any other fields.
  */
  if (!fieldVaildation && !fields.includes('addressLines')) {
    return [{
      message: validation.streetRequired,
      contactField: 'addressLines',
    }];
  }

  return fields.reduce(reducer, []);
}

/**
 * Returns true if special characters are included in the fields
 * givenName, familyName, locality, addressLines[0], addressLines[1] of shippingAddress
 * @param {Object} shippingAddress
 * @return {Boolean}
 */
function getshippingContactErrors(shippingAddress = {}) {
  const { applePay: { shippingContactInvalidCharacters } } = getSiteConfig();
  const { givenName, familyName, locality, addressLines = [] } = shippingAddress;
  const valuesToCheck = [givenName, familyName, locality, addressLines[0], addressLines[1]];
  const hasInvalidCharacters = (shippingContactValue = '') =>
  shippingContactInvalidCharacters.some(invalidCharacter => shippingContactValue.indexOf(invalidCharacter) > -1);
  const hasInvalidCharacter = valuesToCheck.some(value => hasInvalidCharacters(value));

  return hasInvalidCharacter;
}

/**
 * Get predefined error response structure for native-app
 * in order to show error messages in payment sheet or force close it.
 * @param {Array.<{contactField: String, message: String}>} errorList
 * @returns {{error: Array.<{forceClose: Boolean(true)}|{contactField: String, message: String}>}}
 */
function getNativeAppError(errorList) {
  const error = errorList || [{ forceClose: true }];

  return { result: { error } };
}

/**
 * Pass characters to be used for splitting an array of two strings.
 * If one of the characters is found in any of the string, strings are split there and it's returned.
 * If none are found the second argument itself is returned.
 * Usage example: splitByChar(['//n', '/n'], ['三軒茶屋2-11-23/nサンタワーズBとうななかい']) => ["三軒茶屋2-11-23",  "サンタワーズBとうななかい"]
 * Usage example: splitByChar(['//n', '/n'], ['三軒茶屋2-11-23サンタワーズBとうななかい']) => ["三軒茶屋2-11-23サンタワーズBとうななかい"]
 * @param {Array.<{character: String}>} characters
 * @param {Array.<{addresses: String}>} addressLines
 * @returns {Array.<{addresses: String}>}
 */
function splitByChar(characters, addressLines) {
  let address = null;

  if (characters && characters.length) {
    characters.some((char) => {
      if (addressLines[0] && addressLines[0].length && addressLines[0].includes(char)) {
        address = addressLines[0].split(char);

        return true;
      } else if (addressLines[1] && addressLines[1].length && addressLines[1].includes(char)) {
        address = addressLines[1].split(char);

        return true;
      }

      return false;
    });
  }

  return address || addressLines || [];
}

export {
  isApplePaySessionAvailable,
  applePayVersion,
  canMakePayments,
  getRequiredShippingContactFields,
  getPaymentRequestObj,
  createShippingMethodObject,
  getErrorsForInvalidFields,
  checkIfApplePayGuestUserInConfirmPage,
  getGuestUserOrderDeliveryString,
  getLineItems,
  getNativeAppError,
  getshippingContactErrors,
  splitByChar,
};
