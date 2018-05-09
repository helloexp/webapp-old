import atob from 'atob';

export function getUser(data) {
  const { email, givenName, phoneticGivenName, familyName, phoneticFamilyName } = data;

  return {
    email,
    firstName: givenName,
    firstNameKana: phoneticGivenName,
    lastName: familyName,
    lastNameKana: phoneticFamilyName,
  };
}

// Decodes the response from server API
// to get the token and member id.
export function decodeMemberData(rawData) {
  const encoded = rawData.id_token.split('.')[1];

  return JSON.parse(atob(encoded));
}
