import React, { PropTypes } from 'react';
import Swipable from 'components/uniqlo-ui/core/Swipable';
import ProductCard from 'components/ProductCard';
import { generateWishlistSku } from 'utils/wishlistUtils';
import styles from './styles.scss';

const { object, arrayOf, string, func, array, bool } = PropTypes;

function getCarouselMarkup(productData, notesText, currencySymbol, wishlist, onFavoriteClick, confirmNavigateAway, navigationTexts, brand) {
  return productData.map((item, index) => {
    const { onlineID, defaultColor, defaultSKU, productID } = item;
    const wishlistSku = generateWishlistSku(onlineID, defaultColor, '');
    const isFavorite = !!wishlist.find(sku => sku.includes(wishlistSku));

    return (
      <div className={styles.swipeContainer} key={defaultSKU || productID || index}>
        <ProductCard
          brand={brand}
          chipAndGenderClass="chipAndGender"
          className={styles.productCard}
          isCertona
          product={item}
          variationType="Single-Large-Minus"
          {...{ notesText, currencySymbol, isFavorite, onFavoriteClick, wishlistSku, confirmNavigateAway, navigationTexts }}
        />
      </div>
    );
  });
}

const ProductCardCarousel = ({
  productData,
  notesText,
  currencySymbol,
  wishlist,
  onFavoriteClick,
  confirmNavigateAway,
  navigationTexts,
  brand,
}) => {
  if (!(productData && productData[0] && productData[0].SKUs)) {
    return null;
  }

  return (
    <Swipable activeTranslation swipeItemClassName={styles.swipeItemClass} className={styles.swipableWrapper}>
      { getCarouselMarkup(productData, notesText, currencySymbol, wishlist, onFavoriteClick, confirmNavigateAway, navigationTexts, brand) }
    </Swipable>
  );
};

ProductCardCarousel.propTypes = {
  currencySymbol: string,
  notesText: string,
  productData: arrayOf(object),
  wishlist: array,
  onFavoriteClick: func,
  confirmNavigateAway: bool,
  navigationTexts: object,
  brand: string,
};

export default ProductCardCarousel;
