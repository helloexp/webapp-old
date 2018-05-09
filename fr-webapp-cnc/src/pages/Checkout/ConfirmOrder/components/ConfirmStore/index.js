import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import classNames from 'classnames';
import { truncate } from 'utils/format';
import { getCurrentDay, getPayAtStoreTime } from 'utils/formatDate';
import styles from './styles.scss';

const blankImage = require('./image/index.gif');

const orderNumberClass = classNames('blockText', styles.storeNumberSpacing);
const onlineOrderClass = classNames('blockText', styles.onlineNumberSpacing);

const ConfirmStore = (props, context) => {
  const { orderConfirmation } = context.i18n;
  const {
    barcodeInfo,
    storeDetail,
    orderNo,
   } = props;
  const currentDay = getCurrentDay();
  const orderTimeLimit = barcodeInfo && barcodeInfo.orderTimeLimit ? getPayAtStoreTime(barcodeInfo.orderTimeLimit) : '';
  const base64 = barcodeInfo !== null
    ? `data: ${barcodeInfo.barcodeImage.contentType};base64,${barcodeInfo.barcodeImage.content}`
    : blankImage;
  const requiredStoreDetails = [
    `${orderConfirmation.paymentStore}: ${storeDetail.name}`,
    `${orderConfirmation.todayHours}: ${truncate(storeDetail[currentDay].open)}AM～${truncate(storeDetail[currentDay].close)}PM`,
    `${orderConfirmation.holidayHours}: ${truncate(storeDetail.weekendOpen)}AM～${truncate(storeDetail.weekendClose)}PM`,
  ];
  const detailsDisplay = requiredStoreDetails.map((value, index) => <Text className="blockText" key={index}>{value}</Text>);
  const payAtStoreSubTitles = orderConfirmation.payAtStoreSubTitle.map((value, index) => <Text className={styles.subTitle} key={index}>{value}</Text>);
  const barcodeNumberText = barcodeInfo
    ? <Text className={styles.barcodeInfo}>{barcodeInfo.barcodeNumber}</Text>
    : null;

  return (
    <Container>
      <Heading
        className={styles.confirmationTitle}
        headingText={orderConfirmation.orderCompletion}
        type="h3"
      />
      <Container className={styles.orderConfirmWrap}>
        <Heading
          className={styles.payAtStoreTitle}
          headingText={orderConfirmation.payAtStoreTitle}
          type="h4"
        />
        <Text className={styles.expiryTime}>{orderTimeLimit}</Text>
        <Container className={styles.subTitleWrapper}>{payAtStoreSubTitles}</Container>
        <Text className={orderNumberClass}>{orderConfirmation.orderNo}: {orderNo}</Text>
        <Text className={onlineOrderClass}>{orderConfirmation.onlineOrderNo}</Text>
        {detailsDisplay}
        <Container className={styles.barcodeWrapper}>
          <Image className={styles.barCodeImg} source={base64} />
          {barcodeNumberText}
        </Container>
      </Container>
    </Container>
  );
};

const { object, string } = PropTypes;

ConfirmStore.contextTypes = {
  i18n: object,
};

ConfirmStore.propTypes = {
  barcodeInfo: object,
  storeDetail: object,
  orderNo: string,
};

export default ConfirmStore;
