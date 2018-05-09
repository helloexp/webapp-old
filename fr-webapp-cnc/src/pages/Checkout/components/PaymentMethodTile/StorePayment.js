import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Link from 'components/uniqlo-ui/Link';
import If from 'components/uniqlo-ui/If';
import styles from './styles.scss';

const StorePayment = (props, context) => {
  const { paymentMethod: { payAtStore }, common } = context.i18n;
  const { store, paymentLink, brand, isConcierge } = props;

  return (
    <Container className={`z8 ${styles.tileContainer}`} >
      <Container className={styles.addressCover}>
        <Text className={`tileHead ${styles.tileHead}`} >{payAtStore[brand]}</Text>
        <Text className={`blockText ${styles.addressDetails}`} >{store.name}</Text>
        <Text className={`blockText ${styles.addressDetails}`}>{store.city}{store.municipality}{store.number}</Text>
      </Container>
      <If
        if={!isConcierge}
        then={Link}
        className={styles.editLink}
        editLink
        label={common.edit}
        to={paymentLink}
      />
    </Container>
  );
};

const { object, string, bool } = PropTypes;

StorePayment.contextTypes = {
  i18n: object,
};

StorePayment.propTypes = {
  store: object,
  paymentLink: string,
  brand: string,
  isConcierge: bool,
};

export default StorePayment;
