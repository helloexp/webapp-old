/*
 * ShippingInfo test data used for the test cases
 *
 */

let address = {
  valid: [
    {
      firstName:         'アスウ',
      lastName:          'ラメッシュ',
      firstNameKatakana: 'メイイ',
      lastNameKatakana:  'イイ',
      postalCode:        '1076231',
      prefecture:        '北海道',
      city:              '東京都',
      street:            '赤坂',
      streetNumber:      '番',
      aptName:           'ミッドタウン・タワー',
      phoneNumber:       '123-456-7890',
      cellPhoneNumber:   '123-456-7890',
      usedBy:             ['prodtest']
    },
    {
      firstName:         'アスウ',
      lastName:          'ラメッシュ',
      firstNameKatakana: 'メイイ',
      lastNameKatakana:  'イイ',
      postalCode:        '1410021',
      prefecture:        '東京都',
      city:              '東京都',
      street:            '赤坂',
      streetNumber:      '番',
      aptName:           'ミッドタウン・タワー',
      phoneNumber:       '123-456-7890',
      cellPhoneNumber:   '123-456-7890',
      usedBy:             ['test3']
    },
    {
      firstName:         'アスウ',
      lastName:          'ラメッシュ',
      firstNameKatakana: 'メイイ',
      lastNameKatakana:  'イイ',
      postalCode:        '1076231',
      prefecture:        '東京都',
      city:              '東京都',
      street:            '赤坂',
      streetNumber:      '番',
      aptName:           'ミッドタウン・タワー',
      phoneNumber:       '123-456-7890',
      cellPhoneNumber:   '123-456-7890',
      usedBy:             ['test']
    },
    {
      firstName:         'アスウ',
      lastName:          'ラメッシュ',
      firstNameKatakana: 'メイイ',
      lastNameKatakana:  'イイ',
      postalCode:        '1076231',
      prefecture:        '東京都',
      city:              '東京都',
      street:            '赤坂',
      streetNumber:      '番',
      aptName:           'ミッドタウン・タワー',
      phoneNumber:       '123-456-7890',
      cellPhoneNumber:   '123-456-7890',
      usedBy:             ['test3']
    }
  ],


  /**
   * Filters products by env used
   * @param {String} env
   * @return {Array.<address.valid>}
   */
  filterByUsage: function (env) {
    return this.valid.filter(function (addresses) {
      return addresses.usedBy.includes(env);
    });
  }

};

module.exports = address;