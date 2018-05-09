import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import { formatNumberWithCommas } from 'utils/format';
import styles from './styles.scss';

const { object, string, number, func, node, oneOfType } = PropTypes;

const MiniBagContainer = ({ onToggle, common, totalOrderAmount, toggleButton }) => (
  <div className={styles.wrapper} onClick={onToggle}>
    <div>
      <Text className={styles.price}>{common.price}</Text>
      <div className={styles.priceIconWrap}>
        <Text className={styles.cartIcon} />
        <Text className={styles.totalPrice}>{formatNumberWithCommas(totalOrderAmount)}</Text>
      </div>
    </div>
    <div className={styles.miniBagCaret}>{toggleButton}</div>
  </div>
);

MiniBagContainer.propTypes = {
  common: object,
  onToggle: func,
  toggleButton: node,
  totalOrderAmount: oneOfType([string, number]),
};

export default MiniBagContainer;
