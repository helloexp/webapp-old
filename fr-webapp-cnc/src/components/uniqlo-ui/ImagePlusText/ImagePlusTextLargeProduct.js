import React, { PropTypes } from 'react';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser';
import Text from '../Text';
import Image from '../Image';
import styles from './ImagePlusText.scss';

const { string, oneOfType, node } = PropTypes;

const getImageMarkup = (compProps) => {
  const { imageSrc, imageTitle, variation, imageClass } = compProps;

  return (
    <Image
      alternateText={imageTitle}
      className={imageClass}
      imageclassName={`${variation}Image`}
      source={imageSrc}
    />
  );
};

const getTextContainerMarkup = (compProps) => {
  const { header, text, priceText, subHeader, headerClass, textWrapperClass, textClass } = compProps;
  const classNames = {
    priceTextClass: subHeader ? 'carouselLargeProductPriceLimited'
      : 'carouselLargeProductPrice',
    headerWrapperClass: mergeClasses('carouselLargeProductName', headerClass),
    textClassWrapper: mergeClasses(styles.largeProdTextContainer, stylePropsParser(textWrapperClass, styles)),
    textClass: mergeClasses('carouselLargeProductFlagText', textClass),
  };

  return (
    <div className={classNames.textClassWrapper}>
      { header ? <Text className={classNames.headerWrapperClass} content={header} /> : null }
      { text ? <Text className={classNames.textClass} content={text} /> : null }
      { priceText ? <Text className={classNames.priceTextClass} content={priceText} /> : null }
      { subHeader ? <Text className="carouselLargeProductLimitedText" content={subHeader} /> : null }
    </div>
  );
};

const ImagePlusTextLargeProduct = (props) => {
  const { className } = props;
  const imageClass = mergeClasses(styles.imagePlusText, stylePropsParser(className, styles));

  return (
    <div className={imageClass}>
      { getImageMarkup(props) }
      { getTextContainerMarkup(props) }
    </div>
  );
};

ImagePlusTextLargeProduct.propTypes = {
  className: string,
  imageSrc: string.isRequired,
  imageTitle: string,
  header: string,
  subHeader: string,
  headerClass: string,
  priceText: string,
  textWrapperClass: string,
  text: oneOfType([node, string]),
  textClass: string,
  link: string,
  linkText: string,
  targetwindow: string,
  variation: string,
};

export default ImagePlusTextLargeProduct;
