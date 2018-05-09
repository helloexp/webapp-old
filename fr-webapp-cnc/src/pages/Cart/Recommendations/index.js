import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as wishlistActions from 'redux/modules/wishlist/actions';
import FilmStrip from 'components/uniqlo-ui/FilmStrip';
import { isUQPaymentTimeExpired as isUniqloStorePaymentSelector } from 'redux/modules/checkout/order/selectors';
import { routes } from 'utils/urlPatterns';

const Recommendations = ({ productStyles, wishlist = [], toggleWishlist, brand, isUniqloStorePayment }, context) => {
  const { i18n: { common, orderConfirmation }, routerContext: { location: { pathname } } } = context;
  const isPayAtStoreConfirm = pathname.includes(routes.confirmOrder) && isUniqloStorePayment;
  const payAtStoreAlertText = `${common.navigateWarning}\n\n${orderConfirmation.payAtStoreSubTitle[0]}`;
  const navigationTexts = {
    cancelBtnLabel: common.cancelText,
    confirmBtnLabel: common.confirmLabel,
    warningMessage: payAtStoreAlertText,
  };

  return (<FilmStrip
    headingText={context.i18n.pdp.styleBook}
    headingStyle="smallSpacingHeading"
    styleData={productStyles}
    wishlist={wishlist}
    onFavoriteClick={id => toggleWishlist('styles', id, brand)}
    confirmNavigateAway={isPayAtStoreConfirm}
    navigationTexts={navigationTexts}
  />);
};

const { object, array, func, string, bool } = PropTypes;

Recommendations.propTypes = {
  brand: string,
  wishlist: array,
  productStyles: object,
  toggleWishlist: func,
  isUniqloStorePayment: bool,
};

Recommendations.contextTypes = {
  i18n: object,
  config: object,
  routerContext: object,
};

const ConnectedRecommendations = connect((state, props) => ({
  productStyles: state.styleRecommendations.styles,
  wishlist: state.wishlist.all[props.brand].styles,
  isUniqloStorePayment: state.order && state.order.orderDetails && isUniqloStorePaymentSelector(state),
}), {
  toggleWishlist: wishlistActions.toggleWishlist,
})(Recommendations);

export default ConnectedRecommendations;
