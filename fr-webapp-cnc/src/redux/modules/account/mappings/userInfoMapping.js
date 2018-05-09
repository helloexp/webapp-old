import constants from 'config/site/default';
import { getTranslation } from 'i18n';
import { getStoreNameParts } from 'utils/store';
import { mergeObjects } from 'utils/mergeObjects';
import { paddingMobileNumber } from 'utils/format';
import { splitByChar } from 'utils/applePay';

export function mapUserInfoAddress(userInfoAddress) {
  return {
    email: userInfoAddress.email,
    gender: userInfoAddress.gender,
    birthday: userInfoAddress.birthday || '',
    lastName: userInfoAddress.familyName || '',
    firstName: userInfoAddress.givenName || '',
    lastNameKatakana: userInfoAddress.phoneticFamilyName || '',
    firstNameKatakana: userInfoAddress.phoneticGivenName || '',
    prefecture: userInfoAddress.prefecture || '',
    city: userInfoAddress.city || '',
    street: userInfoAddress.address || '',
    apt: userInfoAddress.roomNumber || '',
    postalCode: userInfoAddress.zipCode,
    phoneNumber: userInfoAddress.phoneNumber || '',
    cellPhoneNumber: userInfoAddress.mobilePhoneNumber || '',
    isDefaultShippingAddress: userInfoAddress.isDefaultShippingAddress,
    updateTimestamp: userInfoAddress.updateTimestamp,
    cas: userInfoAddress.cas,
    streetNumber: userInfoAddress.address || '',
  };
}

export function mapUserAddress(userAddress) {
  const addressData = {
    id: userAddress.id,
    lastName: userAddress.familyName || '',
    firstName: userAddress.givenName || '',
    lastNameKatakana: userAddress.phoneticFamilyName || '',
    firstNameKatakana: userAddress.phoneticGivenName || '',
    prefecture: userAddress.prefecture,
    city: userAddress.city || '',
    street: userAddress.address || '',
    apt: userAddress.roomNumber || '',
    postalCode: userAddress.zipCode || '',
    phoneNumber: userAddress.phoneNumber,
    cellPhoneNumber: userAddress.mobilePhoneNumber || '',
    isDefaultShippingAddress: userAddress.isDefaultShippingAddress,
    updateTimestamp: userAddress.updateTimestamp,
    cas: userAddress.cas,
    streetNumber: userAddress.address || '',

  };

  return addressData;
}

/**
 * Make sure the address format is in the correct format
 */
export function mapUserAddressIfNeded(userAddress) {
  if (userAddress.familyName && userAddress.givenName) {
    return mapUserInfoAddress(userAddress);
  }

  return userAddress;
}

export function mapCVSUserInfo(rawInfo) {
  return {
    addressNumber: rawInfo.id,
    firstName: rawInfo.givenName,
    lastName: rawInfo.familyName,
    postalCode: rawInfo.zipCode,
    street: rawInfo.city,
    apt: rawInfo.address,
    prefecture: rawInfo.prefecture,
  };
}

export function mapAllUserAddresses(rawAddress) {
  return Object.keys(rawAddress).map(key =>
    mapUserAddress(rawAddress[key])
  );
}

export function mapAddressToUserInfo(rawAddress, noCAS) {
  const optionalParams = mergeObjects({
    keys: ['prefecture', 'gender', 'city', 'dob', 'streetNumber'],
    primObj: rawAddress,
    keyNames: ['prefecture', 'gender', 'city', 'birthday', 'address'],
  });
  const street = !rawAddress.city && rawAddress.street ? { city: rawAddress.street } : {};
  const cas = noCAS ? {} : { cas: rawAddress.cas };

  return rawAddress && {
    id: rawAddress.id || '',
    givenName: rawAddress.firstName,
    phoneticGivenName: rawAddress.firstNameKatakana,
    familyName: rawAddress.lastName,
    phoneticFamilyName: rawAddress.lastNameKatakana,
    roomNumber: rawAddress.apt || '',
    zipCode: rawAddress.postalCode,
    phoneNumber: rawAddress.phoneNumber,
    mobilePhoneNumber: rawAddress.cellPhoneNumber || '',
    email: rawAddress.email || rawAddress.mail,
    ...optionalParams,
    ...street,
    ...cas,
  } || {};
}

