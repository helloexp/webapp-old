import { getFormattedDateWithTime } from 'utils/formatDate';

export default function couponDate(startDate, endDate, i18n) {
  const { coupons } = i18n;
  const currentDate = new Date();
  const formatStartDate = new Date(startDate * 1000);
  const formatEndDate = new Date(endDate * 1000);

  if (formatStartDate <= currentDate && formatEndDate >= currentDate) {
    return `${getFormattedDateWithTime(endDate, i18n)} ${coupons.until}`;
  }

  return `${getFormattedDateWithTime(startDate, i18n)} ~ ${getFormattedDateWithTime(endDate, i18n)} ${coupons.until}`;
}
