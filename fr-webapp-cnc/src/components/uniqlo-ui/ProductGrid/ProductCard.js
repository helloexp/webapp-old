import React, { PureComponent, PropTypes } from 'react';
import getProperty from 'utils/getProperty';
import classnames from 'classnames';
import ProxyLink from '../core/ProxyLink';
import stylePropsParser from '../helpers/utils/stylePropParser';
import GridCell from '../core/GridCell';
import DataCard from './DataCard';
import ImageCard from './ImageCard';
import If from '../If';
import styles from './ProductCard.scss';
import variationToCss from './variationToCss';

const { object, bool, string, number, func } = PropTypes;

/**
 * Variations from components
 *   Two-Column: TwoColumnCard
 *   Two-ColumnPlus: TwoColumnCard
 *   Single-Small: SingleSmallCard
 *   Single-SmallPlus: SingleSmallCard
 *   Multi-Small: DesktopCard
 *   Multi-Large: DesktopCard
 *   Single-Large: SingleLargeCard
 *   Single-Large-Minus: SingleLargeCard
 *   Single-LargePlus: SingleLargeCard
 *   Single-Small-Outfit: SingleSmallOutfitCard
 *   Single-Small-Cart: SingleSmallCartCard
 *   largeProduct: SingleLargeCarouselCard
 *   largeProductRectangle1E1: SingleLargeCarouselCard
 *   largeProductRectangle3E4: SingleLargeCarouselCard
 *
 */

const defaultVariationType = 'Single-Small';

export default class ProductCard extends PureComponent {
  static propTypes = {
    product: object,
    isCartCard: bool,
    colSpan: number,
    productData: object,
    className: string,
    colorChipFlag: bool,
    genderSizeFlag: bool,
    titleFlag: bool,
    priceFlag: bool,
    flags: bool,
    colorFlag: bool,
    sizeFlag: bool,
    idFlag: bool,
    isGridItem: bool,
    onFavoriteClick: func,
    wishlistSku: string,
    confirmNavigateAway: bool,
    navigationTexts: object,
    brand: string,
    itemCode: string,
  };

  static defaultProps = {
    isCartCard: false,
    colSpan: 3,
    titleFlag: true,
    colorChipFlag: true,
    genderSizeFlag: true,
    priceFlag: true,
    flags: true,
    isGridItem: false,
  };

  static contextTypes = {
    compConfig: object,
    config: object,
  };

  render() {
    const {
      product,
      productData,
      className,
      colSpan,
      isGridItem,
      brand,
      itemCode,
      ...other
    } = this.props;
    const { compConfig, config } = this.context;

    let productInfo = product;

    if (!product) {
      if (productData) {
        productInfo = productData;
      } else {
        return null;
      }
    }

    const classNames = className ? stylePropsParser(className, styles).join(' ') : '';
    const variation = other.variation || other.variationType || defaultVariationType;
    const classes = classnames(styles.productCard, variationToCss(styles, variation), classNames, {
      [styles.singleSmall]: variation === 'Single-Small',
    });

    other.variation = variation;
    const brandPdpUrl = brand === config.brandName.gu
      ? getProperty(compConfig, 'productGrid.pdpGuBaseUrl', '')
      : getProperty(compConfig, 'productGrid.pdpBaseUrl', '');
    const productId = brand === config.brandName.uq && itemCode || product.onlineId || product.productId || product.onlineID;
    const linkToPDP = `${brandPdpUrl}${productId}`;

    return (
      <If
        className={styles.gridLinkWrapper}
        else
        if={isGridItem}
        then={ProxyLink}
      >
        <GridCell className={classes} colSpan={colSpan}>
          <ImageCard {...other} product={productInfo} linkToPDP={linkToPDP} />
          <DataCard {...other} product={productInfo} linkToPDP={linkToPDP} />
        </GridCell>
      </If>
    );
  }
}
