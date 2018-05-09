import constants, { NULL_TIMEFRAME } from 'config/site/default';
import { getShippingMethodDescription } from 'utils/deliveryUtils';

export function toDoubleDigit(digit) {
  return (`0${digit}`).slice(-2);
}

const SPLIT_DATE = /^(\d{4})(\d{2})(\d{2})$/;

export const SEC = 1000;
export const MINUTE = 60 * SEC;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY;
export const YEAR = 365 * DAY;

export const miliseconds = {
  SEC,
  MINUTE,
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
};

export function splitIsoDate(isoDate) {
  return isoDate.match(/(\d{4})-([01]\d)-([0-3]\d)T/);
}

export function formatDateFromIso(isoDate, format) {
  const arrDate = splitIsoDate(isoDate);
  const arrObj = {
    y: arrDate[1],
    m: arrDate[2],
    d: arrDate[3],
  };

  return format.replace(/(\w)/g, (match, p1) => arrObj[p1]);
}

export function getDateFromValue(rawDate) {
  return rawDate && rawDate.split(SPLIT_DATE).filter(Boolean).join('/');
}

// To get day and time from date
export function getDayTimeFromDate(date) {
  return {
    day: date.getDay(),
    hours: toDoubleDigit(date.getHours()),
    minutes: toDoubleDigit(date.getMinutes()),
  };
}

export function formatDate(date, format) {
  const normalizedDate = date instanceof Date ? date : new Date(date);
  const isoDate = normalizedDate.toJSON();

  return formatDateFromIso(isoDate, format);
}

export function dayForDate(day, i18n) {
  return Object.values(i18n.common.days)[day];
}

export function getFormattedDate(timeStamp) {
  const date = new Date(timeStamp * 1000);

  return formatDate(date, 'y/m/d');
}

export function getFormattedDateWithTime(timeStamp, i18n) {
  const date = new Date(timeStamp * 1000);
  const { day, hours, minutes } = getDayTimeFromDate(date);
  const formattedDate = formatDate(date, 'y/m/d');

  return `${formattedDate} (${dayForDate(day, i18n)}) ${hours}:${minutes}`;
}

// InputFormat yyyymmddhhmmss
// outputFormat yyyy-mm-ddThh:mm:ss
export function formateLastUpdateDate(date) {
  const punctuation = { 3: '-', 5: '-', 7: 'T', 9: ':', 11: ':' };

  return date.split('').reduce((prevValue, currentValue, index) => `${prevValue}${currentValue}${punctuation[index] || ''}`, '');
}

export function timeForCode(code, { noneSelected, morning, after18 }) {
  switch (code) {
    case '00':
      return noneSelected;
    case '01':
      return morning;
    case '02':
      return '12:00～14:00';
    case '03':
      return '14:00～16:00';
    case '04':
      return '16:00～18:00';
    case '05':
      return after18;
    case '06':
      return '18:00～20:00';
    case '07':
      return '20:00～21:00';
    case '08':
      return '19:00～21:00';
    default:
      return code;
  }
}

export function getCurrentDay() {
  const date = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return days[date.getDay()];
}

export function getDayString(date, i18n) {
  const day = (new Date(date)).getDay();

  return dayForDate(day, i18n);
}

/**
 * Construct time frame message
 * @param {DeliveryMethod} delivery
 * @param {Object} i18n
 * @param {Object} deliveryMethodList
 * @return {*}
 */
