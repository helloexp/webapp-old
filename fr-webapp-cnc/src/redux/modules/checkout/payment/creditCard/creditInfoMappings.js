export function getCreditMapping(data) {
  return {
    dbKey: data.db_key,
    custNo: data.cust_no,
    cardType: data.card_type,
    maskedCardNo: data.card_no,
    expiry: data.card_expire,
    cardHolder: data.card_holder,
  };
}

export function getBlueGateMapping(result) {
  return {
    tourokuKbn: result.touroku_kbn,
    merchantID: result.merchant_id,
    dbKey1: result.db_key1,
    amount: result.amount,
    backUrl: result.back_url,
    orderNum: result.order_num,
    cardKbn: result.card_kbn,
    resultUrl: result.result_url,
    optionalAreaName1: result.optional_area_name1,
    optionalAreaName2: result.optional_area_name2,
    optionalAreaValue2: result.optional_area_value2,
    shopID: result.bg_shop_id,
    msgDigest: result.msg_digest,
  };
}
