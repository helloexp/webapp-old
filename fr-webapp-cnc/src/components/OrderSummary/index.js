import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Container from 'components/uniqlo-ui/core/Container';
import If from 'components/uniqlo-ui/If';
import * as orderSummarySelector from 'redux/modules/checkout/order/selectors';
import stylePropsParser from 'components/uniqlo-ui/helpers/utils/stylePropParser';
import Panel from 'components/Panel';
import Item from './Item';
import styles from './styles.scss';

const { bool, object, string, func, number } = PropTypes;

const PriceItem = ({
  rootClassName,
  descriptionText,
  price,
  priceClass,
}) => (
  <Item
    className={rootClassName}
    description={descriptionText}
    descriptionClass={styles.itemFlex}
    price={price}
    priceClass={priceClass}
  />
);

PriceItem.propTypes = {
  rootClassName: string,
  descriptionText: string,
  descriptionClass: string,
  price: number,
  priceClass: string,
};

@connect(
  (state, props) => {
    const {
      additionalCharges = {},
      correctionFee,
      shippingCost,
      settlementFee,
    } = orderSummarySelector.getOrderSummary(state, props);

    return {
      consumptionTax: additionalCharges.consumptionTax,
      correctionFee,
      giftCardPayment: orderSummarySelector.getGiftCardPayment(state, props),
      giftFee: orderSummarySelector.getGiftFee(state, props),
      orderCoupon: orderSummarySelector.getOrderCoupon(state, props),
      orderTotal: orderSummarySelector.getOrderTotal(state, props),
      serviceAmount: additionalCharges.serviceAmount,
      shippingCost,
      settlementFee,
      totalAmount: orderSummarySelector.getTotalAmount(state, props),
    };
  },
)
export default class OrderSummary extends PureComponent {
  static propTypes = {
    bottomTileClassName: string,
    className: string,
    collapsedClassName: string,
    title: string,
    splitSummary: bool,
    fromConfirm: bool,

    // part of additional charges coming from selectors
    consumptionTax: number,

    // coming from orderSummary selectors
    correctionFee: number,
    settlementFee: number,

    // flag that determines to take order summary data from state.cart or state.order
    // this is used by orderSummary selectors
    fromCart: bool,
    fromCheckout: bool,
    fromMinibag: bool,

    // get giftcard payment amount if order summary not from cart
    giftCardPayment: number,

    // total gift fee from selectors based on values of gift fee and message card
    giftFee: number,

    // header class name
    headerStyle: string,
    fromOrder: bool,

    // on toggle edit passed from MiniBag
    onToggle: func,

    // coupon amount from order selectors
    orderCoupon: number,

    // total merchandise from selectors
    orderTotal: number,

    // part of additional charges coming from selectors
    serviceAmount: number,

    // order shipping fee coming from order selectors
    shippingCost: number,

    // allow or disable editing
    toggleable: bool,

    // total payment amount from order selectors
    defaultState: string,
    totalAmount: number,

    // total items in cart from cart selectors
    totalItems: number,

    // In cart page show gift_fee only if gift option is selected.
    giftingSelected: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  static defaultProps = {
    bottomTileClassName: '',
    giftingSelected: true,
  };

  render() {
    const { cart, orderSummary } = this.context.i18n;
    const {
      bottomTileClassName,
      className,
      collapsedClassName,
      consumptionTax,
      correctionFee,
      defaultState,
      fromOrder,
      fromCart,
      giftCardPayment,
      giftFee,
      headerStyle,
      onToggle,
      orderCoupon,
      orderTotal,
      serviceAmount,
      shippingCost,
      settlementFee,
      toggleable,
      totalAmount,
      giftingSelected,
      title,
      splitSummary,
      fromConfirm,
    } = this.props;

    let containerClass = `${styles.orderSummaryContainer} `;

    containerClass += className ? stylePropsParser(className, styles).join(' ') : '';

    return (
      <Container className={containerClass}>
        <Panel
          className={styles.orderSummaryPanel}
          {...{ collapsedClassName, defaultState, headerStyle, fromOrder, onToggle, toggleable }}
          title={title || cart.orderSummary}
          analyticsOn="Button Click"
          analyticsCategory="Checkout Funnel"
          analyticsLabel="Order Detail"
        >
          <If
            descriptionText={orderSummary.totalMerchandise}
            if={orderTotal}
            price={orderTotal}
            rootClassName={classNames({
              [styles.itemLargeSpacing]: className === 'reviewOrder',
              [styles.itemSpacing]: className !== 'reviewOrder',
              [styles.itemSmallSpacing]: fromOrder,
              [styles.itemExtraSmallSpacing]: fromCart || splitSummary || fromConfirm,
            })}
            then={PriceItem}
          />
          <If
            descriptionText={orderSummary.giftFee}
            if={giftFee && giftingSelected}
            price={giftFee}
            rootClassName={classNames(styles.itemSpacing, {
              [styles.itemSmallSpacing]: fromOrder,
              [styles.itemExtraSmallSpacing]: fromCart || fromConfirm,
            })}
            then={PriceItem}
          />
          <If
            descriptionText={orderSummary.correctionFee}
            if={correctionFee}
            price={correctionFee}
            rootClassName={classNames(styles.itemSpacing, {
              [styles.itemSmallSpacing]: fromOrder,
              [styles.itemExtraSmallSpacing]: fromCart || fromConfirm,
            })}
            then={PriceItem}
          />
          <If
            descriptionText={orderSummary.coupon}
            if={orderCoupon}
            price={orderCoupon}
            priceClass="priceDeduction"
            rootClassName={classNames(styles.itemSpacing, {
              [styles.itemExtraSmallSpacing]: fromCart || fromConfirm,
            })}
            then={PriceItem}
          />
          <If
            descriptionText={orderSummary.settlementFee}
            if={settlementFee}
            price={settlementFee}
            rootClassName={classNames(styles.itemSpacing, {
              [styles.itemExtraSmallSpacing]: fromCart || fromConfirm,
            })}
            then={PriceItem}
          />
          <Item
            description={orderSummary.shippingCost}
            descriptionClass={styles.itemFlex}
            price={shippingCost}
          />
          <If
            descriptionText={orderSummary.consumptionTax}
            if={consumptionTax}
            price={consumptionTax}
            rootClassName={classNames(styles.itemSpacing, styles.topItemSpacing, {
              [styles.itemSmallSpacing]: fromOrder,
              [styles.itemExtraSmallSpacing]: fromCart || fromConfirm || className === 'reviewOrder',
              [styles.topExtraSmallSpacing]: fromCart || fromConfirm || className === 'reviewOrder',
              [styles.topBorder]: !splitSummary,
              [styles.lightTopBorder]: splitSummary,
            })}
            then={PriceItem}
          />
          <If
            descriptionText={orderSummary.serviceAmount}
            if={serviceAmount}
            price={serviceAmount}
            priceClass="priceDeduction"
            rootClassName={classNames({ [styles.itemExtraSmallSpacing]: fromCart || fromConfirm })}
            then={PriceItem}
          />
          <If
            descriptionText={orderSummary.giftCardPayment}
            if={giftCardPayment}
            price={giftCardPayment}
            priceClass="priceDeduction"
            rootClassName={classNames('topLine', styles.itemSpacing, styles.topItemSpacing, {
              [styles.bottomBorder]: className === 'reviewOrder',
              [styles.itemSmallSpacing]: fromOrder,
            })}
            then={PriceItem}
          />
        </Panel>
        <Item
          className={classNames(styles.itemSpacing, styles.totalItemSpacing, bottomTileClassName, {
            [styles.totalPriceItem]: fromOrder,
            [styles.reviewOrder]: className === 'reviewOrder',
            [styles.itemSmallSpacing]: fromOrder,
          })}
          description={orderSummary.totalAmount}
          descriptionClass={classNames(styles.totalItemFlex, {
            [styles.cartTotalLblFont]: fromCart || splitSummary || fromConfirm,
          })}
          price={totalAmount}
          priceClass={styles.totalItemPrice}
          isTotalPrice
        />
      </Container>
    );
  }
}
