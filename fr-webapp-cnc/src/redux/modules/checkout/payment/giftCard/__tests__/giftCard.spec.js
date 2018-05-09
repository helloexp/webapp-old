import expect from 'expect';
import { LOAD_GIFT_CARD_SUCCESS } from '../actions';
import giftCard from '../reducer';

describe('redux/modules/checkout/payment/giftCard', () => {
  it('should set giftCard value', () => {
    expect(
      giftCard(undefined, {
        type: LOAD_GIFT_CARD_SUCCESS,
        result: {
          card_info_list: [
            { request_no: '1', visible_giftcard_no: 4444, balance: 2500, payment_amt: '100' },
            { request_no: '2', visible_giftcard_no: 5555, balance: 3200, payment_amt: '500' },
          ],
        },
      })
    ).toMatch({ giftCards: [
      { balance: 2500, expires: undefined, index: 0, number: 4444, payment: 100, requestNumber: '1' },
      { balance: 3200, expires: undefined, index: 1, number: 5555, payment: 500, requestNumber: '2' },
    ],
    });
  });
});
