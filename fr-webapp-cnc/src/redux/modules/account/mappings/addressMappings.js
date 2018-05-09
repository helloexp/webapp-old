export function getUserInfoMapped(item) {
  return {
    firstName: item.firstName,
    lastName: item.lastName,
    firstNameKatakana: item.firstNameKatakana || '',
    lastNameKatakana: item.lastNameKatakana || '',
    postalCode: item.postalCode,
    prefecture: item.prefecture,
    streetNumber: item.streetNumber || '',
    street: item.street,
    apt: item.apt || '',
    phoneNumber: item.phoneNumber,
    cellPhoneNumber: item.cellPhoneNumber,
    email: item.email,
    city: item.city,
    id: item.id,
  };
}
