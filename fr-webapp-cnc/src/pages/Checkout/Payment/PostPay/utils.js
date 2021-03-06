import { createSelector } from 'reselect';
import config from 'config';
import getSiteConfig from 'config/site';
import { getPaymentMethod, hasIncompleteBillingAddress } from 'redux/modules/checkout/payment/selectors';

const siteConfig = getSiteConfig(config.region);

/**
 * Check if cash on delivery payment method is selected
 * @param {Object} state - global state
 * @returns {string}
 */
export const isSelected = createSelector(
  [getPaymentMethod],
  paymentMethod => paymentMethod === siteConfig.payment.postPay);

export const showBillingAddressForm = createSelector(
  [isSelected, hasIncompleteBillingAddress],
  (isPostPaySelected, hasIncompleteBillingAddresss) =>
    isPostPaySelected && hasIncompleteBillingAddresss
);
