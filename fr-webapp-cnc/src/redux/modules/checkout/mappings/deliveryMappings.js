import constants from 'config/site/default';
import char from 'utils/characters';
import { getStoreNameParts } from 'utils/store';
import parseCVSAddress from 'redux/modules/mappings/cvsAddressParser';
import getProperty from 'utils/getProperty';
import { REMOVE_HYPHEN } from 'helpers/regex';
import { paddingMobileNumber } from 'utils/format';
import { mergeObjects } from 'utils/mergeObjects';
import { getTomorrow } from 'utils/formatDate';

const {
  DEPT_NAME_MAX_LENGTH,
  deliveryPreferences: { SPLIT_DELIVERY, GROUP_DELIVERY },
  deliveryTypes: { SHIPPING },
  shippingTypes,
  brandName,
} = constants;

/**
 * Delivery data structured under
 * specific delivery preference
 * under a specific split number.
 * @typedef {Object} DeliveryPreferenceData
 * @property {Array} deliveryRequestedDateTimes - available time frames
 * @property {Array} deliveryTypes
 * @property {Array} deliveryDetails
 */

/**
 * Delivery data structured under
 * each delivery preferences
 * for a specific slit number
 * @typedef {Object.<String('C'|'S'), DeliveryPreferenceData>} SplitData
 */

/**
 * Delivery data structure under
 * each delivery preferences
 * for each split number
 * @typedef {Object.<Number, SplitData>} DeliveryMethodList
 */

/**
 * Method to get mapped store data for Family mart store to pass as params to ship to API.
 * @param  {Object} queryParams - Store details
 * @param  {String} address = Default Address.
 * @param  {String} cvsStore = dummy string.
 * @param  {Array} prefectures = prefecture list.
 * @return {Object} mapped addressData
 **/
function mapFmAddressFromQuery(queryParams, address, cvsStore, prefectures) {
  const addressParams = parseCVSAddress(queryParams.shop_addr, prefectures);
  const firstName = address && address.firstName || queryParams.shop_name;
  const lastName = address && address.lastName || cvsStore;
  const firstNameKatakana = address && address.firstNameKatakana || cvsStore;
  const lastNameKatakana = address && address.lastNameKatakana || cvsStore;
  const mobileNo = (queryParams.area_cd && queryParams.depot_cd)
    ? `${queryParams.area_cd}-${queryParams.depot_cd}`
    : '';
  const zipCode = queryParams.zip_cd && queryParams.zip_cd.replace(REMOVE_HYPHEN, '');

  const addressData = {
    receiver_first_nm: encodeURIComponent(firstName.slice(0, 12)),
    receiver_last_nm: encodeURIComponent(lastName),
    receiver_kana_first_nm: encodeURIComponent(firstNameKatakana),
    receiver_kana_last_nm: encodeURIComponent(lastNameKatakana),
    receiver_addr_state: encodeURIComponent(addressParams[0]),
    receiver_addr_city: encodeURIComponent(addressParams[1]),
    receiver_addr1: encodeURIComponent(addressParams[2]),
    receiver_addr2: addressParams[3],
    receiver_zip_cd: zipCode,
    receiver_tel_no: queryParams.fmshop_id,
    receiver_corporate_nm: encodeURIComponent(cvsStore),
    receiver_dept_nm: queryParams.shop_name && encodeURIComponent(queryParams.shop_name.slice(0, DEPT_NAME_MAX_LENGTH)),
    receiver_mobile_no: mobileNo,
  };

  return addressData;
}

/**
 * Method to get mapped store data for Lawson store to pass as params to ship to API.
 * @param  {Object} queryParams - Store details
 * @param  {String} address = Default Address.
 * @param  {String} cvsStore = dummy string.
 * @param  {Array} prefectures = prefecture list.
 * @return {Object} mapped addressData
 **/

