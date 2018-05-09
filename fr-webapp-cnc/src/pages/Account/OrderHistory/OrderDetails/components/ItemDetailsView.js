import React, { PureComponent, PropTypes } from 'react';
import Container from 'components/uniqlo-ui/core/Container';
import Button from 'components/uniqlo-ui/Button';
import OrderSummary from 'components/OrderSummary';
import getOrderSummary from 'redux/modules/checkout/mappings/orderSummaryMappings';
import ItemCard from '../../ItemCard';
import styles from '../styles.scss';

const { func, object, array, string } = PropTypes;

export default class ItemDetailsView extends PureComponent {
  static propTypes = {
    orderItemsDetail: object,
    structuredOrderItems: array,
    onOrderCancel: func,
    orderBrand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  renderItemDetailView = () => this.props.structuredOrderItems.map((item, index) => {
    const price = `${this.context.i18n.common.currencySymbol}${item.price}`;
    const data = {
      productName: item.title,
      itemCode: item.itemCode,
      colorCode: item.colorCode,
      colorName: item.color,
      sizeCode: item.sizeCd,
      sizeName: item.size,
      productNumber: item.id,
      quantity: item.count,
      price,
      gender: item.genderName,
      alterationUnit: item.alterationUnit,
      alteration: item.modifySize,
      alterationFlag: item.alteration,
      isMultiBuy: item.isMultiBuy,
      isMultipleSkuBuy: item.isMultipleSkuBuy,
      secondItem: item.secondItem,
      is999Rule: item.is999Rule,
      promoId: item.promoId,
      promoDtlFlg: item.promoDtlFlg,
      isXYPattern: item.isXYPattern,
    };

    return <ItemCard {...data} key={index} orderBrand={this.props.orderBrand} />;
  });

  render() {
    const { props: { orderItemsDetail, onOrderCancel }, context: { i18n: { orderHistory } } } = this;

    return (
      <Container className={`${styles.orderDetailsWrapper} ${styles.removeBottomPadding}`}>
        <Container className={styles.itemCardContainer}>
          {this.renderItemDetailView()}
        </Container>
        <OrderSummary headerStyle={styles.summaryHeader} order={getOrderSummary(orderItemsDetail)} fromOrder />
        <Button
          className={styles.cancelButtonInDetails}
          disabled={orderItemsDetail.cancel_btn_view_flg !== 'Y'}
          label={orderHistory.cancelTheOrder}
          labelClass={styles.labelClass}
          onTouchTap={onOrderCancel}
        />
      </Container>
    );
  }
}
