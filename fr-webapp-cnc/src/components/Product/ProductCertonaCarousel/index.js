import React, { PropTypes, PureComponent } from 'react';
import classNames from 'classnames';
import Heading from 'components/uniqlo-ui/Heading';
import { root } from 'utils/routing';
import ProductCardCarousel from '../../ProductCardCarousel';
import styles from './styles.scss';

const { object, arrayOf, array, string, func } = PropTypes;

class ProductCertonaCarousel extends PureComponent {
  render() {
    const { items, type, wishlist, toggleWishlist, headingStyle, brand } = this.props;
    const { i18n, config: { CURRENCY_SYMBOL } } = this.context;
    const headerText = i18n.pdp[type];
    const url = `${root}/store/goods`;
    const hasItems = items.length > 0;

    return (
      hasItems ?
        <div className={styles.container}>
          <Heading className={classNames(styles.heading, styles[headingStyle])} headingText={headerText} type="h2" />
          <ProductCardCarousel
            currencySymbol={CURRENCY_SYMBOL}
            linkBaseUrl={url}
            productData={items}
            wishlist={wishlist}
            onFavoriteClick={toggleWishlist}
            brand={brand}
          />
        </div>
        : null
    );
  }
}

ProductCertonaCarousel.propTypes = {
  items: arrayOf(object),
  wishlist: array,
  toggleWishlist: func,
  headingStyle: string,
  type: string.isRequired,
  brand: string,
};

ProductCertonaCarousel.contextTypes = {
  i18n: object,
  config: object,
  routerContext: object,
};

export default ProductCertonaCarousel;
