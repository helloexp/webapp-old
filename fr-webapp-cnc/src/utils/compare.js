const fields = [
  'lastName',
  'firstName',
  'lastNameKatakana',
  'firstNameKatakana',
  'city',
  'apt',
  'cellPhoneNumber',
  'phoneNumber',
  'postalCode',
  'prefecture',
  'street',
  'streetNumber',
];

export function compareAddresses(userDefaultDetails, shippingAddress) {
  return fields.find(element => userDefaultDetails[element] !== shippingAddress[element]) === undefined;
}
