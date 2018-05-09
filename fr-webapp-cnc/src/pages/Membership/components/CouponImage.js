import React, { PureComponent, PropTypes } from 'react';
import If from 'components/uniqlo-ui/If';
import Image from 'components/uniqlo-ui/Image';
import usedStampImage from '../images/used-stamp.png';
import styles from './styles.scss';

const { bool, string } = PropTypes;

const UsedStamp = () => (
  <div className={styles.overlayContainer}>
    <Image className={styles.overlayImage} source={usedStampImage} />
  </div>
);

export default class CouponImage extends PureComponent {

  static propTypes = {
    isCouponUsed: bool,
    source: string,
    alternateText: string,
    isCouponDetails: bool,
  };

  render() {
    const { isCouponUsed, source, alternateText, isCouponDetails } = this.props;
    const imageWrapperClass = isCouponDetails ? styles.couponDetailsImage : styles.couponListImage;

    return (
      <div
        className={imageWrapperClass}
      >
        <If
          if={isCouponUsed}
          then={UsedStamp}
        />
        <Image
          alternateText={alternateText}
          source={source}
          className={styles.couponImage}
        />
      </div>
    );
  }
}
