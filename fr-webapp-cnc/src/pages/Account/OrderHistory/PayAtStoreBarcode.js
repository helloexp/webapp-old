import React, { PropTypes } from 'react';
import { getCurrentDay, getPayAtStoreTime } from 'utils/formatDate';
import { truncate } from 'utils/format';
import Image from 'components/uniqlo-ui/Image';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import styles from './PayAtStoreBarcode.scss';

const PayAtStoreBarcode = ({ barcodeInfo, storeDetail }, context) => {
  const { orderConfirmation, orderHistory } = context.i18n;
  const currentDay = getCurrentDay();
  const base64 = barcodeInfo !== null && `data: ${barcodeInfo.barcodeImage.contentType};base64,${barcodeInfo.barcodeImage.content}`;
  const requiredStoreDetails = [
    `${orderHistory.storeName}: ${storeDetail.name}`,
    `${orderConfirmation.todayHours}: ${truncate(storeDetail[currentDay].open)}AM～${truncate(storeDetail[currentDay].close)}PM`,
    `${orderConfirmation.holidayHours}: ${truncate(storeDetail.weekendOpen)}AM～${truncate(storeDetail.weekendClose)}PM`,
  ];
  const detailsDisplay = requiredStoreDetails.map((value, index) => <Text className={styles.detailsValues} key={index}>{value}</Text>);
  const orderTimeLimit = barcodeInfo && barcodeInfo.orderTimeLimit;
  const payAtStoreTime = getPayAtStoreTime(orderTimeLimit);

  return (
    <Container className={styles.storeHeaderWrapper}>
      <Text className={styles.onlineNumberSpacing}>{orderConfirmation.onlineOrderNo}</Text>
      <Text className={styles.payAtStoreTitle}>{orderConfirmation.payAtStoreTitle}</Text>
      <Text className={styles.dateHeading}>{payAtStoreTime}</Text>
      {detailsDisplay}
      <Container className={styles.barcodeWrapper}>
        <Image className={styles.barCodeImg} source={base64} />
        <Text className={styles.barcodeInfo}>{barcodeInfo.barcodeNumber}</Text>
      </Container>
    </Container>
  );
};

const { object } = PropTypes;

PayAtStoreBarcode.propTypes = {
  barcodeInfo: object,
  storeDetail: object,
  orderHistory: object,
};

PayAtStoreBarcode.contextTypes = {
  i18n: object,
};

export default PayAtStoreBarcode;
