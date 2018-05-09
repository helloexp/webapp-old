import expect from 'expect';
import * as selector from '../selectors';

describe('redux/modules/checkout/order/selectors', () => {
  const sampleSplitStore = {
    order: {
      orders: {
        '011711291930-32689': {
          orderDetails: {},
          orderConfirmDetails: {},
          cartGift: {},
        },
        '011711292006-32693': {},
      },
      hashKey: '',
      items: [],
    },
  };

  const sampleGroupStore = {
    order: {
      orders: {
        '011711291930-32689': {
          orderDetails: {
            payment_type: 'B',
          },
        },
      },
    },
  };

  it('should return order data from state', () => {
    expect(selector.getOrder(sampleSplitStore)).toEqual(sampleSplitStore.order);
  });

  it('should return orders data from state', () => {
    expect(selector.getOrders(sampleSplitStore)).toEqual(sampleSplitStore.order.orders);
  });

  it('should return hashKey data from state', () => {
    expect(selector.getHashKey(sampleSplitStore)).toEqual(sampleSplitStore.order.hashKey);
  });

  it('should return the first ordered item', () => {
    expect(selector.getFirstOrder(sampleSplitStore)).toEqual(sampleSplitStore.order.orders['011711291930-32689']);
  });

  it('should return the order details for the first ordered item', () => {
    const expectedResult = sampleSplitStore.order.orders['011711291930-32689'].orderDetails;

    expect(selector.getFirstOrderDetails(sampleSplitStore)).toEqual(expectedResult);
  });

  it('should return the order details for the first ordered item from props', () => {
    const props = { orderConfirmDetails: {} };
    const expectedResult = props.orderConfirmDetails;

    expect(selector.getOrderDetails(sampleSplitStore, props)).toEqual(expectedResult);
  });

  it('should return the order details for the first ordered item from state', () => {
    const props = {};
    const expectedResult = sampleSplitStore.order.orders['011711291930-32689'].orderConfirmDetails;

    expect(selector.getOrderDetails(sampleSplitStore, props)).toEqual(expectedResult);
  });

  it('should return cart gift for the first ordered item', () => {
    const expectedResult = sampleSplitStore.order.orders['011711291930-32689'].cartGift;

    expect(selector.getCartGiftFromOrder(sampleSplitStore)).toEqual(expectedResult);
  });

  it('should return true for split order', () => {
    expect(selector.isSplitOrder(sampleSplitStore)).toEqual(true);
  });

  it('should return false for group order', () => {
    expect(selector.isSplitOrder(sampleGroupStore)).toEqual(false);
  });

  it('should return false for split delivery', () => {
    expect(selector.isUniqloStorePayment(sampleSplitStore)).toEqual(false);
  });

  it('should return true if store payment is selected for group delivery', () => {
    expect(selector.isUniqloStorePayment(sampleGroupStore)).toEqual(true);
  });
});
