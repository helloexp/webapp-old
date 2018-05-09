import React, { PropTypes } from 'react';
import { formatNumberWithCommas } from 'utils/format';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import cx from 'classnames';
import styles from './styles.scss';

const Item = (props, context) => {
  const { cart, common } = context.i18n;
  const {
    description,
    price,
    descriptionClass,
    priceClass,
    className,
    totalItems,
    isTotalPrice,
  } = props;

  const numberOfItems = Number.isInteger(totalItems)
    ? <Text className={styles.totalItems}>{`${cart.totalOf} ${totalItems} ${cart.points}`}</Text>
    : null;
  const negativePrice = priceClass === 'priceDeduction' ? '-' : '';

  let containerClass = `item ${styles.orderSummaryItem}`;

  if (className) {
    containerClass += ` ${className}`;
  }

  return (
    <Container className={containerClass} >
      <Text className={descriptionClass}>
        {description} {numberOfItems}
      </Text>
      <Text className={cx(priceClass, { [styles.itemPrice]: !isTotalPrice })}>
        {`${negativePrice} ${common.currencySymbol}${formatNumberWithCommas(price)}`}
      </Text>
    </Container>);
};

const { string, number, bool } = PropTypes;

Item.propTypes = {
  description: string,
  price: number,
  descriptionClass: string,
  priceClass: string,
  className: string,
  totalItems: PropTypes.number,
  isTotalPrice: bool,
};

Item.defaultProps = {
  descriptionClass: 'description',
  priceClass: 'price',
};

Item.contextTypes = {
  i18n: PropTypes.object,
};

export default Item;