function mapLawsonMinistopAddressFromQuery(queryParams, address, cvsStore, prefectures) {
  const addressParams = parseCVSAddress(queryParams.name7, prefectures);
  const firstName = address && address.firstName || queryParams.name3;
  const lastName = address && address.lastName || cvsStore;
  const firstNameKatakana = address && address.firstNameKatakana || cvsStore;
  const lastNameKatakana = address && address.lastNameKatakana || cvsStore;

  const addressData = {
    receiver_first_nm: encodeURIComponent(firstName.slice(0, 12)),
    receiver_last_nm: encodeURIComponent(lastName),
    receiver_kana_first_nm: encodeURIComponent(firstNameKatakana),
    receiver_kana_last_nm: encodeURIComponent(lastNameKatakana),
    receiver_addr_state: encodeURIComponent(addressParams[0]),
    receiver_addr_city: encodeURIComponent(addressParams[1]),
    receiver_addr1: encodeURIComponent(addressParams[2]),
    receiver_addr2: addressParams[3],
    receiver_zip_cd: queryParams.name6.replace(REMOVE_HYPHEN, ''),
    receiver_tel_no: queryParams.name1,
    receiver_corporate_nm: encodeURIComponent(cvsStore),
    receiver_dept_nm: queryParams.name3 && encodeURIComponent(queryParams.name3.slice(0, DEPT_NAME_MAX_LENGTH)),
    receiver_mobile_no: encodeURIComponent(queryParams.name2),
  };

  return addressData;
}

/**
 * Method to get mapped store data for seven eleven store to pass as params to ship to API.
 * @param  {Object} queryParams - Store details
 * @param  {String} address = Default Address.
 * @param  {String} cvsStore = dummy string.
 * @param  {Array} prefectures = prefecture list.
 * @return {Object} mapped addressData
 **/
function mapSejAddressFromQuery(queryParams, address, cvsStore, prefectures) {
  const addressParams = parseCVSAddress(queryParams.mise_jusho, prefectures, true);
  const firstName = address && address.firstName || queryParams.mise_mei;
  const lastName = address && address.lastName || cvsStore.withHyphen;
  const firstNameKatakana = address && address.firstNameKatakana || cvsStore.withoutHyphen;
  const lastNameKatakana = address && address.lastNameKatakana || cvsStore.withoutHyphen;

  const addressData = {
    receiver_first_nm: encodeURIComponent(firstName.slice(0, 12)),
    receiver_last_nm: encodeURIComponent(lastName),
    receiver_kana_first_nm: encodeURIComponent(firstNameKatakana),
    receiver_kana_last_nm: encodeURIComponent(lastNameKatakana),
    receiver_addr_state: encodeURIComponent(addressParams[0]),
    receiver_addr_city: encodeURIComponent(addressParams[1]),
    receiver_addr1: encodeURIComponent(addressParams[2]),
    receiver_addr2: addressParams[3],
    receiver_zip_cd: queryParams.X_mise_post.replace(REMOVE_HYPHEN, ''),
    receiver_tel_no: queryParams.X_mise_no,
    receiver_corporate_nm: encodeURIComponent(cvsStore.withHyphen),
    receiver_dept_nm: queryParams.mise_mei && encodeURIComponent(queryParams.mise_mei.slice(0, DEPT_NAME_MAX_LENGTH)),
  };

  return addressData;
}

export function getDateTimeList(list) {
  return list
    .map(item => ({
      date: item.delv_dt && item.delv_dt || constants.NULL_TIMEFRAME,
      timeSlots: item.delv_time_list,
    }))
    .sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }

      return 0;
    });
}

export function getDetails(type, details) {
  return details && {
    deliveryType: details.delv_type,
    limitDatetime: details.ord_limit_datetime,
    plannedDateFrom: details.planned_delv_date_from,
    plannedDateTo: details.planned_delv_date_to,
    spareDate: details.spare_date,
    plannedTime: details.planned_delv_time,
    splitDiv: details.split_div,
    splitNo: details.split_no.toString(),
  } || {};
}

/**
 * Find next day availability for each splits and delivery preference.
 * @param {DeliveryMethodList} deliveryMethodList
 * @returns {Object.<Number, {C: Boolean, S: Boolean}>}
 */
