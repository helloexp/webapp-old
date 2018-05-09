import React, { PropTypes, PureComponent } from 'react';
import classNames from 'classnames';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import If from 'components/uniqlo-ui/If';
import couponDate from 'utils/couponValidity';
import { getFormattedDate } from 'utils/formatDate';
import CouponImage from '../components/CouponImage';
import styles from './styles.scss';

const { object } = PropTypes;
const descriptionTextStyle = classNames('blockText', 'moreComments', 'label', styles.descriptionText);

export default class CouponDetails extends PureComponent {

  static propTypes = {
    coupon: object,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { coupons } = this.context.i18n;
    const {
      isUsed,
      image,
      title,
      validFrom,
      validTo,
      usedDate,
      usableStores,
      usageNotes,
    } = this.props.coupon;

    return (
      <Container className={styles.couponDetailsContainer}>
        <CouponImage
          isCouponUsed={isUsed}
          source={image}
          alternateText={title}
          isCouponDetails
        />
        <Container className={styles.descriptionContainer}>
          <If
            if={isUsed}
            then={Text}
            content={coupons.usedMessage}
            className={classNames('blockText', styles.couponHeading)}
          />
          <Text className={classNames('blockText', styles.couponName)}>
            {title}
          </Text>
          <If
            if={!isUsed}
            then={Text}
            content={`${coupons.expirationDate}: ${couponDate(validFrom, validTo, this.context.i18n)}`}
            className={descriptionTextStyle}
          />
          <If
            if={isUsed}
            then={Text}
            content={`${coupons.usedDate}: ${getFormattedDate(usedDate)}`}
            className={descriptionTextStyle}
          />
          <If
            if={!isUsed}
            then={Text}
            content={`${coupons.usableStores}: ${usableStores}`}
            className={descriptionTextStyle}
          />
          <If
            if={!isUsed}
            then={Text}
            content={`${coupons.usageNotes}: ${usageNotes}`}
            className={descriptionTextStyle}
          />
        </Container>
      </Container>
    );
  }
}
