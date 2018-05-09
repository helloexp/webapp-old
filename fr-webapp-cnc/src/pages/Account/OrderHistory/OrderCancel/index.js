import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import Drawer from 'components/Drawer';
import If from 'components/uniqlo-ui/If';
import ErrorMessage from 'components/ErrorMessage';
import ErrorHandler from 'containers/ErrorHandler';
import { cancelOrderAndClearDetails, initializeCancelPage, getOrderItemDetails } from 'redux/modules/account/orderHistory';
import { getDeliveryDatesFromSelectable } from 'redux/modules/account/orderHistory/selectors';
import { redirect } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import cx from 'classnames';
import OrderDataTile from '../OrderDataTile';
import { getOrderData } from '../utils';
import styles from './styles.scss';

const { func, object, string } = PropTypes;

@asyncConnect([{ promise: initializeCancelPage }])
@connect((state, { params: { id } }) => ({
  item: getOrderItemDetails(state, id),
  url: state.auth.redirectUrl,
  deliverySelectableDates: getDeliveryDatesFromSelectable(state),
}), { cancelOrder: cancelOrderAndClearDetails })
@ErrorHandler(['deleteOrder'])
export default class OrderCancel extends Component {
  static propTypes = {
    cancelOrder: func,
    item: object,
    url: string,
    deliverySelectableDates: object,

    // from errorHandler HOC
    error: string,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    isCancelComplete: false,
  };

  onBackToMember = () => redirect(routes.memberInfo);

  onCloseCancel = () => redirect(this.props.url);

  onCancelConfirmed = () => {
    const { cancelOrder: cancel, item } = this.props;

    return cancel(item).then(() => {
      this.setState({ isCancelComplete: true });
    });
  };

  render() {
    const i18n = this.context.i18n;
    const { orderHistory } = i18n;
    const { item, deliverySelectableDates, error } = this.props;
    const orderNumber = item.orderNumber;
    const orderData = getOrderData(item, i18n, deliverySelectableDates);

    if (this.state.isCancelComplete) {
      const infoTexts = [
        `${orderHistory.orderNumber}: ${orderNumber}`,
        `${orderHistory.purchaseType}: ${orderHistory.online}`,
      ].map((value, index) => <Text className={cx('blockText', styles.textValues)} key={index}>{value}</Text>);

      return (
        <Container className={styles.completionWrapper}>
          <Heading className={styles.cancelHeading} headingText={orderHistory.completionHeader} type="h4" />
          <Container className={styles.noListContainer} >
            <Text className={cx('blockText', styles.cancelDetailHead)}>{orderHistory.cancelCompletionInfo}</Text>
            <Heading className={styles.orderDate} headingText={orderData.formatedOrderDate} type="h4" />
            {infoTexts}
          </Container>
          <Container className={styles.backButtonWrapper}>
            <Button
              className={`default medium boldWithBorder ${styles.backButtonFromOrder}`}
              label={orderHistory.backToMemberInfo}
              onTouchTap={this.onBackToMember}
            />
          </Container>
        </Container>
      );
    }

    return (
      <Drawer
        className={styles.cancelOrder}
        onCancel={this.onCloseCancel}
        title={orderHistory.cancelationTitle}
        bodyClass={styles.cancelBody}
        variation="noFooter"
        noMargin
      >
        <If
          if={error}
          isCustomError
          message={error}
          rootClassName="orderPageError"
          then={ErrorMessage}
        />
        <Text className={styles.cancelationInfo} >{orderHistory.cancelationQuestion}</Text>
        <OrderDataTile hideUniqueStatus orderData={orderData} orderNumber={orderNumber} />
        <Button
          className={`secondary medium ${styles.cancelOrderButton}`}
          label={orderHistory.cancelTheOrder}
          onTouchTap={this.onCancelConfirmed}
          analyticsOn="Click"
          analyticsLabel="Cancel order"
          analyticsCategory="Member Info"
        />
        <Text className={styles.quitText} onPress={this.onCloseCancel} >{orderHistory.quit}</Text>
      </Drawer>
    );
  }
}
