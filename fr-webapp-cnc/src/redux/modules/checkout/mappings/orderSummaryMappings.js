import { getProductImage } from 'utils/productUtils';
import { mergeObjects } from 'utils/mergeObjects';
import { getCurrentBrand } from 'utils/routing';
import { getCart } from 'redux/modules/cart';
import { brand as brandCode } from 'config/site/default';

export default function getOrderSummary(summary = {}) {
  return {
    totalMerchandise: summary.goods_sales,
    totalMerchandiseOrder: summary.goods_sales_amt,
    giftFee: parseInt(summary.gift_bag_amt, 10),
    messageCardFee: parseInt(summary.message_card_amt, 10),
    correctionFee: summary.modify_amt,
    coupon: summary.disc_amt,
    shippingCost: summary.shipping_fee,
    giftCardPayment: summary.gift_card_amt,
    total: summary.total_amt_in_tax,
    paymentsAmt: summary.payments_amt,
    settlementFee: summary.payment_handling_fee,
    additionalCharges:
    {
      consumptionTax: summary.tax,
      serviceAmount: summary.tax_disc_amt,
    },
  };
}

export function getOrderMapping(order) {
  return {
    cancelTargetFlag: order.cancel_target_flg,
  };
}

export function getShippingAddress(order) {
  const cvsFields = {};

  if (order.receiver_corporate_nm) {
    cvsFields.receiverCorporateName = order.receiver_corporate_nm;
  }

  if (order.receiver_dept_nm) {
    cvsFields.receiverDeptName = order.receiver_dept_nm;
  }

  return {
    city: order.receiver_addr_city,
    firstName: order.receiver_first_nm,
    lastName: order.receiver_last_nm,
    phoneNumber: order.receiver_tel_no,
    cellPhoneNumber: order.receiver_mobile_no,
    postalCode: order.receiver_zip_cd,
    prefecture: order.receiver_addr_state,
    street: order.receiver_addr1,
    streetNumber: order.receiver_addr1,
    apt: order.receiver_addr2,
    firstNameKatakana: order.receiver_kana_first_nm,
    lastNameKatakana: order.receiver_kana_last_nm,
    deliveryType: order.delv_type,
    deliveryDate: order.delv_req_dt,
    deliveryTime: order.delv_req_time,
    ...cvsFields,
  };
}

export function getItems(order) {
  return {
    image: getProductImage(order.l1_goods_cd, order.color_cd),
    count: order.goods_cnt,
  };
}

export function getAllOrderItems(resultFromApi) {
  return resultFromApi.map(item => getItems(item));
}

/**
 * If barcode or pay in store barcode exist. it returns an barcode object
 *
 * @param {data} an object contains order information
 * @returns {object or null} if data exist it sends the barcode else it will send it as null
 */
export function getBarcodeInfo(data) {
  const dataFromApi = data && (data.barcode_info || data.pay_In_Store_Barcode_info);

  if (dataFromApi) {
    return {
      barcodeNumber: dataFromApi.barcode_no,
      orderTimeLimit: dataFromApi.ord_time_limit,
      barcodeImage: {
        contentType: 'image/png',
        content: dataFromApi.barcode_image,
      },
    };
  }

  return null;
}

/**
 * GET/order/order-id response is used to display the order-details in the order-confirm page. Currently it's login restricted.
 * When order is successfully placed,the details passed to POST/simple_order will be displayed in order-confirm page from redux-state.
 * This mapping takes the values in cart and the params passed to POST/simple_order and outputs the response in the format of GET/order/order-id response.
 * If user refresh the page, we redirect user to Cart page.
 */
export function mapOrderDetailsForGuestUserApplePay({ value, result }) {
  const { applePayOrderParams, routing, cart } = value;
  const { ord_no, hash_key } = result && result.orderList && result.orderList[0] || {};
  const brand = getCurrentBrand({ routing });
  const brandCart = getCart({ cart, routing }) || {};
  const { items, orderSummary = {}, paymentType, coupon_id } = brandCart;
  const { billingAddress = {} } = cart;
  const orderDelv = mergeObjects({
    keys: [
      'delv_type',
      'delv_req_dt',
      'delv_req_time',
    ],
    primObj: applePayOrderParams,
  });

  const orderDetailList = items ? items.map(item => ({
    l1_goods_cd: item.id,
    goods_cnt: item.count,
    sale_price_amt: item.salePriceAmount,
    goods_nm: item.title,
  })) : [];

  return {
    [ord_no]: {
      orderNo: ord_no,
      orderDetails: {
        ord_no,
        hashKey: hash_key,
        order_delv: orderDelv,
        order_detail_list: orderDetailList,
        total_amt_in_tax: orderSummary.total,
        shipping_fee: orderSummary.shippingCost,
        tax: orderSummary.additionalCharges && orderSummary.additionalCharges.consumptionTax,
        coupon_id,
        ord_brand_kbn: brandCode[brand],
        orderer_zip_cd: billingAddress.postalCode,
        orderer_addr_city: billingAddress.city,
        orderer_addr_state: billingAddress.prefecture,
        payment_type: paymentType,
      },
    },
  };
}
