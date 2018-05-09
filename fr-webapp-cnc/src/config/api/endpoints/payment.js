const region = 'jp';
const host = 'https://test3.uniqlo.com';
const blueGateEndpoint = 'https://test3.smartcapsule.jp/disp/ONECLICKCOMM.do';

const basePaymentPath = `${host}/jp/store/restfulapi/v1`;
const basePaymentPutPath = `${host}/jp/store/restful/api/put/v1`;
const basePaymentDeletePath = `${host}/jp/store/restful/api/delete/v1`;

const config = {
  // These are the actual API host configuration
  apiHost: `${basePaymentPath}/{brand}/${region}`,
  apiHostPut: `${basePaymentPutPath}/{brand}/${region}`,
  apiHostDelete: `${basePaymentDeletePath}/{brand}/${region}`,

  blueGateEndpoint,
  client_id: 'cms_sp_id',

  prepareCreditCard: '/customer/credit_preparation',
  setPaymentMethod: '/cart/cart_id/payment',
  giftCard: '/cart/cart_id/gift_card',
  GET_CREDIT_CARD: '/payment/creditCard/loadCreditCard',
  SET_CREDIT_CARD_FIELD: '/payment/creditCard/saveCreditCard',
  VERIFY_CREDIT_CARD_URL: '/payment/creditCard/verifyCreditCard',

  paymentSelectable: '/cart/cart_id/payment_selectable',
  payment: '/cart/cart_id/payment',
  creditCardInfo: '/customer/credit',
  addresses: '/address',
  gdsAccess: '/store/FSC01010E02.do',
  deleteCreditCard: '/customer/credit',
};

export default config;
