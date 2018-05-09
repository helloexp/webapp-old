import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Link from 'components/uniqlo-ui/Link';
import If from 'components/uniqlo-ui/If';
import Container from 'components/uniqlo-ui/core/Container';
import Grid from 'components/uniqlo-ui/core/Grid';
import GridCell from 'components/uniqlo-ui/core/GridCell';
import Heading from 'components/uniqlo-ui/Heading';
import ErrorHandler from 'containers/ErrorHandler';
import ErrorMessage from 'components/ErrorMessage';
import classNames from 'classnames';
import * as orderHistoryActions from 'redux/modules/account/orderHistory';
import { getDeliveryDatesFromSelectable } from 'redux/modules/account/orderHistory/selectors';
import { saveRedirectUrl } from 'redux/modules/account/auth';
import { getDateFromValue } from 'utils/formatDate';
import { scrollToTop } from 'utils/scroll';
import { redirect } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { getStatusValue, getPlannedDeliveryDate, getUniqueStatus } from './utils';
import styles from './styles.scss';
import OrderDataTile from './OrderDataTile';

const { object, array, func, number, string } = PropTypes;

function onGoBack() {
  redirect(routes.memberInfo);
}

function getFormattedDate(date) {
  return date ? getDateFromValue(date.substring(0, 8)) : '';
}

function getSortedList(orderHistoryList) {
  return orderHistoryList.sort((item1, item2) => item2.orderReceiptDate - item1.orderReceiptDate);
}

const OrderTileWithFooter = ({ onCancelOrder, orderDetails }, { i18n: { orderHistory } }) => {
  const { isCancelButtonVisible, orderNumber, lastOrder } = orderDetails.item;
  const cancelButtonState = isCancelButtonVisible ? {} : { disabled: true };
  const footerClass = classNames(styles.footer, { [styles.lastOrder]: lastOrder });
  const onDetailsPress = () => redirect(`${routes.orderDetails}/${orderNumber}`);

  return (
    <Container className={styles.orderTileWrapper}>
      <OrderDataTile orderData={orderDetails} orderNumber={orderNumber} />
      <Grid cellPadding={0} className={footerClass}>
        <GridCell colSpan={6}>
          <Button
            className={`default small ${styles.footerBtn}`}
            label={orderHistory.cancel}
            labelClass={classNames(styles.labelStyle, {
              [styles.disabledBtn]: !isCancelButtonVisible,
            })}
            onTouchTap={() => onCancelOrder(orderDetails)}
            {...cancelButtonState}
          />
        </GridCell>
        <GridCell colSpan={6}>
          <Button
            className={`default small ${styles.footerBtn}`}
            label={orderHistory.detail}
            labelClass={styles.labelStyle}
            onTouchTap={onDetailsPress}
          />
        </GridCell>
      </Grid>
    </Container>
  );
};

OrderTileWithFooter.propTypes = {
  onCancelOrder: func,
  orderDetails: object,
};

OrderTileWithFooter.contextTypes = {
  i18n: object,
};

const OrderHistoryInfo = (props, { i18n: { orderHistory }, config: { deliveryMethodDetailsLink } }) => (
  <Container className={styles.infoContentWrap}>
    <Text className={`blockText ${styles.infoContent}`}>{orderHistory.orderCancelInfo}</Text>
    <Text className={`blockText ${styles.infoContent}`}>{orderHistory.orderStatusInfo}</Text>
    <Text className={styles.infoContent}>{orderHistory.afterShippimentInfo}</Text>
    <Link className={styles.infoLink} to={deliveryMethodDetailsLink} >{orderHistory.here}</Link>
  </Container>
);

OrderHistoryInfo.contextTypes = {
  i18n: object,
  config: object,
};

