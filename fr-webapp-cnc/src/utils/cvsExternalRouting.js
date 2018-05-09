import { routes } from 'utils/urlPatterns';
import { root, getCurrentSubDomain, getCurrentBrandFromLocation } from 'utils/routing';
import { LW_STORE_PICKUP_HOST, SEJ_STORE_PICKUP_HOST, LW_CORP_ID, cvsStoreNames } from 'config/site/default';
import { getTranslation } from 'i18n';
import castArray from 'utils/castArray';

/**
 * Method to create addr param to pass to CVS selection site.
 * If there is a CVS address saved, set CVS interface address input parameter using that particular address so that the map will point to that
 * If there is no CVS address saved, the CVS interface address input parameter will be set using the default address of user.
 * When launching CVS interface, use "prefecture" and "city" (2 Japanese strings merged to a single string without spacing)
 * of the default shipping address ("isDefaultShippingAddress"=true) as the input parameter "addr".
 * If there is no fully registered address (default shipping address is address#001 but is not fully registered), then use 東京都中央区銀
 * Lawson store also requires the postal code which is found the same way addr is calculated.
 * @param {Object} defaultAddress - Address 001
 * @param {Array} userInfoAddressList - Addresses saved by the user
 * @param {Object} cvsAddress - Saved CVS store address if any
 * @param {String} cvsBrand - cvsBrand can be sevenEleven, familyMart or lawson.
 * @param {Bool} isToTopPage - To show top page even if the user is return user.
 * @return {Object}        Return addr params for all cvs urls
 **/
function buildCvsAddressParams(defaultAddress, userInfoAddressList, cvsAddress, cvsBrand, isToTopPage) {
  const { delivery: { defaultCVSParams } } = getTranslation();
  const [SEVEN_ELEVEN_CVS] = cvsStoreNames;
  let addressParams = '';
  let address;
  let zipCode;

  if (cvsAddress && cvsAddress.street && cvsAddress.prefecture) {
    addressParams = `${cvsAddress.prefecture}${cvsAddress.street}`;
    zipCode = cvsAddress.postalCode;
  } else if (defaultAddress && defaultAddress.isDefaultShippingAddress) {
    address = defaultAddress;
  } else if (cvsBrand === SEVEN_ELEVEN_CVS && userInfoAddressList) {
    address = castArray(userInfoAddressList).find(item => item.isDefaultShippingAddress);
  } else if (defaultAddress && defaultAddress.postalCode) {
    zipCode = defaultAddress.postalCode;
  } else {
    address = castArray(userInfoAddressList).find(item => item.isDefaultShippingAddress);
  }

  addressParams = address ? `${address.prefecture}${address.city}` : addressParams;
  zipCode = address ? address.postalCode : zipCode;

  if (isToTopPage && defaultAddress) {
    const topPageParams = (cvsBrand === cvsStoreNames[0]) ? defaultCVSParams : '';

    zipCode = defaultAddress.postalCode;
    addressParams = (defaultAddress.prefecture && defaultAddress.city) ? `${defaultAddress.prefecture}${defaultAddress.city}` : topPageParams;
  }

  const defaultAddressNotFull = !defaultAddress || !defaultAddress.firstName || !defaultAddress.postalCode || !defaultAddress.prefecture;

  if ((defaultAddressNotFull && !addressParams) && cvsBrand === SEVEN_ELEVEN_CVS) {
    addressParams = defaultCVSParams;
  }

  return { addressParams, zipCode };
}

/*
Lawson-Minstop interface does not accept queryparams in their redirectUrl.
Hence had to write lawsonRedirectPath.
Hence for GU we cannot send brand=gu for Lawson-Minsitop as of now.
*/
function redirectToCVS(addr, isToTopPage) {
  const brand = getCurrentBrandFromLocation();
  const domainKey = getCurrentSubDomain();
  const locationOrigin = window.location.origin;

  const redirectPath = `${locationOrigin}${root}/${routes.payment}?brand=${brand}`;
  const cancelPath = `${locationOrigin}${root}/${routes.delivery}?brand=${brand}`;

  // For Family Mart Stores
  const fmhost = 'http://as.chizumaru.com/famima/s';
  const fmReturnArg = `ok_url=${redirectPath}$$ng_url=${cancelPath}$$status=03`;

  const familyMart = (addr.familyMart.addressParams === '' || isToTopPage)
    ? `${fmhost}/sphtop?acc=famima2&arg=${fmReturnArg}`
    : `${fmhost}/sphlist?acc=famima2&c4=1&key=${addr.familyMart.addressParams}&arg=${fmReturnArg}`;

  // For SEJ store
  const pS1 = { uq: '40017', gu: '40018' };
  const seHost = SEJ_STORE_PICKUP_HOST[domainKey] || SEJ_STORE_PICKUP_HOST.www;
  const sevenEleven = `${seHost}?addr=${addr.sevenEleven.addressParams}&p_s1=${pS1[brand]}&p_s2=${redirectPath}&p_s3=${cancelPath}&p_s4=012345`;

  // For Lawson store
  const lsHost = LW_STORE_PICKUP_HOST[domainKey] || LW_STORE_PICKUP_HOST.test;
  const corpid = LW_CORP_ID[domainKey] || LW_CORP_ID.dev;
  const lawsonRedirectPath = `${locationOrigin}${root}/${routes.payment}`;
  const lawson = `${lsHost}?enc=UTF8&ad=${addr.lawson.addressParams}&zip=${addr.lawson.zipCode}&corpid=${corpid}&p_s1=${lawsonRedirectPath}`;

  return { familyMart, sevenEleven, lawson };
}

/**
 * Util method to create url fot the external CVS selection site.
 * @param {Object} defaultAddress - Address 001
 * @param {Array} userInfoAddressList - Addresses saved by the user
 * @param {Object} cvsAddress - Saved CVS store address if any
 * @return {Object}        Return redirect urls for all cvs stores
 **/
export function buildCvsUrls(defaultAddress, userInfoAddressList, cvsAddress, isToTopPage) {
  const addressParams = cvsStoreNames.reduce((params, brand) => {
    params[brand] = buildCvsAddressParams(defaultAddress, userInfoAddressList, cvsAddress[brand], brand, isToTopPage);

    return params;
  }, {});

  return redirectToCVS(addressParams, isToTopPage);
}
