import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import styles from './styles.scss';
import { renderPaymentMethod } from './utils.js';

const { number, object } = PropTypes;

const PaymentConfirmation = ({ orderConfirmDetails, giftCardPayment }, { i18n, i18n: { orderConfirmation } }) => (
  <Container className={styles.paymentMethod}>
    <Heading
      className={styles.titleSpacing}
      headingText={orderConfirmation.paymentMethod}
      type="h4"
    />
    <Text className="blockText">
      {renderPaymentMethod(orderConfirmDetails, giftCardPayment, i18n)}
    </Text>
  </Container>
);

PaymentConfirmation.propTypes = {
  orderConfirmDetails: object,
  giftCardPayment: number,
};

PaymentConfirmation.contextTypes = {
  i18n: object,
};

export default PaymentConfirmation;
