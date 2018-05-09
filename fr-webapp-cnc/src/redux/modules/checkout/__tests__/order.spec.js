import expect from 'expect';
import getOrderSummary, { getOrderMapping } from 'redux/modules/checkout/mappings/orderSummaryMappings.js';
import deliveryReducer from '../order';
import { FETCH_ORDER_SUMMARY_SUCCESS } from '../order/actions';

describe('redux/modules/order', () => {
  const initialState = {
    orderProcessed: false,
    orderSummary: {},
    deliveryArrivesAt: {},
    orderDetailList: {},
    details: {},
    difference: {
      currentTotal: null,
      delta: null,
    },
    isRegistrationSuccess: false,
    lsSiteId: null,
    lsTimeEntered: null,
    caSiteId: null,
    caTimeEntered: null,
    orders: {},
    hideRegistrationError: true,
  };

  const item = {
    additionalCharges:
    {
      consumptionTax: '¥ 250',
      serviceAmount: '-¥ 2',
    },
    totalMerchandise: '¥ 1000',
    giftFee: '¥ 150',
    correctionFee: '¥ 350',
    coupon: '¥ 40',
    shippingCost: '¥ 50',
    giftCardPayment: '-¥ 4000',
    total: '¥ 5000',
    cancelTargetFlag: true,
  };

  it('should return the initial state', () => {
    expect(
      deliveryReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should fetch order summary details', () => {
    expect(
      deliveryReducer({}, {
        type: FETCH_ORDER_SUMMARY_SUCCESS,
        result: getOrderSummary(item),
      })
    ).toEqual({
      ...getOrderMapping(item),
      orderSummary: getOrderSummary(item),
    });
  });
});
