import { gds } from 'config/api/hosts';
import Config from 'config';

const baseCartPath = `${gds.host}/${Config.region}/store/restfulapi/v1/{brand}/${Config.region}`;
const removeItemBaseHost = `${gds.host}/${Config.region}/store/restful/api/delete/v1/{brand}/${Config.region}`;
const updateItemBaseHost = `${gds.host}/${Config.region}/store/restful/api/put/v1/{brand}/${Config.region}`;

const config = {
  host: baseCartPath,
  hostForRemove: removeItemBaseHost,
  hostForUpdate: updateItemBaseHost,

  clientId: gds.clientId,
  clientSecret: gds.clientSecret,

  // Endpoints
  generate: '/cart',
  addToCart: '/cart/cart_id',
  cart: '/cart/cart_id',
  coupon: '/cart/cart_id/coupon',
  cartItem: '/cart/cart_id/line_id',
  customerCart: '/cart/cart_id/customer',
  returnToCart: '/cart/cart_id/orderedcart',
  applePayPIB: '/cart/cart_id/booked_item',
  applePayProxy: '/checkout/payment/applepay',
  applePayOrder: '/simple_order',
};

export default config;
