/*
 * API URLs test data used for the test cases
 */

module.exports = {
  getMemberId: 'https://prodtest-api.fastretailing.com/identity/v1/uq/jp/memberid',
  getToken: 'https://prodtest-api.fastretailing.com/identity/v1/uq/jp/token',
  getSessionId: 'https://prodtest.uniqlo.com/jp/store/restful/api/put/v1/uq/jp/customer/login_preparation',
  getUserCreditCard: 'https://prodtest.uniqlo.com/jp/store/restfulapi/v1/uq/jp/customer/credit',
  deleteUserCreditCard: 'https://prodtest.uniqlo.com/jp/store/restful/api/delete/v1/uq/jp/customer/credit',
  resetUserAddress: 'https://prodtest-api.fastretailing.com/identity/v1/uq/jp/address/001',
  deleteUserUqCart: 'https://prodtest.uniqlo.com/jp/store/restful/api/delete/v1/uq/jp/cart/cart_id',
  deleteUserGuCart: 'https://prodtest.uniqlo.com/jp/store/restful/api/delete/v1/gu/jp/cart/cart_id',
  createNewUqCoupon: 'https://prodtest-api.fastretailing.com/coupon/100/uq/jp/coupon',
  createNewGuCoupon: 'https://prodtest-api.fastretailing.com/coupon/100/gu/jp/coupon',
  giveUqCouponToUser: 'https://prodtest-api.fastretailing.com/coupon/100/uq/jp/[[[cid]]]/give/to/users',
  giveGuCouponToUser: 'https://prodtest-api.fastretailing.com/coupon/100/gu/jp/[[[cid]]]/give/to/users',
  getUserOrders: 'https://prodtest.uniqlo.com/jp/store/restfulapi/v1/uq/jp/order',
  memberInfo: 'https://prodtest.uniqlo.com/jp/member/v1/info.json',
  billTo: 'https://prodtest.uniqlo.com/jp/store/restfulapi/v1/uq/jp/cart/cart_id/bill_to',
  cart_id: 'https://prodtest.uniqlo.com/jp/store/restfulapi/v1/uq/jp/cart/cart_id',
  order: 'https://prodtest.uniqlo.com/jp/store/restfulapi/v1/uq/jp/order',
  order_id: 'https://prodtest.uniqlo.com/jp/store/restfulapi/v1/uq/jp/order/order_id'
};