export function constructTimeFrameMessage(delivery = {}, i18n, deliveryMethodList, fromOrderConfirm) {
  const {
    checkout: {
      byYupacket,
      sameDay,
      nekopos,
    },
  } = i18n;
  const { deliveryReqTime, deliveryReqDate, deliveryType } = delivery;
  const { deliverySelectedDate, deliveryScheduled, deliverySelectedTime } = i18n.delivery;
  const { YU_PACKET, SAME_DAY, YAMATO_MAIL, SHIPPING } = constants.deliveryTypes;

  if (deliveryType === YU_PACKET) {
    return {
      title: byYupacket,
      shipping: getShippingMethodDescription({ shippingType: 'yuPacket', deliveryMethodList }),
    };
  } else if (deliveryType === SAME_DAY) {
    return {
      title: sameDay,
      shipping: getShippingMethodDescription({ shippingType: 'today', deliveryMethodList }),
    };
  } else if (deliveryType === YAMATO_MAIL) {
    return {
      title: nekopos,
      shipping: getShippingMethodDescription({ shippingType: 'nekoposPacket', deliveryMethodList }),
    };
  } else if (deliveryType === SHIPPING) {
    const args = { shippingType: 'selectedDelivery', deliveryMethodList, deliveryMethod: delivery, fromOrderConfirm };

    if (!deliveryReqDate || deliveryReqDate === NULL_TIMEFRAME) {
      if (!deliveryReqTime || deliveryReqTime === NULL_TIMEFRAME) {
        return false;
      }

      return {
        title: deliverySelectedTime,
        shipping: getShippingMethodDescription(args),
      };
    }

    if ((!deliveryReqTime || deliveryReqTime === NULL_TIMEFRAME) && deliveryReqDate) {
      return {
        title: deliverySelectedDate,
        shipping: getShippingMethodDescription(args),
      };
    }

    return {
      title: deliveryScheduled,
      shipping: getShippingMethodDescription(args),
    };
  }

  return null;
}

export function formatBirthDate(birthDate) {
  return birthDate && birthDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
}

export function getDateAfter(days) {
  const date = (Date.now() + (DAY * days)) / 1000;

  return getFormattedDate(date);
}

/**
 * Add given number of days to the given date
 * @param {string} from_date
 * @param {string} no of days to be addded
 * @return {date in the format of yyyy/mm/dd}
 */
export function addDays(rawDate, days) {
  const newdate = new Date(getDateFromValue(rawDate.slice(0, 8)));

  newdate.setDate(newdate.getDate() + parseInt(days, 10));

  const month = toDoubleDigit(newdate.getMonth() + 1);
  const date = toDoubleDigit(newdate.getDate());
  const year = newdate.getFullYear();

  return getDateFromValue(`${year}${month}${date}`);
}

// To get date difference in days
export function getDateDiff(date1, date2 = new Date()) {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());

  return Math.ceil(timeDiff / DAY);
}

export function calculateAge(birthday) {
  const today = new Date();
  const formattedBirthDate = formatBirthDate(birthday);
  const [year, month, date] = formattedBirthDate.split('/');

  const m = today.getMonth() - parseInt(month, 10);
  let age = today.getFullYear() - parseInt(year, 10);

  if (m < 0 || (m === 0 && today.getDate() < parseInt(date, 10))) {
    age--;
  }

  return age;
}

/**
 * Parse date in yyyymmddhhmmss format and return a date object if date is valid.
 * @param  {String} timestamp
 * @return {Date}
 */
export function getDateFromShortTimestampFormat(timestamp) {
  if (timestamp && timestamp.length === 14) {
    const timstampExpression = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
    const [, year, month, date, hour, minute, second] = timestamp.match(timstampExpression) || [];

    // convert from string to 0 based month
    const dateObj = new Date(year, month * 1 - 1, date, hour, minute, second);

    return dateObj;
  }

  return null;
}

// InputFormat yyyymmddhhmmss
// outputFormat yyyy/mm/dd hh:mm
export function getPayAtStoreTime(date) {
  const orderDate = formateLastUpdateDate(date);

  return orderDate ? orderDate.substring(0, 16).replace(/-/g, '/').replace(/T/, ' ') : '';
}

export function getTomorrow() {
  const today = new Date();

  today.setDate(today.getDate() + 1);

  const mm = today.getMonth() + 1;
  const dd = today.getDate();
  // tomorrow's date in the format `yyyymmdd`
  const tomorrow = [today.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');

  return tomorrow;
}