function getNextDayAvailablityForShipments(deliveryMethodList) {
  const tomorrow = getTomorrow();

  // iterate through spit numbers
  return Object.keys(deliveryMethodList).reduce((splitNoAcc, splitNo) => ({
    ...splitNoAcc,
    // iterate through split divs under split numbers
    [splitNo]: Object.keys(deliveryMethodList[splitNo]).reduce((splitDivAcc, splitDiv) => {
      const { deliveryRequestedDateTimes } = deliveryMethodList[splitNo][splitDiv];
      const nextDateIndex = deliveryRequestedDateTimes
        ? deliveryRequestedDateTimes.findIndex(item => item.date === tomorrow)
        : -1;

      const nextDateOption = nextDateIndex !== -1 && deliveryRequestedDateTimes.splice(nextDateIndex, 1);

      return { ...splitDivAcc, [splitDiv]: nextDateOption };
    }, {}),
  }), {});
}

/**
 * @typedef {Object} DeliveryMethodsData
 * @property {DeliveryMethodList} deliveryMethodList
 * @property {DeliveryMethodList} updatedDeliveryMethodList - equivalent to `deliveryMethodList — nextDateOptions`
 * @property {Array} deliveryTypes
 * @property {Object} nextDateOptions
 * @property {Number} splitCount
 * @property {Boolean} isSplitDeliveryAvailable
 * @property {Boolean} isShippingGroupDeliveryAvailable
 * @property {String('C'|'S')} defaultDeliveryPreference
 */

/**
 * Restructures `GET /delivery_selectable` GDS API response based on
 * split number and delivery preference (S: split delivery, C: group delivery)
 * @param {Object} rawDeliveryMethods
 * @param {Array} rawDeliveryMethods.delv_type_list
 * @returns {DeliveryMethodsData}
 */
export function mapDeliveryMethods(rawDeliveryMethods) {
  const shipmentsDetails = {};
  const deliveryMethodList = rawDeliveryMethods.delv_type_list;
  const deliveryTypes = [];
  let isShippingGroupDeliveryAvailable = false;
  let isSplitDeliveryAvailable = false;
  let defaultDeliveryPreference = GROUP_DELIVERY;

  for (let index = 0; index < deliveryMethodList.length; index++) {
    const listItem = deliveryMethodList[index];
    const currentDelvType = listItem.delv_type;
    const currentSplitNo = listItem.split_no;
    const currentSplitDiv = listItem.split_div;
    const deliveryDetails = getDetails(currentDelvType, listItem);
    let dateTimeList = [];

    // if shippping is supported, get corresponding date and time frames available
    if (currentDelvType === SHIPPING && listItem.delv_dt_list) {
      dateTimeList = getDateTimeList(listItem.delv_dt_list);
    }

    // check if split delivery is available
    if (listItem.split_div === SPLIT_DELIVERY) {
      isSplitDeliveryAvailable = true;
    }

    // check if group delivery is available and current delivery type is one of shipping variants
    if (listItem.split_div === GROUP_DELIVERY && shippingTypes.includes(listItem.delv_type)) {
      isShippingGroupDeliveryAvailable = true;
    }

    // find the default delivery preference for SHIPPING
    if (currentDelvType === SHIPPING && listItem.default_split_div === SPLIT_DELIVERY) {
      defaultDeliveryPreference = SPLIT_DELIVERY;
    }

    // find all unique delivery types available
    if (!deliveryTypes.includes(currentDelvType)) {
      deliveryTypes.push(currentDelvType);
    }

    // if split_no already exists, updates the list of
    // delivery types, dates and times, delivery details etc.
    if (shipmentsDetails[currentSplitNo]) {
      // current split number may support group delivery or split delivery
      if (shipmentsDetails[currentSplitNo][currentSplitDiv]) {
        if (dateTimeList.length) {
          shipmentsDetails[currentSplitNo][currentSplitDiv].deliveryRequestedDateTimes = dateTimeList;
        }
        shipmentsDetails[currentSplitNo][currentSplitDiv].deliveryTypes.push(currentDelvType);
        shipmentsDetails[currentSplitNo][currentSplitDiv].deliveryDetails.push(deliveryDetails);
      } else {
        shipmentsDetails[currentSplitNo][currentSplitDiv] = {
          deliveryRequestedDateTimes: [],
          deliveryTypes: [currentDelvType],
          deliveryDetails: [deliveryDetails],
        };
        if (dateTimeList.length) {
          shipmentsDetails[currentSplitNo][currentSplitDiv].deliveryRequestedDateTimes = dateTimeList;
        }
      }
    } else {
      shipmentsDetails[currentSplitNo] = {
        [currentSplitDiv]: {
          deliveryRequestedDateTimes: [],
          deliveryTypes: [currentDelvType],
          deliveryDetails: [deliveryDetails],
        },
      };
      if (dateTimeList.length) {
        shipmentsDetails[currentSplitNo][currentSplitDiv].deliveryRequestedDateTimes = dateTimeList;
      }
    }
  }

  const updatedDeliveryMethodList = JSON.parse(JSON.stringify(shipmentsDetails));
  const nextDateOptions = getNextDayAvailablityForShipments(updatedDeliveryMethodList);

  return {
    deliveryMethodList: shipmentsDetails,
    splitCount: Object.keys(shipmentsDetails).length,
    deliveryTypes,
    updatedDeliveryMethodList,
    nextDateOptions,
    isSplitDeliveryAvailable,
    isShippingGroupDeliveryAvailable,
    defaultDeliveryPreference,
  };
}

