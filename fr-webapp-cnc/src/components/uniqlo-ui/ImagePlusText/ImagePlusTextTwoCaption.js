import React, { PropTypes } from 'react';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser';
import Text from '../Text';
import Link from '../Link';
import Image from '../Image';
import styles from './ImagePlusText.scss';

const { string, oneOfType, node } = PropTypes;

const ImagePlusTextTwoCaption = (props) => {
  const {
    className,
    imageSrc,
    imageTitle,
    text,
    link,
    linkText,
    targetwindow,
    secondaryText,
    secondaryLink,
    secondaryLinkText,
  } = props;
  const wrapClass = mergeClasses(styles.imagePlusText, stylePropsParser(className, styles));
  const twoCaption = mergeClasses(styles.splitContent, styles.twoCaption);

  return (
    <div className={wrapClass}>
      <Image alternateText={imageTitle} source={imageSrc} />
      <div className={styles.splitHead}>
        <div className={twoCaption}>
          <Text content={text} />
          <Link className={styles.link} target={targetwindow} to={link}>
            {linkText}
          </Link>
        </div>
        <div className={twoCaption}>
          <Text content={secondaryText} />
          <Link className={styles.link} target={targetwindow} to={secondaryLink}>
            {secondaryLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
};

ImagePlusTextTwoCaption.propTypes = {
  className: string,
  imageSrc: string.isRequired,
  imageTitle: string,
  text: oneOfType([node, string]),
  link: string,
  linkText: string,
  targetwindow: string,
  secondaryText: string,
  secondaryLink: string,
  secondaryLinkText: string,
  // passed from a parent component
  variation: string,
};
ImagePlusTextTwoCaption.defaultProps = { className: '' };
export default ImagePlusTextTwoCaption;
