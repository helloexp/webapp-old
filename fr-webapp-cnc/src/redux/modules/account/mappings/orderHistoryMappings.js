import { brandName } from 'config/site/default';

function mapStoreReceiveDetailList(storeReceiveDetailList) {
  return storeReceiveDetailList && storeReceiveDetailList.length
    ? storeReceiveDetailList.map(storeReceiveDetail =>
        ({
          receivePosssibleDate: storeReceiveDetail.recev_possible_date,
          receiveExpireDate: storeReceiveDetail.recev_expire_date,
          storeReceiptDate: storeReceiveDetail.store_receipt_date,
          deliveryNumber: storeReceiveDetail.deliver_num,
          recieverAuthKey: storeReceiveDetail.recev_auth_key,
          storeArrivalDate: storeReceiveDetail.store_arrival_date,
          barcodePageURL: storeReceiveDetail.barcode_page_url,
        })
      )
    : [];
}

function getdeliveryTraderNumber(order) {
  const traderNumber = order.delv_trader_no || (order.order_delv && order.order_delv.delv_trader_no);

  return traderNumber ? Math.round(traderNumber / 10) * 10 : null;
}

export function mapOrderHistory(order) {
  let plannedDeliveryDateFrom = null;
  let plannedDeliveryDateTo = null;
  let recieverStoreName = null;
  let recieverStoreCode = null;
  let paymentNumber = null;
  let recieverStoreExpireNoticeDate = null;
  let deliveryRequestDate = null;
  let deliveryRequestTime = null;
  let barcodeURL = null;
  let recieverCorporateName = null;

  if (order.mwm_shipping_info_list && order.mwm_shipping_info_list.length) {
    plannedDeliveryDateFrom = order.mwm_shipping_info_list[0].planned_delivery_date_from;
    plannedDeliveryDateTo = order.mwm_shipping_info_list[0].planned_delivery_date_to;
  }

  if (order.order_delv) {
    deliveryRequestDate = order.order_delv.delv_req_dt;
    deliveryRequestTime = order.order_delv.delv_req_time;
    recieverCorporateName = order.order_delv.receiver_corporate_nm;
    recieverStoreName = order.order_delv.receiver_dept_nm;
  }

  const storeRecieve = order.store_recv || order.store_recv_inf;

  if (storeRecieve) {
    if (storeRecieve.recev_store_nm) {
      recieverStoreName = storeRecieve.recev_store_nm;
    }

    if (storeRecieve.recev_corporate_nm) {
      recieverCorporateName = storeRecieve.recev_corporate_nm;
    }

    recieverStoreCode = storeRecieve.recev_store_cd;
    paymentNumber = storeRecieve.payment_number;
    recieverStoreExpireNoticeDate = storeRecieve.recev_expire_notice_date;
    barcodeURL = storeRecieve.barcode_url;
  }

  return {
    orderNumber: order.ord_no,
    orderReceiptDate: order.ord_receipt_date || order.ord_receipt_front_date,
    orderStatus: order.ord_sts,
    storeReceiveStatus: order.disp_store_recev_stts || '0',
    hashKey: order.hash_key,
    deliveryType: order.delv_type || (order.order_delv && order.order_delv.delv_type) || '',
    isCancelButtonVisible: order.cancel_btn_view_flg === 'Y',
    updatedDate: order.upd_date,
    orderBrand: order.ord_brand_kbn === '10' ? brandName.uq : brandName.gu,
    storeReceiveDetailList: mapStoreReceiveDetailList(order.store_recv_dtl_list),
    plannedDeliveryDateFrom,
    plannedDeliveryDateTo,
    deliveryTraderNumber: getdeliveryTraderNumber(order),
    deliverySlipNumber: order.delv_slip_no || (order.order_delv && order.order_delv.delv_slip_no) || null,
    paymentRequestId: order.payment_req_id || null,
    isMultiDelivery: order.multi_delivery_flg === '1',
    recieverStoreName,
    recieverStoreCode,
    paymentNumber,
    recieverStoreExpireNoticeDate,
    deliveryRequestDate,
    deliveryRequestTime,
    barcodeURL,
    recieverCorporateName,
  };
}
