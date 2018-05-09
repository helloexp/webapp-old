const host = 'https://test3.uniqlo.com';
const config = {
  clientId: 'cms_sp_id',
  clientSecret: 'cms_sp_secret',
  host,
  base: `${host}/jp/store/restfulapi/v1`,
  putUrl: `${host}/jp/store/restful/api/put/v1`,
  locale: 'jp',
  region: 'jp',
  brand: 'uq',

  giftOptions: '/cart/cart_id/gift_option',
};

export default config;
