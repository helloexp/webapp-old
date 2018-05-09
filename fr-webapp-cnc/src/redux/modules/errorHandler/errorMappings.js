const gdsFormValidationFields = {
  orderer_first_nm: 'givenName',
  orderer_last_nm: 'familyName',
  orderer_kana_first_nm: 'phoneticGivenName',
  orderer_kana_last_nm: 'phoneticFamilyName',
  orderer_addr1: 'address',
  orderer_addr2: 'roomNumber',
  orderer_addr_city: 'city',
  orderer_tel_no: 'phoneNumber',
  orderer_mobile_no: 'mobilePhoneNumber',
};

export function getDetailedErrorMessages(errorList = [], type, getMessage, method) {
  return errorList.reduce((acc, item) => {
    let fieldName = '';
    let errCode = '';
    let message = '';

    if (type === 'gdsValidation') {
      fieldName = gdsFormValidationFields[item.detailCode];
      errCode = 'CHECK_INPUT';
    } else if (type === 'acpfValidation') {
      fieldName = item.field;
      message = item.message;
    } else if (type === 'giftCards') {
      fieldName = item.request_no;
      errCode = item.resultCode;
    } else if (type === 'cartItems') {
      fieldName = item.l2_goods_cd;
      errCode = item.detailResultCode;
    }

    if (errCode) {
      const errorCodeMessages = getMessage()[errCode] || {};

      message = errorCodeMessages.hasOwnProperty(method) ? errorCodeMessages[method] : errorCodeMessages.DEFAULT;
    }

    return { ...acc, [fieldName]: message };
  }, {});
}
