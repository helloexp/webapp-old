export const ALPHA_SPACE = /^[A-Za-z ]+$/;
export const CONVERT_HTTP_HTTPS = /^http:\/\//i;
export const CURRENCY_SYMBOL_REGX = /(￥|¥)/;
export const DECIMAL_NUMBER = /^\d{1,3}(\.\d)?$/;
export const EMAIL = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; // eslint-disable-line no-useless-escape
export const EXCLUDE_LEADING_SPACES = /(?!\s+)(.+$)/;
export const EXTERNAL_ADDRESS = /^(https?:\/\/|#)/;
export const FULL_WIDTH_JP_CHARACTERS = /^([\u3005]|[\u3041-\u3096]|[\u309d-\u309f]|[\u30a1-\u30fa]|[\u30fd-\u30ff]|[\u4e00-\u9FAF]|[\u3400-\u4db5])+$/;
export const GU_APP_VERSION = /gu- ?app\((\d\.\d\.\d)/g;
// ref: http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
export const HIRAGANA_OR_KATAKANA = /^([\u30a0-\u30ff]|[\u3040-\u309F])+$/;
export const JP_ZIP_CODE = /^[0-9]{7}$/;
export const WALLET_ZIP_CODE = /^\d{3}[-]?\d{4}$/;
export const WALLET_PHONE_NUMBER = /^[+]?\d{9,13}$/;
export const KATAKANA = /^[\u30A1-\u30FA]+$/;
export const MATCH_BRAND = /brand=(uq|gu)/;
export const MATCH_COMMA_SPACE = /\s|,/g;
export const MATCH_SPACE = /\s/g;
// This regexp search for \\n, we need to replace these values for actual break lines \n
export const MATCH_TEXT_BREAK_LINE = /\\n/g;
export const NUMBER = /^[0-9]+$/;
export const PASSWORD = /(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]+$/;
export const PHONE_NUMBER = /^[0-9]{9,13}$/;
export const REMOVE_DECIMAL_POINT = /\./g;
export const REMOVE_HYPHEN = /-/g;
export const REQUIRED = /\S+/;
export const STORE_STAFF_EMAIL = /@uniqlo\.store$/;
export const TWO_DIGITS_AND_DECIMAL_NUMBER = /^\d{1,2}(\.\d)?$/;
// Matches all currently supported cards(Visa, MasterCard, American Express, Diners Club, Discover, and JCB)
export const VALID_CREDIT_CARD = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/; // eslint-disable-line max-len
