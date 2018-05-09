import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import { truncate } from 'utils/format';
import { getCurrentDay } from 'utils/formatDate';
import styles from './styles.scss';

const { object, string } = PropTypes;

const PayAtStoreDetails = ({ storeDetail, brand }, { i18n: { orderConfirmation, paymentMethod } }) => {
  const currentDay = getCurrentDay();

  return (
    <Container className={styles.paymentMethod}>
      <Heading
        className={styles.titleSpacing}
        headingText={orderConfirmation.paymentMethod}
        type="h4"
      />
      <Text className="blockText">
        {paymentMethod.payAtStore[brand]}
      </Text>
      <Text className="blockText">
        {storeDetail.name}
      </Text>
      <Text className="blockText">
        {storeDetail.address} {storeDetail.building}
      </Text>
      <Text className="blockText">
        {orderConfirmation.todayHours}: {`${truncate(storeDetail[currentDay].open)}AM～${truncate(storeDetail[currentDay].close)}PM`}
      </Text>
      <Text className="blockText">
        {orderConfirmation.holidayHours}: {`${truncate(storeDetail.weekendOpen)}AM～${truncate(storeDetail.weekendClose)}PM`}
      </Text>
      <Text className="blockText">
        {storeDetail.openHours}
      </Text>
    </Container>
  );
};

PayAtStoreDetails.propTypes = {
  orderConfirmation: object,
  storeDetail: object,
  brand: string,
};

PayAtStoreDetails.contextTypes = {
  i18n: object,
};

export default PayAtStoreDetails;