/**
 * [UPDATE]
 * Map delivery method
 * @param {Object} rawData
 * @return {DeliveryMethod}
 */
export function mapDeliveryMethod(rawData = {}) {
  const delvReqList = rawData.delv_req_list || [];

  return delvReqList.map(method => ({
    splitNo: method.split_no,
    deliveryType: method.delv_type,
    deliveryReqDate: method.delv_req_dt || '',
    deliveryReqTime: method.delv_req_time || '',
  }));
}

function normalizeAddress(address) {
  return address === char['. '] ? '' : address;
}

export function mapDeliveryAddress(rawAddress) {
  const cvsFields = {};

  if (rawAddress.receiver_corporate_nm) {
    cvsFields.receiverCorporateName = rawAddress.receiver_corporate_nm;
  }

  if (rawAddress.receiver_dept_nm) {
    cvsFields.receiverDeptName = rawAddress.receiver_dept_nm;
  }

  return {
    receiverCountryCode: rawAddress.receiver_country_cd,
    firstName: rawAddress.receiver_first_nm,
    lastName: rawAddress.receiver_last_nm,
    firstNameKatakana: rawAddress.receiver_kana_first_nm,
    lastNameKatakana: rawAddress.receiver_kana_last_nm,
    prefecture: rawAddress.receiver_addr_state,
    city: rawAddress.receiver_addr_city,
    street: normalizeAddress(rawAddress.receiver_addr1),
    streetNumber: normalizeAddress(rawAddress.receiver_addr1),
    apt: rawAddress.receiver_addr2,
    postalCode: rawAddress.receiver_zip_cd,
    phoneNumber: rawAddress.receiver_tel_no,
    cellPhoneNumber: rawAddress.receiver_mobile_no,
    ...cvsFields,
    /*  @ TODO need to confirm whether it is required from code.
    receiverTitle: rawAddress.receiver_title,
    companyCodeForReceipt: rawAddress.company_code_for_receipt,
    resultCode: rawAddress.resultCode,
    */
  };
}

export function mapBillingToLocalAddress(rawAddress) {
  return {
    receiverCountryCode: rawAddress.orderer_country_cd,
    firstName: rawAddress.orderer_first_nm,
    lastName: rawAddress.orderer_last_nm,
    firstNameKatakana: rawAddress.orderer_kana_first_nm,
    lastNameKatakana: rawAddress.orderer_kana_last_nm,
    prefecture: rawAddress.orderer_addr_state,
    city: rawAddress.orderer_addr_city,
    street: rawAddress.orderer_addr1,
    streetNumber: rawAddress.orderer_addr1,
    apt: rawAddress.orderer_addr2,
    postalCode: rawAddress.orderer_zip_cd,
    phoneNumber: rawAddress.orderer_tel_no,
    cellPhoneNumber: rawAddress.orderer_mobile_no || '',
    email: rawAddress.orderer_eml_id,
    /*  @ TODO need to confirm whether it is required from code.
    receiverTitle: rawAddress.orderer_title,
    companyCodeForReceipt: rawAddress.company_code_for_receipt,
    receiverCorporateName: rawAddress.order_corporate_nm,
    receiverDeptName: rawAddress.order_dept_nm,
    resultCode: rawAddress.resultCode,
    */
  };
}

