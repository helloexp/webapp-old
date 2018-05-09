import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import Container from 'components/uniqlo-ui/core/Container';
import styles from './styles.scss';

const { array, object, string } = PropTypes;
const CartItems = (props, context) => {
  const { miniBag } = context.i18n;
  const {
    items,
    containerStyle,
  } = props;
  const itemContainerStyle = [styles.itemWrapper, containerStyle].filter(Boolean).join(' ');

  return (
    <Container className={itemContainerStyle}>
      {items.map((item, index) =>
        <Container className={`selectedItemImage ${styles.itemImage}`} key={index}>
          <Image source={item.image} className={styles.miniCartImage} />
          <Text className={styles.itemText}> {item.count}{miniBag.count}</Text>
        </Container>
       )}
    </Container>
  );
};

CartItems.propTypes = {
  items: array.isRequired,
  containerStyle: string,
};

CartItems.contextTypes = {
  i18n: object,
};

export default CartItems;
