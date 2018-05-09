import React, { PropTypes } from 'react';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser';
import Text from '../Text';
import Image from '../Image';
import ProxyLink from '../core/ProxyLink';
import Heading from '../Heading';
import styles from './ImagePlusText.scss';

const { string, oneOfType, node, oneOf } = PropTypes;

const getImageMarkup = (compProps) => {
  const { imageSrc, imageTitle, variation } = compProps;

  return (
    <div className={styles[`${variation}Class`]}>
      <div className={styles.imageContent}>
        <Image alternateText={imageTitle} source={imageSrc} />
      </div>
    </div>
  );
};

const getTextContainerMarkup = (compProps) => {
  const { header, subHeader, text } = compProps;

  return (
    <div className={styles.singleMediaTextContainer}>
      { header ? <Heading className="singleMediaHeader" headingText={header} type="h1" /> : null }
      { subHeader ? <Heading className="singleMediaSubHeader" headingText={subHeader} type="h1" /> : null }
      { text ? <Text className="singleMediaText" content={text} /> : null }
    </div>
  );
};

const ImagePlusTextSingleMedia = (props) => {
  const {
    className,
    link,
    targetwindow,
    header,
    subHeader,
    text,
  } = props;

  const imageClass = mergeClasses(styles.imagePlusText, styles.singleMediaBg, stylePropsParser(className, styles));
  let imageTextContainerMarkup = null;

  if (header || subHeader || text) {
    imageTextContainerMarkup = getTextContainerMarkup(props);
  }

  const linkProps = link ? {
    linkUrl: link,
    targetwindow,
  } : null;

  return (
    <div className={imageClass}>
      <ProxyLink className="linkTextDecorationNone" {...linkProps}>
        { getImageMarkup(props) }
        { imageTextContainerMarkup }
      </ProxyLink>
    </div>
  );
};

ImagePlusTextSingleMedia.propTypes = {
  className: string,
  imageSrc: string.isRequired,
  imageTitle: string,
  header: string,
  subHeader: string,
  priceText: string,
  text: oneOfType([node, string]),
  link: string,
  linkText: string,
  targetwindow: string,
  variation: string,
  type: oneOf(['image', 'video']),
};

ImagePlusTextSingleMedia.defaultProps = {
  className: '',
  type: 'image',
};

export default ImagePlusTextSingleMedia;
