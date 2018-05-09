import expect from 'expect';
import {
  SET_CREDIT_CARD_FIELD_SUCCESS,
} from '../creditCard/actions';
import creditCard from '../creditCard/reducer';

describe('redux/modules/checkout/payment/creditCard', () => {
  it('should set creditCard', () => {
    expect(
      creditCard({
        cvv: '222',
        ccLastFourDigits: 2222,
      }, {
        type: SET_CREDIT_CARD_FIELD_SUCCESS,
      })
    ).toMatch({ ccLastFourDigits: 2222, cvv: '222' });
  });
});
