import React, { PropTypes } from 'react';
import Container from 'components/uniqlo-ui/core/Container';
import TimeFrame from 'components/TimeFrame';
import ShippingSummary from 'pages/Checkout/ConfirmOrder/components/ShippingSummary';
import styles from './styles.scss';

const { string } = PropTypes;

const PackingMethod = ({ arrivalDate, containerStyle, shippingPrice, timeFrameMessage }) => (
  <Container className={styles.packingMethod}>
    <ShippingSummary
      titleStyle={styles.titleSpacing}
    />
    <TimeFrame
      {...{ arrivalDate, containerStyle, shippingPrice, timeFrameMessage }}
      titleStyle={styles.titleSpacing}
    />
  </Container>
);

PackingMethod.propTypes = {
  arrivalDate: string,
  containerStyle: string,
  shippingPrice: string,
  timeFrameMessage: string,
};

export default PackingMethod;
