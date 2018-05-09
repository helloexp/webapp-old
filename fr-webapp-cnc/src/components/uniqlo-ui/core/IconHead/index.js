import React, { PropTypes } from 'react';
import Link from 'components/uniqlo-ui/Link';
import Image from '../../Image';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import styles from './IconHead.scss';
import stylePropsParser from '../../helpers/utils/stylePropParser';

const { string } = PropTypes;

const IconHead = (props) => {
  const {
    rootClass,
    postUrl,
    imageSrc,
    titleText,
    headingType: HeadingType,
    imageClassName,
    className,
    variation,
  } = props;

  const classNames = {
    container: mergeClasses(stylePropsParser(className, styles), rootClass),
    image: mergeClasses('iconHeadImage', stylePropsParser(imageClassName, styles)),
    collageTitle: mergeClasses(styles.title, styles.collageTitle),
    title: styles.title,
    anchor: styles.anchor,
  };

  let RootTag;
  const absoluteUrlPattern = /^(https?:)?\/\//;
  const compProps = { className: classNames.anchor };

  if (absoluteUrlPattern.test(postUrl)) {
    RootTag = 'a';
    compProps.href = postUrl;
  } else {
    RootTag = Link;
    compProps.to = postUrl;
  }

  return (
    postUrl
      ?
        <RootTag {...compProps}>
          <div className={classNames.container} >
            <Image className={classNames.image} source={imageSrc} />
            <h4 className={classNames.title} >{titleText}</h4>
          </div>
        </RootTag>
      : (
        <div className={classNames.container} >
          <Image className={classNames.image} source={imageSrc} />
          <HeadingType className={variation === 'collage' ? classNames.collageTitle : classNames.title}>
            {titleText}
          </HeadingType>
        </div>
    )
  );
};

IconHead.defaultProps = {
  headingType: 'h4',
};

IconHead.propTypes = {
  rootClass: string,
  postUrl: string,
  imageSrc: string,
  titleText: string,
  imageClassName: string,
  headingType: string,
  className: string,
  variation: string,
};

export default IconHead;
