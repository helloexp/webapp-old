import expect from 'expect';
import reducer, {
  ORDER_HISTORY_LOAD_SUCCESS,
} from '../orderHistory';
import { mapOrderHistory } from '../mappings/orderHistoryMappings';

describe('redux/modules/account/orderHistory', () => {
  const addressesResponse = {
    order_history_inf_list: [
      {
        delv_type: '5',
        ord_receipt_date: '20160817132709',
        ord_no: '011608171327-61255',
        ord_sts: '020',
        payment_req_id: '',
        disp_store_recev_stts: '0',
        hash_key: '44e76c7f0c38e9a1a1c1ceb8df3470c21dd885ba5547ee6886f22878bbc9532f',
        cancel_btn_view_flg: 'Y',
        upd_date: '20160817132709',
        delv_slip_no: '1',
        delv_trader_no: '1',
        store_receipt_date: '20160817132709',
        recev_expire_date: '20160817132709',
        recev_possible_date: '20160817132709',
        mwm_shipping_info_list: [
          {
            shipping_no: '1',
            planned_delivery_date_from: '20160909',
            planned_delivery_date_to: '20160909',
          },
        ],
      },
      {
        delv_type: '5',
        ord_receipt_date: '20160816232040',
        ord_no: '011608162320-61245',
        ord_sts: '020',
        payment_req_id: '',
        disp_store_recev_stts: '0',
        hash_key: '23bdaf40a2e5db84cf99e47249a8f9ba98f62a55e44fb312915bf6c81db06591',
        cancel_btn_view_flg: 'Y',
        upd_date: '20160816232040',
        delv_slip_no: '1',
        delv_trader_no: '1',
        store_receipt_date: '20160817132709',
        recev_expire_date: '20160817132709',
        recev_possible_date: '20160817132709',
        mwm_shipping_info_list: [
          {
            shipping_no: '1',
            planned_delivery_date_from: '20160909',
            planned_delivery_date_to: '20160909',
          },
        ],
      },
    ],
  };

  const mappedList = addressesResponse.order_history_inf_list.map(order => mapOrderHistory(order));

  it('should fetch the list of orders', () => {
    expect(
      reducer(
        {
          orderHistoryList: [],
          loaded: false,
          orderDetail: {},
        },
        {
          type: ORDER_HISTORY_LOAD_SUCCESS,
          result: addressesResponse,
        }
      )
    ).toMatch({
      orderHistoryList: mappedList,
      loaded: true,
    });
  });
});
