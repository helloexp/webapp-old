import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';
import ImagePlusTextTwoCaption from './ImagePlusTextTwoCaption';
import ImagePlusTextSingleMedia from './ImagePlusTextSingleMedia';
import ImagePlusTextLargeProduct from './ImagePlusTextLargeProduct';
import ImagePlusTextTRBL from './ImagePlusTextTRBL';
import styles from './ImagePlusText.scss';

const { array, string, object, oneOf, oneOfType, node } = PropTypes;

export default class ImagePlusText extends PureComponent {
  static displayName = 'ImagePlusText';
  static propTypes = {
    children: oneOfType([array, object]),
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
    secondaryText: string,
    secondaryLink: string,
    secondaryLinkText: string,
    variation: oneOf(
      [
        'imageRight', 'imageLeft', 'imageTop', 'imageBottom', 'twoCaption',
        'singleMediaWideImage', 'singleMediaLongImage', 'singleMediaSquareImage', 'singleMediaExtraWideImage',
        'largeProduct', 'largeProductRectangle1E1', 'largeProductRectangle3E4',
        'largeProductRectangle',
      ]
    ).isRequired,
  };

  render() {
    const { variation } = this.props;
    let className = styles.imagePlusTextWrapper;
    let MarkupToRender = null;
    let direction = '';

    switch (variation) {
      case 'imageRight':
        MarkupToRender = ImagePlusTextTRBL;
        direction = 'right';
        break;
      case 'imageLeft':
        MarkupToRender = ImagePlusTextTRBL;
        direction = 'left';
        break;
      case 'imageTop':
        MarkupToRender = ImagePlusTextTRBL;
        direction = 'top';
        break;
      case 'imageBottom':
        MarkupToRender = ImagePlusTextTRBL;
        direction = 'bottom';
        break;
      case 'singleMediaWideImage':
      case 'singleMediaLongImage':
      case 'singleMediaExtraWideImage':
      case 'singleMediaSquareImage':
        MarkupToRender = ImagePlusTextSingleMedia;
        className = cx(className, styles.singleMediaSpacer);
        break;
      case 'twoCaption':
        MarkupToRender = ImagePlusTextTwoCaption;
        break;
      case 'largeProduct':
      case 'largeProductRectangle1E1':
      case 'largeProductRectangle3E4':
        MarkupToRender = ImagePlusTextLargeProduct;
        break;
      default:
        MarkupToRender = ImagePlusTextTRBL;
        direction = 'top';
    }

    return (
      <div className={className}>
        <MarkupToRender {...this.props} direction={direction} />
      </div>
    );
  }
}
