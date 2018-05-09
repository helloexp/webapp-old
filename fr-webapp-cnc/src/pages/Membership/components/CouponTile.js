import React, { PropTypes, PureComponent } from 'react';
import classNames from 'classnames';
import Text from 'components/uniqlo-ui/Text';
import couponDate from 'utils/couponValidity';
import CouponImage from '../components/CouponImage';
import styles from './styles.scss';

const { func, object } = PropTypes;

export default class CouponTile extends PureComponent {

  static propTypes = {
    item: object,
    showDetails: func,
  };

  static contextTypes = {
    i18n: object,
  };

  onShowDetails = () => {
    this.props.showDetails(this.props.item);
  };

  render() {
    const { item } = this.props;
    const couponDates = this.context.i18n;

    return (
      <div className={styles.couponWrapper} onClick={this.onShowDetails}>
        <CouponImage
          isCouponUsed={item.isUsed}
          source={item.image}
          alternateText={item.title}
        />
        <div className={styles.description}>
          <Text className={styles.title}>
            {item.title}
          </Text>
          <Text className={classNames('blockText', 'moreComments', 'label', styles.couponDate)}>
            {couponDate(item.validFrom, item.validTo, couponDates)}
          </Text>
        </div>
      </div>
    );
  }
}
