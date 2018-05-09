import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import OrderSummary from 'components/OrderSummary';
import Panel from 'components/Panel';
import If from 'components/uniqlo-ui/If';
import Label from 'components/uniqlo-ui/Label';
import CheckBox from 'components/uniqlo-ui/core/CheckBox';
import ProxyLink from 'components/uniqlo-ui/core/ProxyLink';
import Heading from 'components/uniqlo-ui/Heading';
import Container from 'components/uniqlo-ui/core/Container';
import Item from 'components/OrderSummary/Item';
import getOrderSummary from 'redux/modules/checkout/mappings/orderSummaryMappings';
import { getAllSplitDetails, isSplitDeliverySelected, getSplitCount } from 'redux/modules/checkout/delivery/selectors';
import PlaceOrder from './components/PlaceOrder';
import styles from './styles.scss';

const { bool, object, func, string, number } = PropTypes;

const ReceiptSelector = (props, context) => {
  const { receiptRequired, toggleReceiptFlag } = props;
  const { i18n: { reviewOrder }, config: { customer } } = context;

  return (
    <div className={styles.taxWrapper}>
      <CheckBox
        checked={receiptRequired}
        className={`spaCheckBox ${styles.check}`}
        id="OrderSummarySegment"
        label={reviewOrder.tax}
        labelClass={styles.fineText}
        onCheck={toggleReceiptFlag}
        value="true"
        analyticsOn="Receipt Checkbox Toggle"
        analyticsLabel={receiptRequired ? 'Receiptoptout' : 'Receiptopton'}
        analyticsCategory="Checkout Funnel"
      />
      <ProxyLink targetwindow="_blank" linkUrl={customer.paymentInstruction}>
        <span className={styles.infoIcon} />
      </ProxyLink>
    </div>
  );
};

ReceiptSelector.propTypes = {
  receiptRequired: bool,
  toggleReceiptFlag: func,
};

ReceiptSelector.contextTypes = {
  i18n: object,
  config: object,
};

const RenderOrderSummary = (props, context) => {
  const { isSplitDeliveryApplied, splitDeliveryDetails, splitCount, orderSummary: order } = props;
  const { i18n: { cart, delivery, orderSummary } } = context;
  let totalAmount = 0;

  function renderSplitOrderSummary() {
    const orderSummaryList = [];

    for (let splitNo = 1; splitNo <= splitCount; splitNo++) {
      const orderDetails = splitDeliveryDetails[splitNo];
      const orderSummaryDetails = getOrderSummary(orderDetails);
      const orderSummaryTitle = `${delivery.shipment} ${splitNo}`;

      totalAmount += orderSummaryDetails.paymentsAmt;

      orderSummaryList.push(
        <OrderSummary
          bottomTileClassName={styles.splitPriceTile}
          className="reviewOrder"
          headerStyle={styles.titleStyle}
          key={splitNo}
          order={orderSummaryDetails}
          title={orderSummaryTitle}
          toggleable
          splitSummary
        />
      );
    }

    return orderSummaryList;
  }

  if (isSplitDeliveryApplied && Object.keys(splitDeliveryDetails).length) {
    return (
      <Container>
        <Heading headingText={cart.orderSummary} className={styles.headingStyle} type="h4" />
        {renderSplitOrderSummary()}
        <Item
          className={styles.totalPriceItem}
          descriptionClass={styles.totalLabelStyle}
          description={orderSummary.totalAmount}
          price={totalAmount}
          priceClass={styles.totalPriceStyle}
          isTotalPrice
        />
      </Container>
    );
  }

  return <OrderSummary className="reviewOrder" order={order} />;
};

RenderOrderSummary.propTypes = {
  orderSummary: object,
  splitDeliveryDetails: object,
  isSplitDeliveryApplied: bool,
  splitCount: number,
};

RenderOrderSummary.contextTypes = {
  i18n: object,
};

const OrderSummarySegment = (props, context) => {
  const {
    orderSummary,
    receiptRequired,
    processOrder,
    isOrderDisabled,
    toggleReceiptFlag,
    errorMessage,
    isReceiptVisible,
    isSplitDeliveryApplied,
    splitDeliveryDetails,
    splitCount,
  } = props;
  const {
    i18n: { reviewOrder, common: { tslTooltip: { toolTipLinkText: tlsText } } },
    config: { ABOUT_TLS_URL },
  } = context;

  return (
    <Panel frame className={styles.orderSummaryWrapper}>
      <RenderOrderSummary {...{ orderSummary, isSplitDeliveryApplied, splitDeliveryDetails, splitCount }} />
      <If
        if={isReceiptVisible}
        then={ReceiptSelector}
        {...{ toggleReceiptFlag, receiptRequired }}
      />
      <PlaceOrder
        disabled={isOrderDisabled}
        errorMessage={errorMessage}
        processOrder={processOrder}
        noPadding
      />
      <div className={styles.lockIconWrap}>
        <span className={styles.lockIcon} />
        <Label className={styles.sideTextWrap} text={reviewOrder.securityInfo} />
      </div>
      <ProxyLink linkUrl={ABOUT_TLS_URL} targetwindow="_blank" className={styles.tlsLink}>
        {tlsText}
      </ProxyLink>
    </Panel>
  );
};

OrderSummarySegment.propTypes = {
  isOrderDisabled: bool,
  receiptRequired: bool,
  isReceiptVisible: bool,
  processOrder: func,
  toggleReceiptFlag: func,
  orderSummary: object,
  errorMessage: string,
  paymentType: string,
  splitDeliveryDetails: object,
  isSplitDeliveryApplied: bool,
  splitCount: number,
};

OrderSummarySegment.contextTypes = {
  i18n: object,
  config: object,
};

function mapStateToProps(state) {
  return {
    isSplitDeliveryApplied: isSplitDeliverySelected(state),
    splitDeliveryDetails: getAllSplitDetails(state),
    splitCount: getSplitCount(state),
  };
}

export default connect(mapStateToProps)(OrderSummarySegment);
