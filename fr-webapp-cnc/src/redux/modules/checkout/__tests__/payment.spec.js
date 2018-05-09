import expect from 'expect';
import { SET_METHOD_PAYMENT_SUCCESS } from '../payment/actions';
import paymentMethodReducer from '../payment/reducer';

describe('redux/modules/checkout/payment', () => {
  const paymentMethodDetail = {
    billingAddress: {},
    creditCard: {
      isSaveThisCard: true,
    },
    isEditAddress: false,
    paymentMethod: '',
    uniqloStore: {},
  };

  it('should set payment method', () => {
    expect(
      paymentMethodReducer({
        paymentMethod: 'Gift Card',
      }, {
        type: SET_METHOD_PAYMENT_SUCCESS,
        result: paymentMethodDetail,
      })
    ).toEqual({
      paymentMethod: 'Gift Card',
    });
  });
});
