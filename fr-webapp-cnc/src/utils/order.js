import { getCurrentBrand } from 'utils/routing';
import { orderApi } from 'config/api';
import * as cartActions from 'redux/modules/cart';
import getSiteConfig from 'config/site';
import { getJscData } from 'utils/bluegate';

const { payment, creditCard, gds } = getSiteConfig();

export function getExtraConfig(state) {
  const { creditCard: newCard, auth: { user }, payment: { creditInfo }, paymentStore: { paymentStoreDetail } } = state;
  const { paymentType } = cartActions.getCart(state);
  const selectedCard = newCard.selected ? newCard : creditInfo;

  if (paymentType === payment.creditCard) {
    const jscData = getJscData();

    // Check if the selected card is registered on bluegate
    if (!selectedCard.dbKey) {
      return {
        credit_payment_type: selectedCard.isSaveThisCard ? creditCard.newCardAndRegister : creditCard.newCardNotRegister,
        security_code: selectedCard.cardCvv,
        security_flg: gds.positive,
        jsc_data: jscData,
      };
    }

    // This is a registered card
    return {
      credit_payment_type: creditCard.registeredCard,
      security_flg: gds.positive,
      security_code: selectedCard.cvv,
      jsc_data: jscData,
    };
  } else if (paymentType === payment.uniqloStore) {
    return {
      check_in_store_code: paymentStoreDetail.g1StoreId,
      check_in_store_enabled: gds.one,
      native_app: orderApi.nativeApp,
      app_user_no_uq: user.memberId,
    };
  }

  return {};
}

/**
 * Gets affiliate params for the corresponding brand
 * @param {Object} orderState - globalState.order
 * @param {String} brand
 * @returns {Object}
 */
function getAffiliateParams(orderState) {
  const { lsSiteId, lsTimeEntered, caSiteId, caTimeEntered } = orderState;
  const affiliateParams = {};

  if (lsSiteId && lsTimeEntered) {
    affiliateParams.ls_siteid = lsSiteId;
    affiliateParams.ls_time_entered = lsTimeEntered;
  }

  if (caSiteId && caTimeEntered) {
    affiliateParams.ca_siteid = caSiteId;
    affiliateParams.ca_time_entered = caTimeEntered;
  }

  return affiliateParams;
}

/**
 * Get query parameters commonly required for "simple" and "normal" order APIs.
 * @param {Object} globalState
 * @returns {Object}
 */
export function getCommonOrderParams(globalState) {
  const cartBrand = getCurrentBrand(globalState);
  const cart = cartActions.getCart(globalState, cartBrand);
  const extraConfig = getExtraConfig(globalState);
  const affiliateParams = getAffiliateParams(globalState.order);

  return {
    client_id: `${orderApi.clientId}`,
    cart_no: cart.cartNumber,
    token: cart.token,
    last_upd_date: cart.lastUpdatedDate,
    ...affiliateParams,
    ...extraConfig,
  };
}
