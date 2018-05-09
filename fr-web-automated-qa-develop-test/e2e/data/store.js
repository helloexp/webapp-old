let store = {
  valid:[
    {
      type       : 'uniqlo',
      name       : 'ビックロ ユニクロ',
      address    : '東京都新宿区新宿３－２９－１',
      usedBy     : 'prodtest-deliver'
    },
    {
      type       : 'uniqlo',
      name       : 'ユニクロ 銀座店',
      address    : '東京都中央区銀座６－９－５',
      usedBy     : 'test3-deliver'
    },
    {
      type    : 'atstore'  ,
      name    : 'ユニクロ 東京ミッドタウン店' ,
      address : '東京都港区赤坂9-7-4 東京ミッドタウン 地下1階',
      usedBy  : 'prodtest-pay'      
    },
    {
      type       : 'atstore',
      name       : 'ユニクロ 銀座店',
      address    : '東京都中央区銀座6-9-5',
      usedBy     : 'test3-pay'
    },
  ],

   /**
   * Filters products by env and store type used
   * @param {String} env
   * @return {Array.<store.valid>}
   */
  filterByUsage: function (env) {
    return this.valid.filter(function (stores) {
      return stores.usedBy.includes(env);
    });
  }
};

module.exports = store;