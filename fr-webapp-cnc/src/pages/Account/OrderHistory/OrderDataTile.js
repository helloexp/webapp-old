import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import Link from 'components/uniqlo-ui/Link';
import Text from 'components/uniqlo-ui/Text';
import { getPayAtStoreTime } from 'utils/formatDate';
import If from 'components/uniqlo-ui/If';
import castArray from 'utils/castArray';
import styles from './orderDataTile.scss';

const { object, string, bool, array } = PropTypes;

const UniqueStatus = (props, { i18n: { orderHistory } }) => {
  const { uniqueStatusLabel, uniqueStatusLinks, uniqueStatusTexts, statusLinkClass, wrapperClass, showBarcodeLink, underlineLink } = props;
  const uniqueStatus = uniqueStatusTexts.map((uniqueStatusText, index) => {
    const barcodeLabelLink = uniqueStatusLinks ? uniqueStatusLinks[index] : '';
    const statusLink = !showBarcodeLink ? barcodeLabelLink : '';

    return (<div className={wrapperClass} key={index}>
      <Link className={classnames(statusLinkClass, { [styles.linkWithUnderline]: !!statusLink && underlineLink })} to={statusLink}>
        {uniqueStatusText}
      </Link>
      <If
        if={showBarcodeLink}
        then={Link}
        className={classnames(styles.barcodeLink, statusLinkClass, { [styles.linkWithUnderline]: !!barcodeLabelLink })}
        to={barcodeLabelLink}
      >
        {orderHistory.lawsonBarcodeLink}
      </If>
    </div>);
  });

  return (
    <div className={styles.statusLinkContainer}>
      <Text className={`blockText ${styles.uniqueStatusLabel}`}>{`${uniqueStatusLabel}:`}</Text>
      {uniqueStatus}
    </div>
  );
};

UniqueStatus.propTypes = {
  uniqueStatusLabel: string,
  uniqueStatusLinks: array,
  uniqueStatusTexts: array,
  statusLinkClass: string,
  wrapperClass: string,
  showBarcodeLink: bool,
  underlineLink: bool,
};

UniqueStatus.contextTypes = {
  i18n: object,
};

const OrderDataTile = (props, context) => {
  const {
    hideUniqueStatus,
    showBarcodeLink,
    orderNumber,
    orderData: {
      isMultiDelivery,
      formatedOrderDate,
      uniqueStatus,
      plannedDeliveryDate,
      statusValue,
    },
    barcodeInfo,
  } = props;
  const { orderHistory } = context.i18n;
  const {
    uniqueStatusLabel1,
    uniqueStatusLinks1,
    uniqueStatusTexts1,
    uniqueStatusLabel2,
    uniqueStatusLinks2,
    uniqueStatusTexts2,
  } = uniqueStatus || {};

  const plannedDate = castArray(plannedDeliveryDate);
  const orderDetail = [
    `${orderHistory.orderNumber}: ${orderNumber || ''}`,
    `${orderHistory.purchaseType}: ${orderHistory.online}`,
    ...plannedDate,
    `${orderHistory.orderStatus}: ${statusValue || ''}`,
  ];
  const payAtStoreTime = barcodeInfo && barcodeInfo.orderTimeLimit ? getPayAtStoreTime(barcodeInfo.orderTimeLimit) : '';

  return (
    <Container>
      <Heading className={styles.orderTile} headingText={formatedOrderDate} type="h4" />
      {orderDetail.map((value, indexValue) => <Text className={`blockText ${styles.plannedDateText}`} key={indexValue} >{value}</Text>)}
      <If
        if={uniqueStatusLabel1 && !hideUniqueStatus}
        then={UniqueStatus}
        uniqueStatusLabel={uniqueStatusLabel1}
        uniqueStatusLinks={uniqueStatusLinks1}
        uniqueStatusTexts={uniqueStatusTexts1}
        statusLinkClass={styles.statusFirstLink}
      />
      <If
        if={uniqueStatusLabel2 && !hideUniqueStatus}
        then={UniqueStatus}
        uniqueStatusLabel={uniqueStatusLabel2}
        uniqueStatusLinks={uniqueStatusLinks2}
        uniqueStatusTexts={uniqueStatusTexts2}
        statusLinkClass={styles.statusLink}
        wrapperClass={classnames({ [styles.fullWidthWrapper]: isMultiDelivery })}
        showBarcodeLink={showBarcodeLink}
        underlineLink
      />
      <If
        if={barcodeInfo}
        then={Text}
        content={`${orderHistory.deadline}: ${payAtStoreTime}`}
        className={`blockText ${styles.plannedDateText}`}
      />
    </Container>
  );
};

OrderDataTile.propTypes = {
  orderData: object,
  orderNumber: string,
  hideUniqueStatus: bool,
  showBarcodeLink: bool,
  barcodeInfo: object,
};

OrderDataTile.contextTypes = {
  i18n: object,
  config: object,
};

export default OrderDataTile;
