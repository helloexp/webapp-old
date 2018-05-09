
export function getGiftCard(response, index) {
  return {
    index,
    requestNumber: response.request_no,
    number: response.visible_giftcard_no,
    balance: parseInt(response.balance, 10),
    payment: parseInt(response.payment_amt, 10),
    fullPayment: response.all_use_flg,
    expires: response.expire_date,
  };
}

export function getAllGiftcards(response) {
  return response.card_info_list.map(getGiftCard);
}
