const host = 'https://test3.uniqlo.com';

const baseCartPath = `${host}/jp/store/restfulapi/v1`;
const removeItemBaseHost = `${host}/jp/store/restful/api/delete/v1`;

const config = {
  host,
  base: baseCartPath,
  hostForRemove: removeItemBaseHost,
  clientId: 'cms_sp_id',
  clientSecret: 'cms_sp_secret',
  locale: 'jp',
  region: 'jp',
  brand: 'uq',
  nativeApp: 'uqapp',

  // Endpoints
  order: '/order/order_id',
  placeOrder: '/order',
};

export default config;
