// TODO The hardcoded values need to be removed once the proper values from API are available.
// Now kept in tact so that it doesnt break the UI.
import { getProductImage, titleDecode } from 'utils/productUtils';

export function sortBySeqNo(array) {
  return array.sort((current, next) => current.cart_seq_no - next.cart_seq_no);
}

export function getItems(data) {
  const internalId = `${data.l2_goods_cd}-${data.cart_seq_no}`;
  const itemCode = `${data.l1_goods_cd}-${data.color_cd}-${data.size_cd}-${data.length_cd}`;

  return {
    internalId,
    cartNumber: data.cart_no,
    id: data.l1_goods_cd,
    seqNo: data.cart_seq_no,
    l2Code: data.l2_goods_cd,
    itemCode,
    title: titleDecode(data.goods_nm),
    liked: false,
    image: getProductImage(data.l1_goods_cd, data.color_cd),
    color: data.color_nm,
    colorCode: data.color_cd,
    size: data.size_nm,
    sizeCd: data.size_cd,
    length: data.length_nm,
    lengthCode: data.length_cd,
    count: data.goods_cnt,
    price: data.sale_pr,
    priceNum: data.sale_pr,
    flags: {
      discount: data.discount_flg,
      online_limit: data.online_limit_flg,
    },
    placeholder: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    multiBuy: parseInt(data.promo_dtl_flg, 10) > 0,
    applyType: data.apply_type,
    promoId: data.promo_id,
    promoDtlFlg: data.promo_dtl_flg,
    promoJoinNum: data.promo_join_num,
    promoApplyCnt: data.promo_apply_cnt,
    promoApplyDiscountAmt: data.promo_apply_discount_amt,
    salePriceAmount: data.sale_price_amt,
    promoNm: data.promo_nm,
    alteration: data.alteration_flg,
    modifySize: data.modify_size,
    sku: data.l1_goods_cd,
    firstOrderFlag: data.first_ord_flg,
  };
}

export function getAllCartItems(resultFromApi) {
  const sortedItems = sortBySeqNo(resultFromApi);

  return sortedItems.map(item => getItems(item));
}

export function getProductIdList(productList) {
  return productList.map(product => product.l1_goods_cd || product.id).join(',');
}

/**
 * mapping function that returns an object with the items that
 * are out of stock or short in inventory.
 */
export function getInventory(items = [], cartItems = []) {
  // get all cart items that are PIB secured
  const securedCartItems = cartItems.filter(
    cartItem => !items.find(item => item.cart_seq_no === ~~cartItem.seqNo)
  );

  return items.reduce((acc, item) => {
    let securedCount = item.temp_total_stock_secure_cnt;

    // If current item doesn't contains inventory data
    // we won't map it to update cart inventory status
    if (securedCount === undefined) {
      return acc;
    }

    securedCount = ~~securedCount;
    // calculate the total number of items from all secured lines for an l2 code
    // - for normal products: l2ProductCount = securedCount
    // - for multi-buy products: l2ProductCount = securedCount + Σ cartItem(l2Code).goods_cnt
    const l2ProductCount = securedCartItems.reduce(
      (sum, cartItem) => (cartItem.l2Code === item.l2_goods_cd ? sum + ~~cartItem.count : sum),
      securedCount,
    );

    return {
      ...acc,
      [item.l2_goods_cd]: {
        l2Code: item.l2_goods_cd,
        seqNo: item.cart_seq_no,
        count: l2ProductCount,
        secured: securedCount,
      },
    };
  }, {});
}
