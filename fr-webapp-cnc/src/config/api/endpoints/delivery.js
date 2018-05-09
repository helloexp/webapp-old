const host = 'https://test3.uniqlo.com';
const baseCartPath = `${host}/jp/store/restfulapi/v1`;
const baseCartPathForPUT = `${host}/jp/store/restful/api/put/v1`;
const storeBase = `${host}/jp`;
const config = {
  host,
  base: baseCartPath,
  putUrl: baseCartPathForPUT,
  storeBase,
  clientId: 'cms_sp_id',
  clientSecret: 'cms_sp_secret',
  cdId: '192',
  deliverTodayFeeCode: '532',

  locale: 'jp',
  region: 'jp',
  brand: 'uq',
  deliverMethod: '/cart/cart_id/delivery_selectable',
  config: '/store/FSC01010E02.do',

  // API end point to get prefecture with zipcode
  getPref: '/store/FSC03020E08.do',
  keyPressed: 'Y',

  lastDeliveryAddress: '/cart/cart_id/ship_to/before',
  deliveryAddress: '/cart/cart_id/ship_to',
  deliveryMethod: '/cart/cart_id/delivery',
  billingAddress: '/cart/cart_id/bill_to',
  shippingThreshold: '/common/code/cd_id',
  receivestore: '/common/recevstore',
  split: '/cart/cart_id/split',
};

export default config;
