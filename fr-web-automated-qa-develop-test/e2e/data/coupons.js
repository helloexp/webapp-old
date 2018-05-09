let coupon = {
  valid: [
    {
      couponId: 'test17SS004ng',
      couponName: '利用済みクーポン',
      usedBy: 'test3-uq',
    },
    {
      couponId: 'GU_Mugen_01',
      couponName:'GU_Mugen_01',
      id: '3600425899585',
      amount: '- ¥100',
      usedBy: 'test3-gu',
    },
    {
      couponName: 'shoukei_1001',
      id: '3013105449855',
      amount: '- ¥100',
      usedBy: 'test-uq',
    },
    {
      couponName: 'GU_CPWLLT_ECST01',
      id: '3609199576043',
      amount: '- ¥100',
      usedBy: 'test-gu',
    },
    {
      couponName: 'shoukei_9999',
      id: '3010905713759',
      usedBy: 'prodtest-uq',
    },
    {
      couponName: 'TEST6289_2_10',
      id: '3015932883178',
      usedBy: 'prodtest-gu',
    }
  ],

  /**
   * Filters products by env used
   * @param {String} env
   * @return {Array.<coupons.valid>}
   */
  filterByUsage: function (env) {
    return this.valid.filter(function (coupons) {
      return coupons.usedBy.includes(env);
    });
  }

};

module.exports = coupon;
