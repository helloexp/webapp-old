import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import { isSpecialPrice } from 'utils/productUtils';
import { formatNumberWithCommas as format } from 'utils/format';
import styles from './DataCard.scss';
import Text from '../Text';

const { number, string, bool, array } = PropTypes;

export default class PriceComponent extends PureComponent {
  static propTypes = {
    price: number,
    currencySymbol: string,
    multiBuyPrice: bool,
    specialFlags: array,
  };

  render() {
    const {
      price,
      currencySymbol,
      multiBuyPrice,
      specialFlags,
    } = this.props;

    if (!price) {
      return null;
    }

    const priceClassNames = classnames(styles.itemPrice, {
      [styles.multiBuyPrice]: multiBuyPrice,
      [styles.productOnOffer]: isSpecialPrice(specialFlags),
    });

    return (
      <div className={styles.priceWrapper}>
        <Text className={priceClassNames} content={`${currencySymbol}${format(price)}`} />
      </div>
    );
  }
}
