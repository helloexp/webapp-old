import React, { PropTypes } from 'react';
import cx from 'classnames';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import styles from './styles.scss';

const PlaceOrder = (props, context) => {
  const { reviewOrder } = context.i18n;
  const {
    disabled,
    processOrder,
    errorMessage,
    noPadding,
  } = props;
  const errorText = errorMessage
    ? <div className={styles.errorMessage}>{errorMessage}</div>
    : null;

  return (
    <div className={cx(styles.placeOrderWrap, { [styles.noPadding]: !!noPadding })}>
      <Text className={`reviewOrderText ${styles.reviewOrderTextContainer}`}>
        {reviewOrder.confirmOrderMessage}
      </Text>
      <Button
        className={cx('primary', 'medium', 'bold', 'placeOrderButton', styles.placeOrderBtn)}
        disabled={disabled}
        label={reviewOrder.placeOrder}
        labelClass={styles.placeOrderBtn}
        onTouchTap={processOrder}
        analyticsOn="Button Click"
        analyticsLabel="Complete Order"
        analyticsCategory="Checkout Funnel"
      />
      {errorText}
    </div>
  );
};

PlaceOrder.contextTypes = {
  i18n: PropTypes.object,
};

PlaceOrder.propTypes = {
  disabled: PropTypes.bool,
  processOrder: PropTypes.func,
  errorMessage: PropTypes.string,
  noPadding: PropTypes.bool,
};

export default PlaceOrder;