export function mapShippingThresholdAmount(rawShippingThresholds) {
  const thresholdList = rawShippingThresholds.codedtl_list.map(item => ({
    deliveryType: item.cd_dtl_id,
    shippingFee: item.cd_dtl_nm,
    thresholdPrice: item.cd_dtl_nm_2,
    countryCode: item.cd_dtl_id_4,
    brandCode: item.cd_dtl_id_3,
  }
));

  return thresholdList;
}

export function mapShippingAddress(shippingAddress, isEditShipTo) {
  const cvsFields = {};

  if (isEditShipTo && shippingAddress) {
    cvsFields.receiver_corporate_nm = shippingAddress.receiverCorporateName;
    cvsFields.receiver_dept_nm = shippingAddress.receiverDeptName;
  }

  return {
    receiver_first_nm: shippingAddress.firstName || '',
    receiver_last_nm: shippingAddress.lastName || '',
    receiver_kana_first_nm: shippingAddress.firstNameKatakana || '',
    receiver_kana_last_nm: shippingAddress.lastNameKatakana || '',
    receiver_addr_state: shippingAddress.prefecture || '',
    receiver_addr_city: shippingAddress.city || '',
    receiver_addr1: shippingAddress.street || shippingAddress.streetNumber || '',
    receiver_addr2: shippingAddress.apt || '',
    receiver_zip_cd: shippingAddress.postalCode,
    receiver_tel_no: shippingAddress.phoneNumber || '',
    receiver_mobile_no: shippingAddress.cellPhoneNumber || '',
    ...cvsFields,
    /*  @ TODO need to confirm whether it is required from code.
    receiver_title: shippingAddress.shipTitle,
    company_code_for_receipt: shippingAddress.codeForReceipt,
    */
  };
}

export function mapBillingAddress(billingAddress) {
  const optionalParams = mergeObjects({
    keys: ['prefecture', 'city'],
    primObj: billingAddress,
    keyNames: ['orderer_addr_state', 'orderer_addr_city'],
  });
  const addr1 = (billingAddress.streetNumber || billingAddress.street) ? { orderer_addr1: billingAddress.streetNumber || billingAddress.street } : {};

  return {
    orderer_first_nm: billingAddress.firstName,
    orderer_last_nm: billingAddress.lastName,
    orderer_kana_first_nm: billingAddress.firstNameKatakana,
    orderer_kana_last_nm: billingAddress.lastNameKatakana,
    orderer_addr2: billingAddress.apt || '',
    orderer_zip_cd: billingAddress.postalCode,
    orderer_tel_no: billingAddress.phoneNumber || '',
    orderer_eml_id: encodeURIComponent(billingAddress.email),
    orderer_mobile_no: billingAddress.cellPhoneNumber || '',
    ...optionalParams,
    ...addr1,
    /*  @ TODO need to confirm whether it is required from code.
    orderer_title: billingAddress.billTitle,
    */
  };
}

export function mapShippingAddressToAccount(rawAddress) {
  const addressData = {
    addressNumber: rawAddress.addressNumber || null,
    firstName: rawAddress.firstName,
    firstNameKatakana: rawAddress.firstNameKatakana,
    lastName: rawAddress.lastName,
    lastNameKatakana: rawAddress.lastNameKatakana,
    street: rawAddress.city,
    prefecture: rawAddress.prefecture,
    apt: rawAddress.apt || '',
    streetNumber: rawAddress.street,
    postalCode: rawAddress.postalCode,
    phoneNumber: rawAddress.phoneNumber,
    cellPhoneNumber: rawAddress.cellPhoneNumber || '',
  };

  return addressData;
}

/**
 * Method to get mapped store data to pass as params to ship to API.
 * @param  {Object} queryParams - Store details
 * @param  {String} address = Default Address.
 * @param  {String} cvsStore = dummy string.
 * @param  {Array} prefectures = prefecture list.
 * @return {Object} mapped addressData
 **/
