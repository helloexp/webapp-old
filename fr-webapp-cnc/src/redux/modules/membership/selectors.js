import { createSelector } from 'reselect';
import { viewLimit } from 'config/site/default';
import { getBrand, getCart } from 'redux/modules/cart/selectors';

/**
 * Get the entered coupon code
 **/
export const getEnteredCouponCode = state => state.coupons.code;

/**
* Get store coupon list
**/
const getStoreCouponList = state => state.coupons.storeCouponList;

/**
* Get online coupon list
**/
export const getOnlineCouponList = state => state.coupons.list;

/**
* Get the coupon list from props
**/
const getCouponList = (state, props) => props.items;

/**
* Get the coupon list visible count from props
**/
const getCouponListCount = (state, props) => props.count;

/**
* Get the coupon added to cart
**/
const getAddedCoupon = state => state.coupons.addedCoupon;

/**
* Get the coupon from props
**/
const getCoupon = (state, props) => props.item;

/**
* Check if coupon is applied on cart.
**/
export const isCouponApplied = createSelector([getCart], cart => cart.couponFlag === '1');

/**
* Get the coupon added to current brand cart
 */
export const getAddedCouponOfCurrentBrand = createSelector(
  [getAddedCoupon, getBrand, isCouponApplied],
  (addedCoupon, brand, isCouponAppliedOnCart) => (
    isCouponAppliedOnCart && addedCoupon[brand] ? addedCoupon[brand] : {}
  )
);

/**
* Check if the coupon added to current brand cart is available in user's coupon list
 */
export const getIfAddedCouponIsInList = createSelector(
  [getAddedCouponOfCurrentBrand, getOnlineCouponList],
  (addedCoupon, couponList) => couponList.find(coupon => addedCoupon.couponId === coupon.code)
);

/**
 *  Checks if the Coupon form apply button has to be disabled or not
 */
export const isApplyCouponButtonDisabled = createSelector(
  [getEnteredCouponCode, getAddedCouponOfCurrentBrand, getIfAddedCouponIsInList],
  (code, addedCoupon, isAppliedCouponInList) => !(code || (Object.keys(addedCoupon).length && !isAppliedCouponInList))
);

/**
 * @private Checks if atleast one store coupon is selected
 */
export const isStoreCouponSelected = createSelector(
  [getStoreCouponList],
  storeCouponList => !!storeCouponList.find(item => item.selected === true)
);

/**
 * @private Checks if view more button visible for store coupons
 */
export const isAllStoreCouponsLoaded = createSelector(
  [getCouponList, getCouponListCount],
  (couponList, count) => couponList.length > viewLimit.couponList && count < couponList.length
);

/**
 * @private Checks if coupon tile button selected
 */
export const isCouponButtonSelected = createSelector(
  [getAddedCouponOfCurrentBrand, getCoupon],
  (addedCoupon, coupon) => coupon.code === (addedCoupon && addedCoupon.couponId) || coupon.selected
);
