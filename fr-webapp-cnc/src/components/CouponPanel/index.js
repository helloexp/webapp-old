import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Panel from 'components/Panel';
import Text from 'components/uniqlo-ui/Text';
import Link from 'components/uniqlo-ui/Link';
import { redirect as goToPage, root } from 'utils/routing';
import styles from './styles.scss';

const CouponPanel = ({ couponName, to, variation, className, isConcierge }, context) => {
  const { coupons: { applyCoupon, appliedCoupons } } = context.i18n;
  const couponContainer = classNames({
    [styles.couponPanel]: variation === 'cart',
    [styles.couponReviewPanel]: variation === 'checkout',
  });
  const cartCouponsContainer = classNames({
    [styles.cartCouponContainer]: variation === 'cart',
    [styles.couponActivePanel]: variation === 'checkout',
  });

  if (!couponName) {
    return (
      <Link
        caret={!isConcierge}
        className={classNames(couponContainer, className)}
        iconClassName={styles.linkCaret}
        contentType="linkTab"
        label={applyCoupon}
        to={`${root}/${to}`}
        analyticsOn="Button Click"
        analyticsCategory="Checkout Funnel"
        analyticsLabel="Change Coupon"
      />
    );
  }

  return (
    <Panel
      className={cartCouponsContainer}
      editable={!isConcierge}
      onEdit={() => goToPage(to)}
      title={appliedCoupons}
    >
      <Text className={styles.coupon}>{couponName}</Text>
    </Panel>
  );
};

const { object, string, oneOf, bool } = PropTypes;

CouponPanel.propTypes = {
  className: string,
  couponName: string,
  to: string,
  variation: oneOf(['cart', 'checkout']),
  isConcierge: bool,
};

CouponPanel.contextTypes = {
  i18n: object,
  router: object,
};

export default CouponPanel;