export function mapCVSAddressFromQuery(queryParams = {}, address, cvsStores, prefectures) {
  let addressData;

  if (queryParams.X_finish_arg && queryParams.X_mise_no) {
    addressData = mapSejAddressFromQuery(queryParams, address, cvsStores.sevenEleven, prefectures);
  } else if (queryParams.fmshop_id && queryParams.status) {
    addressData = mapFmAddressFromQuery(queryParams, address, cvsStores.familyMart, prefectures);
  } else if (queryParams.name1) {
    addressData = queryParams.name5 === cvsStores.lawson
      ? mapLawsonMinistopAddressFromQuery(queryParams, address, cvsStores.lawson, prefectures)
      : mapLawsonMinistopAddressFromQuery(queryParams, address, cvsStores.ministop, prefectures);
  }

  return addressData;
}

/**
 * Redux method to Save Uniqlo/GU store data to ship to API.
 * @param  {String} storeData - Store details
 * @param  {String} address - Default Address.
 * @param  {String} brand - The current brand
 * @return {Object} addressData
 **/
export function mapPickupAddressFromStore(storeData = {}, address = {}, uniqloStore, brand = brandName.uq) {
  const storeName = getProperty(storeData, 'store_name', '');
  const { corporateName, deptName } = getStoreNameParts(storeName);
  const firstName = address && address.firstName ? address.firstName : uniqloStore;
  const lastName = address && address.lastName ? address.lastName : uniqloStore;
  const firstNameKatakana = address && address.firstNameKatakana ? address.firstNameKatakana : uniqloStore;
  const lastNameKatakana = address && address.lastNameKatakana ? address.lastNameKatakana : uniqloStore;
  const storeId = brand === brandName.uq ? storeData.store_id : paddingMobileNumber(storeData.g1_ims_store_id_4);

  return {
    receiver_first_nm: firstName,
    receiver_last_nm: lastName,
    receiver_kana_first_nm: firstNameKatakana,
    receiver_kana_last_nm: lastNameKatakana,
    receiver_addr_state: storeData.area1_name,
    receiver_addr_city: storeData.municipality,
    receiver_addr1: storeData.number.substring(0, 20),
    receiver_addr2: storeData.building.substring(0, 20),
    receiver_zip_cd: storeData.postcode,
    receiver_corporate_nm: corporateName,
    receiver_dept_nm: deptName.slice(0, DEPT_NAME_MAX_LENGTH),
    receiver_mobile_no: storeId,
    receiver_tel_no: storeData.g1_ims_store_id_6,
  };
}

/**
 * Method to Map address in addressform (key shippingAddress) to current shipping address display format
 * @param  {Object} rawAddress - address in shipping address key
 * @return {Object} mapped address to be loaded to currentShippingAddress key in delivery.
 **/
export function mapAddressToAPIResponse(rawAddress) {
  return {
    ...rawAddress,
    street: rawAddress.streetNumber,
  };
}

/**
 * Restructures split details from `GET /split` GDS API
 * @param {Object} splitDetails
 * @param {Array} [splitDetails.split_cart_list=[]]
 * @returns {Object} - split details is restructured into the below format
 *  {
 *    x1: { ..., cartItemsSeqNo: [y1, y2, ...] },
 *    x2: { ..., cartItemsSeqNo: [y3, y4, ...] },
 *    ...
 *  }
 * where:
 *  x1, x2, ..., xn => respresents the split number
 *  y1, y2, ..., yn => respresents the sequence number of an item in cart
 */
export function mapSplitDetails(splitDetails = { split_cart_list: [] }) {
  return splitDetails.split_cart_list.reduce((acc, split) => {
    const cartItemsSeqNo = [];
    const { cart_dtl_list: cartDtlList, ...rest } = split;

    // Iterate `cart_dtl_list` to find the cart sequence numbers
    // belonging to this particular split.
    for (let index = 0; index < cartDtlList.length; index++) {
      cartItemsSeqNo.push(cartDtlList[index].cart_seq_no);
    }

    return { ...acc, [split.split_no]: { ...rest, cartItemsSeqNo } };
  }, {});
}
