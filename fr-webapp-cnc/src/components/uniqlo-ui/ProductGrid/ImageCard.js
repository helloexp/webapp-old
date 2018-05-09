import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import { getProductSize } from 'utils/productUtils';
import noop from 'utils/noop';
import Link from 'components/uniqlo-ui/Link';
import Image from '../Image';
import GridCell from '../core/GridCell';
import Icon from '../core/Icon';
import FavoriteButton from '../FavoriteButton';
import Chip from '../Chip';
import ChipChild from '../Chip/ChipChild';
import Text from '../Text';
import { colorSort } from '../helpers/utils/productService';
import If from '../If';
import styles from './ImageCard.scss';

const { object, bool, string, array, func } = PropTypes;

const ChipsWrapper = (props) => {
  const { productImagesSwatchUrls, colorChipFlag, variation } = props;
  const chipStyles = classnames(styles.productChip, {
    [styles.noHzSpazing]: variation === 'threeColumnList',
    [styles.noRightSpazing]: variation === 'Single-Small',
    [styles.mediumTopSpazing]: variation === 'Single-Large-Minus',
  });
  const childChipStyles = classnames(styles.productChildChip, {
    [styles.childChipSmall]: variation === 'Single-Large-Minus',
  });
  const iconClass = classnames('plusIcon', {
    [styles.plusIconStyles]: variation === 'Single-Large-Minus',
  });

  if (!colorChipFlag) {
    return null;
  }

  const chips = [];

  productImagesSwatchUrls.some((source, index) => {
    chips.push(
      <ChipChild className={childChipStyles} key={index}>
        <If if={index < 7} source={source} then={Image} />
        <If className={iconClass} if={index === 7} name="ActionPlus" then={Icon} />
      </ChipChild>
    );

    return index === 7;
  });

  return <Chip className={chipStyles}>{chips}</Chip>;
};

ChipsWrapper.propTypes = {
  productImagesSwatchUrls: array,
  colorChipFlag: bool,
  variation: string,
};

function getImageUrl(images, colorCode) {
  if (images && Object.keys(images).length > 0) {
    return images[colorCode];
  }

  return false;
}

export default class ImageCard extends PureComponent {

  static propTypes = {
    colorChipFlag: bool,
    product: object,
    isCartItem: bool,
    isCertona: bool,
    selectedColorCode: string,
    productColor: string,
    customImage: string,
    variation: string,
    productSize: string,
    oddTwoColumnCell: bool,
    genderSizeFlag: bool,
    isFavorite: bool,
    onFavoriteClick: func,
    wishlistSku: string,
    linkToPDP: string,
    confirmNavigateAway: bool,
    navigationTexts: object,
  };

  static defaultProps = {
    colorChipFlag: true,
    onFavoriteClick: noop,
  };

  onFavoriteClick = () => {
    const { onFavoriteClick, wishlistSku } = this.props;

    onFavoriteClick(wishlistSku);
  };

  render() {
    const {
      colorChipFlag,
      product,
      product: {
        sizes,
        SKUs,
      },
      selectedColorCode,
      productColor,
      isCartItem,
      customImage,
      oddTwoColumnCell,
      genderSizeFlag,
      productSize,
      variation,
      isCertona,
      isFavorite,
      linkToPDP,
      confirmNavigateAway,
      navigationTexts,
    } = this.props;

    const defaultImage = customImage || getImageUrl(product.images.main.urls, selectedColorCode || productColor || product.defaultColor);
    const images = product && product.images;
    const defaultSize = getProductSize(sizes, SKUs) || productSize;
    const swatchImages = images && images.swatch && images.swatch.urls;
    const chipUrls = [];

    if (swatchImages) {
      Object.keys(swatchImages).forEach(code => chipUrls.push(swatchImages[code]));
    }

    const chipsCount = chipUrls && chipUrls.length;
    const genderName = product && product.genderName;
    const chipGenderStyles = classnames('', {
      [styles.chipGender]: variation === 'Single-Large' || variation === 'Single-Large-Minus',
      [styles.certona]: isCertona,
    });
    const genderSizeStyles = classnames(styles.genderSize,
      {
        [styles.genderSizeLarge]: variation === 'Single-Large',
        [styles.genderSizeLarger]: variation === 'Single-Large-Minus',
      });
    const variationName = variation === 'Single-Small' ? 'singleSmall' : variation;
    const imageStyles = classnames(styles.imageSection, styles[variationName]);
    let productImagesSwatchUrls = [];

    if (!isCartItem && colorChipFlag && chipsCount > 0) {
      // If it is a CartItem we need to sort the color chip
      const urls = colorSort(chipUrls);

      if (chipUrls.length > 8) {
        urls.push('More');
      }

      productImagesSwatchUrls = urls;
    }

    return (
      <GridCell className={styles.imageGridCell}>
        <div className={oddTwoColumnCell ? styles.imageSectionBorder : imageStyles}>
          <Link
            to={linkToPDP}
            confirmNavigateAway={confirmNavigateAway}
            navigationTexts={navigationTexts}
            noRouter
          >
            <Image source={defaultImage} />
          </Link>
          <FavoriteButton isActive={isFavorite} onClick={this.onFavoriteClick} className={styles.productCardFavButton} />
        </div>
        <div className={oddTwoColumnCell ? styles.extendedBorder : chipGenderStyles}>
          <ChipsWrapper
            colorChipFlag={colorChipFlag && chipsCount > 0}
            productImagesSwatchUrls={productImagesSwatchUrls}
            variation={variation}
          />
          <If className={genderSizeStyles} if={(['Single-Small', 'Single-Large', 'Single-Large-Minus'].includes(variation)) && genderSizeFlag}>
            <Text>{genderName}</Text>
            <Text>{defaultSize}</Text>
          </If>
        </div>
      </GridCell>
    );
  }
}
