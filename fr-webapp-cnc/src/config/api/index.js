import accountApi from './endpoints/account';
import collectionsApi from './endpoints/collections';
import storesApi from './endpoints/stores';
import imagesApi from './endpoints/images';
import membersApi from './endpoints/members';
import couponApi from './endpoints/coupon';
import cartApi from './endpoints/cart';
import orderApi from './endpoints/order';
import deliveryApi from './endpoints/delivery';
import storeDetailApi from './endpoints/storeCatalog';
import giftingApi from './endpoints/gifting';
import commonApi from './endpoints/common';
import paymentApi from './endpoints/payment';
import userInfoApi from './endpoints/userInfo';
import modelMeasurements from './endpoints/modelMeasurements';
import purchaseHistoryApi from './endpoints/purchase';
import barcodeApi from './endpoints/barcode';
import catalogApi from './endpoints/catalog';
import styleAPI from './endpoints/style';

export const clientid = 'profile-jp';
export const clientsecret = 'profile-secret';
export const apiTypes = {
  GDS: 'GDS',
  ACPF: 'ACPF',
};

export inventory from './endpoints/inventory';
export leadTime from './endpoints/leadTime';

export {
  accountApi,
  collectionsApi,
  storesApi,
  imagesApi,
  membersApi,
  couponApi,
  cartApi,
  deliveryApi,
  storeDetailApi,
  giftingApi,
  commonApi,
  paymentApi,
  orderApi,
  userInfoApi,
  modelMeasurements,
  purchaseHistoryApi,
  barcodeApi,
  catalogApi,
  styleAPI,
};
