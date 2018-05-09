import React, { PropTypes, PureComponent } from 'react';
import { root } from 'utils/routing';
import { connect } from 'react-redux';
import * as wishlistActions from 'redux/modules/wishlist/actions';
import { loadRecentlyViewedData as loadRecentlyViewedDataAction } from 'redux/modules/style';
import { isUQPaymentTimeExpired as isUniqloStorePaymentSelector } from 'redux/modules/checkout/order/selectors';
import { routes } from 'utils/urlPatterns';
import ProductCardCarousel from 'components/ProductCardCarousel';
import Heading from 'components/uniqlo-ui/Heading';
import styles from './styles.scss';

const { string, object, array, func, bool } = PropTypes;

@connect(
  (state, props) => ({
    recentlyViewed: state.styleRecommendations.recentlyViewed,
    recentlyViewedData: state.styleRecommendations.recentlyViewedData,
    wishlist: state.wishlist.all[props.brand].products,
    isUniqloStorePayment: state.order.orderList && isUniqloStorePaymentSelector(state),
  }),
  {
    toggleWishlist: wishlistActions.toggleWishlist,
    loadRecentlyViewedData: loadRecentlyViewedDataAction,
  }
)
export default class RecentlyViewed extends PureComponent {
  static propTypes = {
    recentlyViewed: array,
    recentlyViewedData: array,
    wishlist: array,
    toggleWishlist: func,
    loadRecentlyViewedData: func,
    brand: string,
    isUniqloStorePayment: bool,
  };

  static contextTypes = {
    i18n: object,
    config: object,
    routerContext: object,
  };

  componentWillMount() {
    const { recentlyViewed = [], brand } = this.props;

    this.loadRecentlyViewedItems(recentlyViewed, brand);
  }

  componentDidMount() {
    const {
      i18n: {
        common,
        orderConfirmation,
      },
    } = this.context;

    this.payAtStoreAlertText = `${common.navigateWarning}\n\n${orderConfirmation.payAtStoreSubTitle[0]}`;
  }

  componentWillReceiveProps(nextProps) {
    const { recentlyViewed = [], brand } = this.props;

    if (brand !== nextProps.brand) {
      this.loadRecentlyViewedItems(recentlyViewed, nextProps.brand);
    }
  }

  loadRecentlyViewedItems(itemIds, brand) {
    if (itemIds && itemIds.length > 0) {
      this.props.loadRecentlyViewedData(itemIds, brand);
    }
  }

  toggleWishlist = id => this.props.toggleWishlist('products', id, this.props.brand);

  render() {
    const {
      config: { CURRENCY_SYMBOL },
      i18n: {
        cart: {
          recentlyViewedHeading,
        },
        common,
      },
      routerContext: {
        location: {
          pathname,
        },
      },
    } = this.context;
    const {
      wishlist,
      recentlyViewedData,
      brand,
      isUniqloStorePayment,
    } = this.props;

    const url = `${root}/store/goods`;
    const hasItems = recentlyViewedData && recentlyViewedData.length > 0;
    const isPayAtStoreConfirm = pathname.includes(routes.confirmOrder) && isUniqloStorePayment;
    const navigationTexts = {
      cancelBtnLabel: common.cancelText,
      confirmBtnLabel: common.confirmLabel,
      warningMessage: this.payAtStoreAlertText,
    };

    return (
      hasItems ?
        (<div className={styles.container}>
          <Heading className={styles.heading} headingText={recentlyViewedHeading} type="h3" />
          <ProductCardCarousel
            currencySymbol={CURRENCY_SYMBOL}
            linkBaseUrl={url}
            productData={recentlyViewedData}
            wishlist={wishlist}
            onFavoriteClick={this.toggleWishlist}
            brand={brand}
            confirmNavigateAway={isPayAtStoreConfirm}
            navigationTexts={navigationTexts}
          />
        </div>)
        : null
    );
  }
}
