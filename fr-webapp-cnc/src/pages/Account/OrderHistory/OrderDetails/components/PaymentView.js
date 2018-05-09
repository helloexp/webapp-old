import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { routes } from 'utils/urlPatterns';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import Text from 'components/uniqlo-ui/Text';
import AddressPanel from 'components/AddressPanel';
import StorePayment from 'pages/Checkout/components/PaymentMethodTile/StorePayment';
import { isPayAtUniqlo, getIfBarCodeIsShown } from 'redux/modules/account/orderHistory/selectors';
import { mapBillingToLocalAddress } from 'redux/modules/checkout/mappings/deliveryMappings';
import { getUrlWithQueryData } from 'utils/routing';
import { getPaymentMethodText } from '../../utils';
import styles from '../styles.scss';

const { object, bool, string } = PropTypes;

@connect(state => ({
  paymentStore: state.paymentStore.paymentStoreDetail,
  isPaymentStoreInfoAvailable: getIfBarCodeIsShown(state),
  isPayAtUQ: isPayAtUniqlo(state),
}))
export default class PaymentView extends PureComponent {
  static propTypes = {
    paymentStore: object,
    orderItemsDetail: object,
    receipt: bool,
    isPayAtUQ: bool,
    isPaymentStoreInfoAvailable: bool,
    orderBrand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { orderItemsDetail, receipt, paymentStore, isPayAtUQ, isPaymentStoreInfoAvailable, orderBrand } = this.props;
    const { orderHistory, paymentMethod } = this.context.i18n;
    const receiptText = receipt ? orderHistory.yes : orderHistory.doNot;
    const billingAddresss = mapBillingToLocalAddress(orderItemsDetail);
    const contentClass = `blockText ${styles.paymentDetails}`;
    const paymentMethodText = getPaymentMethodText(orderItemsDetail, paymentMethod, orderBrand).map((method, index) =>
      <Text className={contentClass} key={index}>{method}</Text>);

    if (isPayAtUQ && isPaymentStoreInfoAvailable) {
      const paymentLink = getUrlWithQueryData(routes.payment, { brand: this.props.orderBrand });

      return (
        <StorePayment store={paymentStore} paymentLink={paymentLink} brand={this.props.orderBrand} />
      );
    }

    return (
      <Container className={styles.orderDetailsWrapper}>
        <Heading className={styles.timeFrameHeading} headingText={orderHistory.paymentMethod} type="h4" />
        <div className={styles.paymentMethodText}>
          {paymentMethodText}
        </div>
        <Container className={styles.addLargeBottomPadding}>
          <AddressPanel
            title={orderHistory.billing}
            {...billingAddresss}
            noExtraSpacing
          />
        </Container>
        <Heading className={styles.orderDetailsHead} headingText={orderHistory.receipt} type="h4" />
        <Text className={contentClass}>{receiptText}</Text>
      </Container>);
  }
}
