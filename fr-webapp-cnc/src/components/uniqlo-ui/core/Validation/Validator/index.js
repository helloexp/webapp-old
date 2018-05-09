import {
  REQUIRED,
  TWO_DIGITS_AND_DECIMAL_NUMBER,
  DECIMAL_NUMBER,
  JP_ZIP_CODE,
  KATAKANA,
  NUMBER,
  PHONE_NUMBER,
  HIRAGANA_OR_KATAKANA,
  FULL_WIDTH_JP_CHARACTERS,
  ALPHA_SPACE,
  MATCH_SPACE,
  EMAIL,
  PASSWORD,
  WALLET_PHONE_NUMBER,
  WALLET_ZIP_CODE,
} from 'helpers/regex';
import States from 'config/states/states-jp';
import CardValidator from 'utils/CardValidator';

function required(value) {
  return !!value && REQUIRED.test(value);
}

function jpZipCode(value) {
  return !!value && JP_ZIP_CODE.test(value);
}

function walletZipCode(value) {
  return !!value && WALLET_ZIP_CODE.test(value);
}

function walletPhoneNumber(value) {
  return !!value && WALLET_PHONE_NUMBER.test(value);
}

function prefecture(value) {
  const stateArr = Object.values(States);

  return !!value && stateArr.some(state => state.name === value);
}

function katakana(value) {
  return !!value && KATAKANA.test(value);
}

function number(value) {
  return NUMBER.test(value);
}

function twoDigitsAndDecimalNumber(value) {
  return TWO_DIGITS_AND_DECIMAL_NUMBER.test(value);
}

function decimalNumber(value) {
  return DECIMAL_NUMBER.test(value);
}

function phoneNumber(value) {
  return (!!value && PHONE_NUMBER.test(value)) || value === '';
}

function singleByteNumber(value) {
  return !!value && unescape(encodeURIComponent(value)).length === value.length;
}

function hiraganaOrKatakana(value) {
  return !!value && HIRAGANA_OR_KATAKANA.test(value);
}

function fullWidthJpCharacters(value) {
  return !!value && FULL_WIDTH_JP_CHARACTERS.test(value);
}

function alphaWithSpace(value) {
  return !!value && ALPHA_SPACE.test(value);
}

function creditCard(value) {
  return !!value && CardValidator.number(value.replace(MATCH_SPACE, '')).isValid;
}

function cvv(value, code) {
  return !!value && CardValidator.cvv(value, code).isValid;
}

function email(value) {
  return !!value && EMAIL.test(value);
}

function emailLength(value) {
  return !!value && value.length <= 64;
}

function passwordLength(value) {
  return !!value && value.length >= 8 && value.length < 21;
}

function passwordValid(value) {
  return !!value && PASSWORD.test(value);
}

function getNumericExactLengthRegex(length) {
  return new RegExp(`^[0-9]{${length}}`);
}

function numericExactLength(value, length) {
  return !!value && getNumericExactLengthRegex(length).test(value.replace(MATCH_SPACE, ''));
}

/**
 * In validation component to show tooltip by error message as a prop we need
 * a mock rule. This could act as a placeholder to by pass the above constrain.
 * @returns {boolean} true
 */
function none() {
  return true;
}

/**
 * Check if not exceeded the maximum length of text
 * @param {String} value
 * @param {Number} length
 * @returns {boolean}
 */
function stringMaxLength(value, length) {
  return value.length <= length;
}

const validator = {
  none,
  required,
  jpZipCode,
  katakana,
  number,
  twoDigitsAndDecimalNumber,
  decimalNumber,
  phoneNumber,
  singleByteNumber,
  hiraganaOrKatakana,
  alphaWithSpace,
  numericExactLength,
  fullWidthJpCharacters,
  stringMaxLength,
  creditCard,
  cvv,
  email,
  emailLength,
  passwordLength,
  passwordValid,
  prefecture,
  walletZipCode,
  walletPhoneNumber,
};

export default validator;
