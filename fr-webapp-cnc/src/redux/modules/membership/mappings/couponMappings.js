import getProperty from 'utils/getProperty';

function getLatestUsedDate(usages) {
  let latestDate = 0;

  usages.forEach((usage) => {
    if (usage.used_at > latestDate) {
      latestDate = usage.used_at;
    }
  });

  return latestDate;
}

function sortCoupons(coupon) {
  const sortedCoupons = coupon.sort((coupon1, coupon2) =>
    coupon2.priority - coupon1.priority || coupon1.validTo - coupon2.validTo);
  const sortedUsedCoupons = [];
  const sortedUnusedCoupons = [];

  sortedCoupons.forEach((key) => {
    if (key.isUsed === true) {
      sortedUsedCoupons.push(key);
    } else {
      sortedUnusedCoupons.push(key);
    }
  });

  return sortedUnusedCoupons.concat(sortedUsedCoupons);
}

export function getCoupons(coupons) {
  if (!coupons.length) {
    return [];
  }

  return sortCoupons(coupons.map((coupon, index) => {
    const rawCoupon = coupon.coupon;

    return {
      id: rawCoupon.id,
      internalId: `${rawCoupon.id}-${index}`,
      title: rawCoupon.name,
      code: rawCoupon.gds_id,
      combinable: rawCoupon.combinable === 1,
      nCombinable: rawCoupon.n_combinable,
      validFrom: rawCoupon.start_time,
      validTo: rawCoupon.end_time,
      valid: rawCoupon.is_valid === 1,
      selected: false,
      usableStores: rawCoupon.comment_1 || '',
      usageNotes: rawCoupon.comment_2 || '',
      isUsed: coupon.usage_data.use_cnt >= rawCoupon.max_usage_per_customer,
      image: getProperty(rawCoupon, 'images.sp.url', '/images/icon1.png'),
      usedDate: coupon.usage_data.history.usages
        ? getLatestUsedDate(coupon.usage_data.history.usages)
        : null,
      hasBarcode: rawCoupon.has_barcode === 1,
      priority: rawCoupon.priority || -1,
    };
  }));
}

export function getCartCoupon(coupon) {
  return {
    couponId: coupon.coupon_id,
    title: coupon.coupon_nm,
  };
}
