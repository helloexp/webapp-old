import { createSelector } from 'reselect';
import { getBrand } from 'redux/modules/cart/selectors';

const getWishlist = state => state.wishlist;

export const getBrandedWishlists = createSelector(
  [getWishlist, getBrand],
  (wishlist, brand) => wishlist.all[brand].products,
);
