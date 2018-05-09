import React, { PropTypes } from 'react';
import Heading from '../Heading';
import Text from '../Text';
import Link from '../Link';
import Image from '../Image';
import stylePropsParser from '../helpers/utils/stylePropParser';
import { mergeClasses } from '../helpers/utils/stylePropable';
import styles from './ImagePlusText.scss';

// TRBL -> Top, Right, Bottom, Left
// TRBL -> ImageTop, ImageRight, ImageBottom, ImageLeft
const { string, oneOfType, node } = PropTypes;

const directionMap = {
  top: ['image', 'rest'],
  right: ['rest', 'image'],
  bottom: ['rest', 'image'],
  left: ['image', 'rest'],
};

// Variation specific options (ClassNames)
function getVariationSpecificClasses(direction) {
  const { imageTop, imageTopWrapper, imageTopBottomWrapper, imageBottom, imageRightAndLeftTextContainer, horizontal, imageWrapper } = styles;

  switch (direction) {
    case 'top':
      return {
        textWrapper: imageTop,
        secondaryTextWrapper: imageTopWrapper,
        wrapClass: '',
        imageClass: imageTopBottomWrapper,
        imageVariation: 'imagePlusText',
      };
    case 'bottom':
      return {
        textWrapper: imageBottom,
        secondaryTextWrapper: '',
        wrapClass: imageTopBottomWrapper,
        imageClass: '',
        imageVariation: 'imagePlusText',
      };
    case 'left':
    case 'right':
      return {
        textWrapper: imageRightAndLeftTextContainer,
        secondaryTextWrapper: styles[direction],
        wrapClass: horizontal,
        imageClass: imageWrapper,
        imageVariation: '',
      };
    default:
      return {};
  }
}

// Get classes according to variation
function getVariationClassNames(props) {
  const { className, direction, header, headerClass, imageClass, subHeader, subHeaderClass, textClass, textWrapperClass } = props;
  const variationClass = getVariationSpecificClasses(direction);

  return {
    textWrapperClass: mergeClasses(variationClass.textWrapper, variationClass.secondaryTextWrapper, stylePropsParser(textWrapperClass, styles)),
    headerClass: mergeClasses('imagePlusTextHeader', stylePropsParser(headerClass, styles)),
    subHeaderClass: header ? mergeClasses('imagePlusTextSubHeader', subHeaderClass) : mergeClasses('imagePlusTextSubHeader', 'zeroPaddingTop', subHeaderClass),
    textClass: subHeader || header ? mergeClasses('imagePlusText', textClass) : mergeClasses('imagePlusText', 'zeroPaddingTop', textClass),
    imageClass: mergeClasses(variationClass.imageClass, stylePropsParser(imageClass, styles)),
    wrapClass: mergeClasses(styles.imagePlusText, variationClass.wrapClass, styles.horizontalPadding, stylePropsParser(className, styles)),
    imageVariation: variationClass.imageVariation,
  };
}

// Generate the markup for the two portions of the component
function getMarkup(compProps) {
  const { direction, header, imageSrc, imageTitle, linkText, subHeader, text, ...other } = compProps;
  const { headerClass, imageClass, subHeaderClass, textClass, textWrapperClass, wrapClass, imageVariation } = getVariationClassNames(compProps);

  // Text portions
  const heading = header ? <Heading className={headerClass} headingText={header} type="h6" /> : null;
  const subHeading = subHeader ? <Heading className={subHeaderClass} headingText={subHeader} type="h6" /> : null;
  const textDescription = text ? <Text className={textClass} content={text} /> : null;

  // description portion
  const rest = key =>
    <div key={key} className={textWrapperClass}> { heading } { subHeading } { textDescription } { linkText } </div>;

  // Image content
  const image = key =>
    <div key={key} className={imageClass}> <Image alternateText={imageTitle} className={imageVariation} source={imageSrc} /> </div>;

  // render in the order defined
  const markup = { image, rest };

  delete other.variation;

  return (
    <div {...other} className={wrapClass}>
      { directionMap[direction].map((item, idx) => markup[item](idx)) }
    </div>
  );
}

// If link exist the component should be wrapped with Link
const wrapChild = (link, targetwindow, childComponent) =>
  (link ? <Link target={targetwindow} to={link}> {childComponent} </Link> : <div> {childComponent} </div>);

// Component to Handle ImageTop, ImageRight, ImageBottom, ImageLeft
const ImagePlusTextTRBL = (props) => {
  const { targetwindow, link } = props;
  const contentMarkUp = getMarkup(props);

  return wrapChild(link, targetwindow, contentMarkUp);
};

ImagePlusTextTRBL.propTypes = {
  className: string,
  direction: string,
  header: string,
  headerClass: string,
  imageClass: string,
  imageSrc: string.isRequired,
  imageTitle: string,
  link: string,
  linkText: string,
  subHeader: string,
  subHeaderClass: string,
  text: oneOfType([node, string]),
  textClass: string,
  targetwindow: string,
  textWrapperClass: string,
};

export default ImagePlusTextTRBL;