@asyncConnect([{ promise: orderHistoryActions.initializeOrderHistoryPage }])
@connect(state => ({
  ...state.orderHistory,
  routing: state.routing,
  deliverySelectableDates: getDeliveryDatesFromSelectable(state),
}), {
  ...orderHistoryActions,
  saveRedirectUrl,
})
@ErrorHandler(['getOrderDetails', 'orderDetailsDisplay'])
export default class OrderHistory extends Component {
  static propTypes = {
    confirmedOrderNumber: string,
    getOrder: func,
    orderCount: number,
    orderHistoryList: array,
    routing: object,
    saveRedirectUrl: func,
    error: string,
    deliverySelectableDates: object,
    loadOrderHistoryAndDeliveryMethods: func,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    listPageNumber: 1,
    loadMore: true,
  };

  componentDidMount() {
    scrollToTop(document.body, 0, 0);
  }

  onViewMore = () => {
    this.setState({ listPageNumber: this.state.listPageNumber + 1 }, () =>
      this.props.loadOrderHistoryAndDeliveryMethods(this.state.listPageNumber));
  };

  onCancelOrder = ({ item: { orderNumber } }) => {
    this.props.saveRedirectUrl(routes.orderHistory);
    redirect(`${routes.orderCancel}/${orderNumber}`);
  };

  onOrderDetailDisplay = (item) => {
    const { i18n } = this.context;

    return {
      formatedOrderDate: getFormattedDate(item.orderReceiptDate),
      statusValue: getStatusValue(item, i18n.orderHistory),
      plannedDeliveryDate: getPlannedDeliveryDate(item, i18n, this.props.deliverySelectableDates),
      uniqueStatus: getUniqueStatus(item),
      item,
    };
  };

  render() {
    const { onCancelOrder, props: { orderHistoryList, orderCount, error }, context: { i18n: { orderHistory } } } = this;
    const sortedOrderList = getSortedList(orderHistoryList);
    const sortedOrderLength = sortedOrderList.length;
    const orderCountRemains = orderCount - sortedOrderLength;
    const orderPerPage = sortedOrderLength > orderCount ? orderCount : sortedOrderLength;
    const listHeading = `${orderCount}${orderHistory.during}${orderPerPage}${orderHistory.perPage}`;
    const infoWrapperClass = classNames(styles.topInfoWrapper, { [styles.removeBorder]: sortedOrderLength > 0 });
    const containerClass = classNames('z3', styles.listWrapper, { [styles.noViewmore]: orderCountRemains === 0 });

    const orderList = sortedOrderList.map((item, index) => {
      item.lastOrder = index === (sortedOrderLength - 1);

      return (
        <OrderTileWithFooter
          key={index}
          onCancelOrder={onCancelOrder}
          orderDetails={this.onOrderDetailDisplay(item)}
        />
      );
    });

    const orderListView = sortedOrderLength > 0
      ? (<Container className={styles.orderListContainer}>
        <Heading className={styles.orderListHeader} headingText={listHeading} type="h4" />
        <Container className={containerClass}>
          {orderList}
          <Container className={styles.buttonContainer}>
            <If
              if={orderCountRemains > 0}
              then={Button}
              className={`default medium ${styles.caretDown}`}
              label={orderHistory.loadMore}
              labelClass={styles.labelStyle}
              onTouchTap={this.onViewMore}
            />
          </Container>
        </Container>
      </Container>)
      : null;

    return (
      <Container className={styles.orderHistory}>
        <If
          if={error}
          then={ErrorMessage}
          message={error}
          rootClassName="cartPageError"
        />
        <Container className={infoWrapperClass}>
          <Heading
            className={styles.infoHeader}
            headingText={orderHistory.orderHistoryList}
            type="h4"
          />
          <If if={sortedOrderLength} then={OrderHistoryInfo} />
        </Container>
        <If if={!sortedOrderLength} then={Text} className={styles.noOrders}>{orderHistory.noOrderDescription}</If>
        {orderListView}
        <Container className={styles.backButtonWrapper}>
          <Button
            className={`default medium boldWithBorder ${styles.backButtonFromOrder}`}
            label={orderHistory.backToMemberInfo}
            labelClass={styles.backToAccountLabel}
            onTouchTap={onGoBack}
          />
        </Container>
      </Container>
    );
  }
}
