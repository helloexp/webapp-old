import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import { couponBarcodeApi } from 'redux/modules/membership/coupons';
import { getFormattedDateWithTime } from 'utils/formatDate';
import { appendZero } from 'utils/format';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import If from 'components/uniqlo-ui/If';
import styles from './styles.scss';

const { object, func, bool, number } = PropTypes;
const barcodeTextStyle = classNames(styles.barCodeText, 'blockText');

const BarcodeImage = ({ coupon }) => (
  <div className={styles.barcodeImageWrapper}>
    <If
      className={styles.barcodeImage}
      if={coupon.hasBarcode}
      source={`${couponBarcodeApi}${coupon.id}`}
      then={Image}
    />
  </div>
);

BarcodeImage.propTypes = {
  coupon: object,
};

const BarcodeButton = ({ selectACoupon }, { i18n: { membership } }) => (
  <Button
    className={classNames('medium', 'secondary', styles.useCouponBtn)}
    label={membership.useCoupon}
    onTouchTap={selectACoupon}
  />
);

BarcodeButton.propTypes = {
  selectACoupon: func,
};

BarcodeButton.contextTypes = {
  i18n: object,
};

const BarcodeView = ({ coupon, selectACoupon, isUseCoupon }) => (
  <If
    coupon={coupon}
    else={BarcodeImage}
    if={isUseCoupon}
    selectACoupon={selectACoupon}
    then={BarcodeButton}
  />
);

BarcodeView.propTypes = {
  isUseCoupon: bool,
  selectACoupon: func,
  coupon: object,
};

export default class BarcodeTile extends PureComponent {
  static propTypes = {
    coupon: object,
    isUseCoupon: bool,
    selectACoupon: func,
    index: number,
  };

  static contextTypes = {
    i18n: object,
  };

  onSelectACoupon = () => {
    this.props.selectACoupon(this.props.coupon.code);
  }

  render() {
    const { coupon, isUseCoupon, index } = this.props;
    const couponNumber = `${appendZero(index + 1)}.`;

    return (
      <div className={styles.barCodeTextWrap}>
        <Text className={classNames(barcodeTextStyle, styles.couponName)}>{couponNumber}</Text>
        <Text className={barcodeTextStyle}>{coupon.title}</Text>
        <Text className={classNames(styles.barCodeText, styles.barCodeMainText)}>
          {getFormattedDateWithTime(coupon.validTo, this.context.i18n)}
        </Text>
        <BarcodeView coupon={coupon} isUseCoupon={isUseCoupon} selectACoupon={this.onSelectACoupon} />
      </div>
    );
  }
}