/**
 * Redux method to Save Uniqlo/GU store Address to 980/970.
 * @param  {Object} rawAddress - Store details
 * @param  {Object} defaultAddress = Default Address.
 * @param  {String} brand - The current brand
 * @return {Object} addressData
 **/
export function mapPickupStoreAddressToUserInfo(rawAddress, defaultAddress, brand = constants.brandName.uq) {
  // maximum length for given name, Phonetic given name and address
  const { UQ_ADDRESS_ID, PHONETIC_GIVEN_NAME_MAX_LENGTH, GIVEN_NAME_MAX_LENGTH, ADDRESS_MAX_LENGTH, brandName } = constants;
  const { corporateName, deptName } = getStoreNameParts(rawAddress.store_name);
  const cityField = rawAddress.municipality ? { city: rawAddress.municipality } : {};
  const gender = defaultAddress.gender ? { gender: defaultAddress.gender } : {};
  const birthday = defaultAddress.dob ? { birthday: defaultAddress.dob } : {};
  const street = !defaultAddress.city && defaultAddress.street ? { city: defaultAddress.street } : {};
  const storeId = brand === brandName.uq ? rawAddress.store_id : rawAddress.g1_ims_store_id_4;

  return {
    id: UQ_ADDRESS_ID,
    givenName: deptName.slice(0, GIVEN_NAME_MAX_LENGTH),
    phoneticGivenName: rawAddress.store_name_phonogram.slice(0, PHONETIC_GIVEN_NAME_MAX_LENGTH),
    familyName: corporateName,
    phoneticFamilyName: corporateName,
    prefecture: rawAddress.area1_name,
    roomNumber: rawAddress.building || '',
    address: rawAddress.number && rawAddress.number.slice(0, ADDRESS_MAX_LENGTH) || '',
    zipCode: rawAddress.postcode,
    cas: rawAddress.cas,
    email: rawAddress.email || rawAddress.mail,
    phoneNumber: rawAddress.g1_ims_store_id_6 && String(rawAddress.g1_ims_store_id_6) || '',
    mobilePhoneNumber: storeId && paddingMobileNumber(storeId) || '',
    ...cityField,
    ...gender,
    ...birthday,
    ...street,
  };
}

export function mapAddressForRegistration(formAddress, { shippingContact }, brand) {
  const JP_CODE = '+81';
  const { applePay: { phoneticGivenName, phoneticFamilyName } } = getTranslation();
  const subscription = formAddress.isSubscribed ? { enewsSubscription: constants.enewsSubscription[brand] } : {};
  const orderDelvDetails = mergeObjects({
    keys: [
      'familyName',
      'givenName',
      'postalCode',
      'administrativeArea',
      'locality',
      'phoneNumber',
    ],
    primObj: shippingContact,
    keyNames: [
      'familyName',
      'givenName',
      'zipCode',
      'prefecture',
      'city',
      'phoneNumber',
    ],
  });
  const { addressLines, phoneticGivenName: givenNamePhonetic, phoneticFamilyName: familyNamePhonetic } = shippingContact;
  const address = splitByChar(['\\n', '\n'], addressLines);

  orderDelvDetails.address = address[0];
  orderDelvDetails.roomNumber = address[1];
  orderDelvDetails.zipCode = orderDelvDetails.zipCode && orderDelvDetails.zipCode.replace('-', '');
  orderDelvDetails.phoneNumber = orderDelvDetails.phoneNumber && orderDelvDetails.phoneNumber.replace(JP_CODE, '0');
  orderDelvDetails.phoneticFamilyName = givenNamePhonetic || phoneticGivenName;
  orderDelvDetails.phoneticGivenName = familyNamePhonetic || phoneticFamilyName;

  return {
    ...orderDelvDetails,
    ...subscription,
    email: formAddress.email,
    password: formAddress.password,
  };
}
