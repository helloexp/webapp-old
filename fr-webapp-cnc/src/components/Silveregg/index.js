import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { toggleWishlist as toggleWishlistAction } from 'redux/modules/wishlist/actions';
import { getBrand, getGuProductRecomendations } from 'redux/modules/cart/selectors';
import { getBrandedWishlists } from 'redux/modules/wishlist/selectors';
import { root } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import ProductCardCarousel from 'components/ProductCardCarousel';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import styles from './styles.scss';

const { string, array, func, object } = PropTypes;

const ProductCardCarouselWrapper = ({ title, items, wishlist, onFavoriteClick, brand }, { CURRENCY_SYMBOL }) => (
  <div className={styles.container}>
    <Heading className={styles.heading} headingText={title} type="h3" />
    <ProductCardCarousel
      linkBaseUrl={`${root}/${routes.productDetails}`}
      currencySymbol={CURRENCY_SYMBOL}
      productData={items}
      {...{ wishlist, onFavoriteClick, brand }}
    />
  </div>
);

ProductCardCarouselWrapper.propTypes = {
  items: array,
  wishlist: array,
  onFavoriteClick: func,
  brand: string,
  specType: string,
  title: string,
};

ProductCardCarouselWrapper.contextTypes = {
  config: object,
};

@connect((state, props) => ({
  brand: getBrand(state, props),
  items: getGuProductRecomendations(state, props),
  wishlist: getBrandedWishlists(state, props),
}), {
  toggleWishlist: toggleWishlistAction,
})
export default class Silveregg extends PureComponent {
  static propTypes = {
    items: array,
    wishlist: array,
    toggleWishlist: func,
    specType: string,
    brand: string,
  };

  static defaultProps = {
    items: [],
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  toggleWishlist = id => this.props.toggleWishlist('products', id, this.props.brand);

  render() {
    const { specType, items, brand, wishlist } = this.props;
    const {
      i18n: { cart: { guFreeShippingRecommendations, guRecommendations } },
      config: { silveregg: { specType11, specTypeApp11 } },
    } = this.context;
    const title = (specType === specType11 || specType === specTypeApp11) ? guFreeShippingRecommendations : guRecommendations;

    return (
      <If
        if={items.length}
        then={ProductCardCarouselWrapper}
        onFavoriteClick={this.toggleWishlist}
        {...{ title, items, brand, wishlist }}
      />
    );
  }
}
