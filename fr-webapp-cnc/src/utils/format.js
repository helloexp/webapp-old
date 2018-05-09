import React from 'react';
import { getTranslation } from 'i18n';
import constants from 'config/site/default';

const breakLines = /\\n/g;

export const CHARACTER = /[^\d]/g;
const NUMBER_WITH_SPACE = /^[0-9 ]+$/;

export const FIFTH_VALUE = /(.{4})/g;

const HIRAGANA_START = 0x3041;
const HIRAGANA_END = 0x3096;
const KATAKANA_START = 0x30A1;
const DELIMITED_COMMAS_SPACES = /[, ]+/g;

export function maskCardNumber(cardNumber) {
  return cardNumber ? `${cardNumber.slice(0, 4)} •••• •••• ${cardNumber.slice(-4)}` : '';
}

export function formatNumberWithCommas(value) {
  if (!value && value !== 0) {
    return '';
  }

  if ((typeof value === 'string' || value instanceof String) && !isNaN(value)) {
    value = parseInt(value, 10);
  }

  let formatted = value.toLocaleString();

  if (formatted.length > 3 && formatted === value.toString()) {
    //  For fixing number format issue in safari or containing $/\.
    formatted = formatted.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }

  return formatted;
}

/**
 * This function especs an object containing `expMonth` and `expYear` fields or `expiry` field,
 * it will return the month and year ready to render in views.
 *
 * expirationDate({expMonth: '5', expYear: '2019'});  // => 05/19
 * expirationDate({expiry: '0521'});  // => 05/21
 */
export function expirationDate(card) {
  if (card.expYear && card.expMonth) {
    const year = card.expYear.substr(2);
    const month = parseInt(card.expMonth, 10) < 10 ? `0${card.expMonth}` : card.expMonth;

    return `${month}/${year}`;
  } else if (card.expiry) {
    return `${card.expiry.substring(0, 2)}/${card.expiry.substring(2)}`;
  }

  return null;
}

export function formatPrice(price = 0, showFree = true, forceAmountDisplay = false) {
  const common = getTranslation().common;
  const symbol = common.currencySymbol;
  const free = common.free;

  if (price) {
    return `${symbol}${formatNumberWithCommas(price)}`;
  }

  if (forceAmountDisplay) {
    return `${symbol}0`;
  }

  return showFree ? free : symbol;
}

export function truncate(time) {
  return time && time.substring(0, 5);
}

export function formatCardNumber(value, type) {
  const cardNumber = value.replace(CHARACTER, '');

  if (type === 'american-express') {
    let formated;

    if (cardNumber.length < 5) {
      formated = cardNumber.slice(0, 4);
    } else if (cardNumber.length < 11) {
      formated = `${cardNumber.slice(0, 4)} ${cardNumber.slice(4, 10)}`;
    } else {
      formated = `${cardNumber.slice(0, 4)} ${cardNumber.slice(4, 10)} ${cardNumber.slice(10, 15)}`;
    }

    return formated.trim();
  }

  return cardNumber.replace(FIFTH_VALUE, '$1 ').trim();
}

export function formatPostalCode(postalCode) {
  return postalCode ? postalCode.replace(/(\d{3})/, '$1-') : '';
}

/**
 * This functions replaces the break lines that comes from the API
 * response, and convert it to real break lines.
 */
export function fixBreakLinesFromApi(message) {
  if (message) {
    return message.replace(breakLines, '\n');
  }

  return message;
}

/**
 * Make sure the mobilephone number is 8 digits, it appends zeros to
 * the left side of the number.
 * @param {String} phoneNumber The phone number
 * @returns {String} The formated phone number with zeros to the left
 */
export function paddingMobileNumber(phoneNumber) {
  const pad = constants.format.mobileNumber;
  const str = `${phoneNumber}`;

  return pad.substring(0, pad.length - str.length) + str || '';
}

export function removeHyphen(rawValue) {
  const value = rawValue || '';

  return value.replace(/[-ー――‐−]/g, '');
}

// Conversion from full-width numbers to half-width numbers
export function toHankakuNumber(rawValue) {
  const value = rawValue || '';

  return value.replace(/[０-９]/g, tmpStr => String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0));
}

function isCharInRange(char, start, end) {
  const code = char.charCodeAt(0);

  return start <= code && code <= end;
}

function isCharHiragana(char) {
  return isCharInRange(char, HIRAGANA_START, HIRAGANA_END);
}

export function hiraganaToKatakana(input = '') {
  let code;
  let kataChar;
  const hiragana = input.split('');
  const kata = [];

  hiragana.forEach((hiraChar) => {
    if (isCharHiragana(hiraChar)) {
      code = hiraChar.charCodeAt(0);
      code += KATAKANA_START - HIRAGANA_START;
      kataChar = String.fromCharCode(code);
      kata.push(kataChar);
    } else {
      kata.push(hiraChar);
    }
  });

  return kata.join('');
}

/**
 * In some cases We only consume half width characters as input
 * This function converts the full width string to half width
 *
 * @param  {String} input  String which contains Full width characters
 * @return {String}        Return String contains only half width characters
 **/
export function toHalfWidth(input) {
  const value = input || '';
  const convertTxt = value.replace(/[！-～]/g, tmpStr => String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0));

  return convertTxt.replace(/”/g, '"')
    .replace(/’/g, '\'')
    .replace(/‘/g, '`')
    .replace(/￥/g, '¥')
    .replace(/　/g, ' ') // eslint-disable-line
    .replace(/ー/g, '-')
    .replace(/〜/g, '~');
}

/**
 * This function checks the string contains only numeric and space
 * @param {string} value String which to be checked
 * @return {booleon} Returns true for satifying above condition or false if not
 **/
export function isThisNumberWithSpace(value) {
  return NUMBER_WITH_SPACE.test(value);
}

/**
 * This function removes comma from the value passed
 * @param {string} value String which need to be formated by removing commas
 * @return {String} Returns string contains only value without comma
 * */
export function removeCommasFrom(value) {
  return value
    .replace(/,/g, '')
    .replace(/ /g, '');
}

/**
 * This function append 0 to the value if it is single digit
 * @param {string} value String to which 0 to be appended
 * @return {String} Returns string with 0 appended if needed
 * */
export function appendZero(value) {
  return `${(value < 10 ? '0' : '')}${value}`;
}

/**
* Replace delimited commas and spaces from address elements(excluding katakana spaces)
* @param {String} text
*/
export function replaceDelimitedCommasAndSpaces(text) {
  return text.replace(DELIMITED_COMMAS_SPACES, '');
}

/**
* Removes all cheacters and returns integers
* @param {String} text
*/
export function toNumber(value) {
  return value.replace(/[^0-9]+/g, '');
}

/**
* Removes leading whitespaces and returns remaining characters
* @param {String} text
*/
export function stripLeadingSpaces(val) {
  return val ? val.replace(/^\s+|$/, '') : '';
}

export function multilineMessage(messageSegments, style) {
  return (messageSegments.map(text => <div key={text} className={style}>{text}</div>));
}
