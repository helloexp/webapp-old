import parseCVSAddress from 'redux/modules/mappings/cvsAddressParser';
import constants from 'config/site/default';
import { REMOVE_HYPHEN } from 'helpers/regex';

function mapToSejAddress(query, prefectures, defaultCVSValue, userAddressId) {
  const addressParams = parseCVSAddress(query.mise_jusho, prefectures, true);

  return {
    id: userAddressId,
    familyName: defaultCVSValue,
    givenName: query.mise_mei && query.mise_mei.slice(0, 25),
    phoneticFamilyName: defaultCVSValue,
    phoneticGivenName: defaultCVSValue,
    prefecture: addressParams[0],
    city: addressParams[1],
    address: addressParams[2],
    roomNumber: addressParams[3] || '',
    zipCode: query.X_mise_post && query.X_mise_post.replace(REMOVE_HYPHEN, ''),
    phoneNumber: String(query.X_mise_no),
    mobilePhoneNumber: '',
  };
}

function mapToFmAddress(query, prefectures, defaultCVSValue, userAddressId) {
  const addressParams = parseCVSAddress(query.shop_addr, prefectures);
  const zipCode = query.zip_cd && query.zip_cd.replace(REMOVE_HYPHEN, '');
  const mobilePhoneNumber = (query.area_cd && query.depot_cd) && `${query.area_cd}-${query.depot_cd}`;

  return {
    id: userAddressId,
    familyName: defaultCVSValue,
    givenName: query.shop_name && query.shop_name.slice(0, 25),
    phoneticFamilyName: defaultCVSValue,
    phoneticGivenName: defaultCVSValue,
    prefecture: addressParams[0],
    city: addressParams[1],
    address: addressParams[2],
    roomNumber: addressParams[3] || '',
    phoneNumber: String(query.fmshop_id),
    mobilePhoneNumber: mobilePhoneNumber || '',
    zipCode,
  };
}

export function mapToLawsonAddress(query, prefectures, defaultCVSValue, userAddressId) {
  const addressParams = parseCVSAddress(query.name7, prefectures);

  return {
    id: userAddressId,
    familyName: defaultCVSValue,
    givenName: query.name3 && query.name3.slice(0, 25),
    phoneticFamilyName: defaultCVSValue,
    phoneticGivenName: defaultCVSValue,
    prefecture: addressParams[0],
    city: addressParams[1],
    address: addressParams[2],
    roomNumber: addressParams[3] || '',
    zipCode: query.name6 && query.name6.replace(REMOVE_HYPHEN, ''),
    phoneNumber: String(query.name1),
    mobilePhoneNumber: String(query.name2),
  };
}

export function formatAddressFromQuery(query, prefectures, defaultCVSValue, userAddressId) {
  let addressData;
  const { SEJ_ADDRESS_ID, LAWSON_ADDRESS_ID, FM_ADDRESS_ID } = constants;

  if (userAddressId === SEJ_ADDRESS_ID) {
    addressData = mapToSejAddress(query, prefectures, defaultCVSValue, userAddressId);
  } else if (userAddressId === LAWSON_ADDRESS_ID) {
    addressData = mapToLawsonAddress(query, prefectures, defaultCVSValue, userAddressId);
  } else if (userAddressId === FM_ADDRESS_ID) {
    addressData = mapToFmAddress(query, prefectures, defaultCVSValue, userAddressId);
  }

  return addressData;
}
