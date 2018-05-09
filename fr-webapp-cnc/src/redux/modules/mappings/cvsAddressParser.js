import { getTranslation } from 'i18n';

export default function parseCVSAddress(param = '', list, isSEJ) {
  let address1;
  const addressDefault = 'ローソン店舗受取';
  const regexp = new RegExp(list.join('|'), 'g');
  let prefecture = param.match(regexp);
  let subAddress = param;

  if (prefecture) {
    prefecture = prefecture.toString();
    subAddress = param.substring(prefecture.length);
  } else if (isSEJ) {
    const { address: { defaultPrefecture } } = getTranslation();

    // In the special case where the third party site does not return the prefecture that matches the prefecture list given,
    // we need to set a default value of '東京都' here so account_api and ship_to_api validation passes.
    prefecture = defaultPrefecture;
  }
  const city = subAddress.substring(0, 15);
  const remAddress = subAddress.substr(15, 20);

  if (!remAddress) {
    address1 = '．';
  } else if (remAddress.includes(addressDefault)) {
    address1 = '';
  } else {
    address1 = remAddress;
  }

  const address2 = subAddress.substr(35, 20);

  return [prefecture, city, address1, address2];
}
