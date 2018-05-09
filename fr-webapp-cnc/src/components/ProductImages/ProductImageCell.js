import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import styles from './styles.scss';

const ProductImageCell = (props, context) => {
  const { count, image, showCount } = props;
  const { cart } = context.i18n;

  return (
    <div className={styles.eachProductImage}>
      <Image source={image} className={styles.productImage} />
      {showCount && count && <Text className={styles.cartPoints}>{count} {cart.points}</Text> }
    </div>
  );
};

const { string, bool, number, object } = PropTypes;

ProductImageCell.propTypes = {
  count: number,
  image: string,
  showCount: bool,
};

ProductImageCell.contextTypes = {
  i18n: object,
};

export default ProductImageCell;
