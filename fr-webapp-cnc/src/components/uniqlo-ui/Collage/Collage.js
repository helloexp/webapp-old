import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';
import { externalRedirect } from 'utils/routing';
import Image from '../Image';
import Swipable from '../core/Swipable';
import Heading from '../Heading';
import IconHead from '../core/IconHead';

import styles from './Collage.scss';

const { string, oneOfType, array, object } = PropTypes;

function getChildItems(items) {
  return items.reduce((acc, item, key) => {
    if (item) {
      return acc.concat(
        <div className={styles.smallSize} key={key}>
          { React.cloneElement(item, { className: cx('smallSize', item.props.className) }) }
        </div>
      );
    }

    return acc;
  }, []);
}

function collageImageConfig(imageDetails) {
  return imageDetails.map((child, index) => {
    if (index % 5 === 0) {
      return (
        <div className={styles.fullSize} key={index}>
          { React.cloneElement(child, { className: cx('bigSize', child.props.className) }) }
        </div>
      );
    } else if (index % 5 === 1) {
      const items = [child, imageDetails[index + 1], imageDetails[index + 2], imageDetails[index + 3]];
      const cellClass = items[2] ? styles.fullSize : styles.halfSize;

      return (
        <div className={cellClass} key={index}>
          { getChildItems(items) }
        </div>
      );
    }

    return null;
  });
}

function getHeading(headingText, headingType, headingImage) {
  if (headingText) {
    if (headingImage) {
      return (
        <IconHead
          headingType={headingType}
          imageClassName={styles.imageClassName}
          imageSrc={headingImage}
          rootClass={styles.iconHeadClassCollage}
          titleText={headingText}
          variation="collage"
        />
      );
    }

    return (
      <Heading className={styles.heading} headingText={headingText} type={headingType} />
    );
  }

  return null;
}

const stylesReducer = (accumulator, currentValue) => [...accumulator, ...currentValue];

export default class Collage extends PureComponent {
  static propTypes = {
    styleData: object,
    children: oneOfType([array, object]),
    headingText: string,
    headingType: string,
    headingImage: string,
  };

  static defaultProps = {
    headingType: 'h3',
  };

  static contextTypes = {
    compConfig: object,
  };

  render() {
    const { children, headingText, headingType, headingImage, styleData } = this.props;
    const { compConfig: { collage: { link: shopByLookUrl } } } = this.context;
    let imageDetails;

    if (styleData) {
      const productImages = Object.values(styleData).reduce(stylesReducer, []);

      imageDetails = productImages.map((image, index) =>
        <Image
          key={index}
          source={image.styleImgUrl.replace('.jpg', '-l.jpg')}
          className={styles.image}
          onClick={() => externalRedirect(`${shopByLookUrl}${image.styleId}`)}
        />
      );
    } else {
      imageDetails = children;
    }

    if (!(imageDetails && imageDetails.length)) {
      return null;
    }

    return (
      <div className={styles.container}>
        { getHeading(headingText, headingType, headingImage) }
        <Swipable className={styles && styles.collage}>{ collageImageConfig(imageDetails) }</Swipable>
      </div>
    );
  }
}
