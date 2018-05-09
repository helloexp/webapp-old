import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import noop from 'utils/noop';
import Button from 'components/uniqlo-ui/Button';
import If from 'components/uniqlo-ui/If';
import { isAllStoreCouponsLoaded } from 'redux/modules/membership/selectors';
import CouponButton from '../components/CouponButton';
import CouponTile from '../components/CouponTile';
import styles from './styles.scss';

const { object, array, string, func, bool, number } = PropTypes;

const getStyles = item => [
  styles.coupon,
  styles.noBorder,
  item.selected
    ? styles.selected
    : '',
  !item.valid ? styles.invalid : '',
].join(' ');

@connect((state, props) => (
  { isCouponViewMore: isAllStoreCouponsLoaded(state, props) }
))
export default class CouponList extends PureComponent {

  static propTypes = {
    items: array,
    className: string,
    onAdd: func,
    onRemove: func,
    onViewMore: func,
    count: number,
    showDetails: func,
    noEdit: bool,
    addedCoupon: object,
    isCouponViewMore: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  static defaultProps = {
    onAdd: noop,
    onRemove: noop,
  };

  render() {
    const { common } = this.context.i18n;
    const {
      items,
      onAdd,
      onRemove,
      onViewMore,
      className,
      count,
      showDetails,
      noEdit,
      addedCoupon,
      isCouponViewMore,
    } = this.props;

    const renderCoupons = items.slice(0, count).map((item, index) => {
      const couponButton = noEdit
        ? null
        : (<CouponButton
          item={item}
          onAddPress={onAdd}
          onRemovePress={onRemove}
        />);

      return (
        <div className={getStyles(item, addedCoupon)} key={index}>
          <CouponTile item={item} showDetails={showDetails} />
          <div className={noEdit ? '' : styles.action}>
            {couponButton}
          </div>
        </div>
      );
    });

    return (
      <div className={[styles.couponList, className].join(' ')}>
        {renderCoupons}
        <div className={classNames(styles.buttonContainer, styles.noBorder, { [styles.lastCoupon]: !isCouponViewMore })}>
          <If
            className={classNames('default', 'medium', styles.caretDown)}
            if={isCouponViewMore}
            label={common.more}
            labelClass={styles.viewMoreButtonSpan}
            onTouchTap={onViewMore}
            then={Button}
          />
        </div>
      </div>
    );
  }
}
