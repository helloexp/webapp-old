import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import Link from 'components/uniqlo-ui/Link';
import ProductImages from 'components/ProductImages';
import { routes } from 'utils/urlPatterns';
import styles from './styles.scss';

const OrderIdLink = (args) => {
  const { orderNo, headingText } = args;

  return (
    <Link to={`${routes.orderDetails}/${orderNo}`}>
      <Heading
        headingText={headingText}
        type="h4"
        className={styles.letterSpacing}
      />
    </Link>
  );
};

const OrderedProductImages = (args) => {
  const { shipments } = args;

  return (
    <Container className={styles.itemWrapper}>
      <ProductImages dataArray={shipments} showCount />
    </Container>
  );
};

const OrderItemsSummary = (props, context) => {
  const {
    shipments,
    orderNo,
    plannedDates,
    payAtStore,
    isApplePayGuestUser,
  } = props;
  const { orderConfirmation, applePay } = context.i18n;
  const className = isApplePayGuestUser ? styles.applePayOrderDetails : `${styles.containerItems} ${styles.borderBottom}`;
  const OrderIdComponent = isApplePayGuestUser ? Heading : OrderIdLink;

  return (
    <Container className={className}>
      <If
        if={!payAtStore && orderNo}
        orderNo={orderNo}
        type="h4"
        headingText={`${orderConfirmation.orderNo} : # ${orderNo}`}
        then={OrderIdComponent}
        className={styles.letterSpacing}
      />
      <Text className={styles.plannedDates}>{plannedDates}</Text>
      <If
        if={isApplePayGuestUser}
        then={Text}
        else={OrderedProductImages}
        className="blockText"
        content={applePay.emailDeclaration}
        shipments={shipments}
      />
    </Container>
  );
};

const { string, array, object, bool } = PropTypes;

OrderItemsSummary.propTypes = {
  orderNo: string,
  plannedDates: string,
  shipments: array,
  payAtStore: bool,
  isApplePayGuestUser: bool,
};

OrderItemsSummary.contextTypes = {
  i18n: object,
};

export default OrderItemsSummary;
