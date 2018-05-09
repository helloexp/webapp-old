import { createSelector } from 'reselect';
import {
  getDelvDateTime,
  getShippingFee,
  getShippingMethodDescription,
  buildCvsStoreAddress,
  isShippingDeliveryType,
  isCVSDeliveryType,
  isUserDefaultAddressComplete,
} from 'utils/deliveryUtils';
import { buildCvsUrls } from 'utils/cvsExternalRouting';
import { isGiftApplied } from 'redux/modules/checkout/gifting/selectors';
import { getBrand, isGU, isUniqlo, isFirstOrder, getCartItems } from 'redux/modules/cart/selectors';
import { getOrderTotal } from 'redux/modules/checkout/order/selectors';
import { getTranslation } from 'i18n';
import constants from 'config/site/default';
import { areIntersecting } from 'utils/intersect';
import { getCvsAPIConfigInfo } from 'redux/modules/account/userInfo.js';

const {
  deliveryTypes: {
    SHIPPING,
    YU_PACKET,
    YAMATO_MAIL,
    SAME_DAY,
    STORE_PICKUP,
    SEJ,
    LAWSON,
    FM,
  },
  shippingTypes,
  deliveryPreferences: {
    SPLIT_DELIVERY,
    GROUP_DELIVERY,
  },
  defaultSplitNumber,
  NULL_TIMEFRAME,
} = constants;

/**
 * @private
 * @returns {Boolean} checks if all split-shipments have selected shipping preference.
 */
function isPreferenceSelectedForEachSplit(deliveryMethod, standardDelivery) {
  if (deliveryMethod) {
    const { deliveryType, deliveryReqTime, deliveryReqDate } = deliveryMethod;

    return (isShippingDeliveryType(deliveryType)
      ? (deliveryType === YU_PACKET || deliveryType === YAMATO_MAIL || deliveryType === SAME_DAY || (deliveryType === SHIPPING
        && (standardDelivery || (deliveryReqDate && deliveryReqDate !== NULL_TIMEFRAME) || deliveryReqTime && deliveryReqTime !== NULL_TIMEFRAME)))
      : true);
  }

  return false;
}

/**
 * @private returns the delivery method list for used for shipping preference section
 */
const getUpdatedDeliveryMethodList = state => state.delivery.updatedDeliveryMethodList;

/**
 * @private Returns `isEditDeliveryOption` from delivery reducer
 */
const isEditDeliveryOption = state => state.delivery.isEditDeliveryOption;

/**
 * @private Returns `isEditDeliveryAddress` from delivery reducer
 */
const isEditDeliveryAddress = state => state.delivery.isEditDeliveryAddress;

/**
 * @private Returns `isFromAddressBook` from delivery reducer
 */
const isFromAddressBook = state => state.delivery.isFromAddressBook;

const getAllNextDateOptions = state => state.delivery.nextDateOptions;

/**
 * Get Shipping Address list saved by user
 **/
const getUserInfoAddressList = state => state.userInfo.userInfoAddressList;

/**
 * Get CVS Address saved by user
 **/
const getCvsAddress = state => state.userInfo.cvsAddress;

/**
 * Get Shipping Threshold Details
 **/
const getShippingThreshold = state => state.delivery.shippingThreshold;

const getStandardDelivery = state => state.delivery.deliveryStandard;

/**
 * @private Returns `nextDateOptionSelected` from props passed
 */
const getIfNextDateOptionSelectedFromProps = (state, props) => props.nextDateOptionSelected;

/**
 * @private Returns `cvsBrand` from props passed
 */
const getCvsBrandFromProps = (state, props) => props.cvsBrand;

/**
 * @private Returns `arrivesAt` from props passed
 */
const getCvsArrivesAtFromProps = (state, props) => props.arrivesAt;

const getSplitNoFromProps = (state, props) => props && props.splitNo;

const getSameDayDeliveryCharges = state => state.delivery.sameDayDeliveryCharges;

/**
 * Returns `isEditAddressForm` from props passed
 */
const getIsEditAddressFormFromProps = (state, props) => props.isEditAddressForm;

/**
 * Get the selected delivery method
 **/
export const getDeliveryMethod = state => state.delivery.deliveryMethod;

export const isSplitDeliveryAvailable = state => state.delivery.isSplitDeliveryAvailable;

export const isGroupDeliveryAvailable = state => state.delivery.isShippingGroupDeliveryAvailable;

/**
 * Get available split count
 **/
export const getSplitCount = state => state.delivery.splitCount;

export const getDeliveryPreference = state => state.delivery.deliveryPreference;

/**
 * Check if the currently selected store is disabled
 **/
export const getStoreClosedstatus = state => state.deliveryStore.pickupStoreData && state.deliveryStore.pickupStoreData.closed_flg === 1;

const getCurrentPickupStore = state => state.address.currentPickupStore;

/**
 * returns the delivery method list form state
 */
export const getDeliveryMethodList = state => state.delivery.deliveryMethodList;

/**
 * Get the selected delivery type applied from state
 **/
export const getDeliveryTypeApplied = state => state.delivery.deliveryTypeApplied;

/**
 * Get the shipping address from state
 **/
export const getShippingAddress = state => state.delivery.shippingAddress;

/**
 * Check if previousLocation is order review.
 **/
export const isPreviousLocationOrderReview = state => state.delivery.previousLocation === 'orderReview';

export const getAllSplitDetails = state => state.delivery.splitDetails;

/**
 * Get current shipping address object from the delivery reducer
 */
export const getCurrentShippingAddress = state => state.delivery.currentShippingAddress;

/**
 * Get the default address form state, this address it's saved on account platform
 */
export const getDefaultAddress = state => state.userInfo.userDefaultDetails;

/**
 * Get the delivery types
 **/
export const getAllDeliveryTypes = state => state.delivery.deliveryTypes;

/**
 * Returns `shouldSetBillingAddress` from `setOption` in delivery reducer
 */
export const getShouldSetBillingAddress = state => state.delivery.setOption.shouldSetBillingAddress;

export const isSplitDeliverySelected = createSelector(
  [getDeliveryPreference],
  deliveryPreference => deliveryPreference === SPLIT_DELIVERY
);

export const isGroupDeliverySelected = createSelector(
  [getDeliveryPreference],
  deliveryPreference => deliveryPreference === GROUP_DELIVERY
);

/**
 * Gets deliveryMethodList value for date time selection.
 * If splitNo is passed then deliveryMethodList of splitNo else deliveryMethodList of Group delivery
 */
export const getDeliveryMethodListOfDiv = createSelector(
  [getDeliveryMethodList, getSplitNoFromProps],
  (deliveryMethodList, splitNo) =>
  (splitNo
    ? (deliveryMethodList[splitNo] && deliveryMethodList[splitNo][SPLIT_DELIVERY])
    : deliveryMethodList[defaultSplitNumber][GROUP_DELIVERY])
);

/**
 * Gets deliveryStandard value. If splitNo is passed then deliveryStandard[splitNo] else deliveryStandard of Group delivery
 */
export const getStandardDeliveryOfDiv = createSelector(
  [getStandardDelivery, getSplitNoFromProps],
  (deliveryStandard, splitNo) =>
  (splitNo
    ? (deliveryStandard[splitNo] && deliveryStandard[splitNo][SPLIT_DELIVERY])
    : deliveryStandard[defaultSplitNumber][GROUP_DELIVERY])
);

/**
 * Gets deliveryMethod value. If splitNo is passed then deliveryMethod of splitNo else deliveryMethod of Group delivery
 */
export const getDeliveryMethodOfDiv = createSelector(
  [getDeliveryMethod, getSplitNoFromProps],
  (deliveryMethod, splitNo) => {
    let delMethod = deliveryMethod[0] || {};

    if (splitNo) {
      delMethod = deliveryMethod.find(item => item.splitNo === splitNo) || {};
    }

    return delMethod;
  }
);

/**
 * Gets updatedDeliveryMethodList value in case of next_day_delivery.
 * If splitNo is passed then updatedDeliveryMethodList of splitNo else updatedDeliveryMethodList of Group delivery
 */
export const getUpdatedDeliveryMethodListOfDiv = createSelector(
  [getUpdatedDeliveryMethodList, getSplitNoFromProps],
  (updatedDeliveryMethodList, splitNo) =>
  (splitNo
    ? (updatedDeliveryMethodList[splitNo] && updatedDeliveryMethodList[splitNo][SPLIT_DELIVERY])
    : updatedDeliveryMethodList[defaultSplitNumber][GROUP_DELIVERY])
);

/**
 * Check if delivery preference options are chosen and valid for each split.
 */
const checkIfPreferenceSelected = createSelector(
  [getDeliveryMethod, getStandardDelivery, isSplitDeliverySelected, getSplitCount],
  (deliveryMethod, deliveryStandard, isSplitDelivery, splitCount) => {
    const count = isSplitDelivery ? splitCount : 1;

    for (let i = 0; i < count; i++) {
      const standardDeliveryOfSplit = deliveryMethod[i] && deliveryStandard[deliveryMethod[i].splitNo];
      const isStandardDelivery = standardDeliveryOfSplit
        ? (isSplitDelivery && standardDeliveryOfSplit[SPLIT_DELIVERY] || standardDeliveryOfSplit[GROUP_DELIVERY])
        : false;

      if (!isPreferenceSelectedForEachSplit(deliveryMethod[i], isStandardDelivery)) {
        return false;
      }
    }

    return true;
  }
);

/**
 * Check if chosen delivery preference options are valid for each split.
 */
export const checkIfAllDeliveryMethodsValid = createSelector(
  [getDeliveryPreference, getDeliveryMethodList, getDeliveryMethod, checkIfPreferenceSelected],
  (deliveryPreference, deliveryMethodList, deliveryMethod, isPreferenceSelected) => {
    if (deliveryMethod.length && isPreferenceSelected) {
      return deliveryMethod.every(item => (
        deliveryMethodList[item.splitNo][deliveryPreference] && deliveryMethodList[item.splitNo][deliveryPreference].deliveryTypes.includes(item.deliveryType)
        )
      );
    }

    return false;
  }
);

/**
 * Gets splitDetails. If splitNo is passed then splitDetails of splitNo else splitDetails[1]
 */
export const getSplitDetailsOfDiv = createSelector(
  [getAllSplitDetails, getSplitNoFromProps],
  (splitDetails, splitNo) => (splitNo && splitDetails ? splitDetails[splitNo] : splitDetails[1])
);

/**
 * Gets deliveryType. If splitNo is passed then deliveryType of splitNo else deliveryType of Group delivery
 */
export const getDeliveryMethodType = createSelector(
  [getDeliveryMethodOfDiv],
  deliveryMethod => deliveryMethod.deliveryType
);

/**
 * Get cartItemsSeqNo from splitDetails for a split and return the item details.
 */
export const getItems = createSelector(
  [getAllSplitDetails, getCartItems, getSplitNoFromProps],
  (splitDetails, items, splitNo) =>
    ((splitNo && items) ? items.filter(item => splitDetails[splitNo] && splitDetails[splitNo].cartItemsSeqNo.includes(item.seqNo)) : [])
);

/**
 * Returns `nextDateOption` for a specific split.
 * If splitNo is passed then nextDateOption of splitNo else nextDateOption of Group delivery
 */
export const getNextDateOption = createSelector(
  [getSplitNoFromProps, getAllNextDateOptions],
  (splitNo, nextDateOptions) => (splitNo
    ? (nextDateOptions[splitNo] && nextDateOptions[splitNo][SPLIT_DELIVERY])
    : nextDateOptions[defaultSplitNumber][GROUP_DELIVERY])
);

/**
 * @private Checks if the user has selected a specific the delivery date
 */
const isDeliveryDateSelected = createSelector(
  [getDeliveryMethodOfDiv],
  deliveryMethod => deliveryMethod.deliveryReqDate && deliveryMethod.deliveryReqDate !== constants.NULL_TIMEFRAME
);

/**
 * @private  Checks if the user has selected a specific the delivery time
 */
const isDeliveryTimeSelected = createSelector(
  [getDeliveryMethodOfDiv],
  deliveryMethod => deliveryMethod.deliveryReqTime && deliveryMethod.deliveryReqTime !== constants.NULL_TIMEFRAME
);

/**
 * Returns the date_time list for shipping preference section, based on user choice.
 * ie. returns next_date details if user chose next_day_delivery else returns nominated_date_time details.
 * If splitNo is passed then details of splitNo else details of Group delivery
 */
export const getDeliveryDateTimeListForOption = createSelector(
  [getIfNextDateOptionSelectedFromProps, getNextDateOption, getUpdatedDeliveryMethodListOfDiv],
  (nextDateOptionSelected, nextDateOption, updatedDeliveryMethodList) => (
    nextDateOptionSelected ? nextDateOption : updatedDeliveryMethodList.deliveryRequestedDateTimes
  )
);

/**
 * Get delivery
 * @param state
 * @return {{ deliveryMethodList: DeliveryMethodList }}
 */
export const getDelivery = state => state.delivery;

/**
 * Checks if the selected delivery type it's any of the available shipping methods
 */
export const isShipping = createSelector(
  [getDeliveryMethodType],
  deliveryType => isShippingDeliveryType(deliveryType)
);

/**
 * Returns available deliveryTypes for a specific split
 * If splitNo is passed then deliveryTypes of splitNo else deliveryTypes of Group delivery
 */
export const getDeliveryTypesOfDiv = createSelector(
  [getDeliveryMethodListOfDiv],
  deliveryMethodList => (deliveryMethodList && deliveryMethodList.deliveryTypes) || []
);

/**
 * Checks if standard delivery method it's available
 * This selector is used to enable the standard delivery option when selecting delivery time
 */
export const isStandardDeliveryAvailable = createSelector(
  [getDeliveryTypesOfDiv],
  deliveryTypes => deliveryTypes.includes(SHIPPING)
);

/**
 * Checks if nominated date time selection is available for a particular split
 */
export const isCustomTimeFrameAvailable = createSelector(
  [isStandardDeliveryAvailable, getDeliveryMethodListOfDiv],
  (isStandardDeliveryAvailablee, deliveryMethodList) =>
  !!(isStandardDeliveryAvailablee && deliveryMethodList.deliveryRequestedDateTimes && deliveryMethodList.deliveryRequestedDateTimes.length)
);

/**
 * Checks if there's a delivery type selected
 */
export const isDeliveryTypeSelected = createSelector(
  [getDeliveryMethodType],
  deliveryType => !!deliveryType
);

/**
 * Check if the current user has a valid name, this means it's a returned user
 */
export const isReturnedUser = createSelector(
  [getCurrentShippingAddress],
  currentShippingAddress => !!(currentShippingAddress && currentShippingAddress.lastNameKatakana && currentShippingAddress.firstNameKatakana));

/**
 * Check if delivery type is CVS.
 **/
export const isDeliveryTypeCvs = createSelector(
  [getDeliveryMethodType], deliveryType =>
  isCVSDeliveryType(deliveryType)
);

/**
 * Get store address for display in panel from the store address in global state
 **/
export const getCvsStoreAddresses = createSelector(
  [getCvsAddress], cvsAddress => cvsAddress && buildCvsStoreAddress(cvsAddress)
);

/**
 * Get shiping fee for delivery type CVS using shipping threshold fee and total amount
 **/
export const getCvsShippingFee = createSelector(
  [getShippingThreshold, getOrderTotal, isFirstOrder],
  (shippingThreshold, totalAmount, firstOrderFlag) =>
  getShippingFee(SEJ, { shippingThreshold, totalAmount, isFirstOrder: firstOrderFlag })
);

/**
 * Get routing url fot the external CVS selection site.
 **/
export const getCvsUrls = createSelector(
  [getDefaultAddress, getUserInfoAddressList, getCvsAddress],
  (defaultAddress, userInfoAddressList, cvsAddress) =>
  buildCvsUrls(defaultAddress, userInfoAddressList, cvsAddress)
);

/**
 * Get routing url fot the top pages of external CVS selection sites.
 **/
export const getTopPageCvsUrls = createSelector(
  [getDefaultAddress, getUserInfoAddressList, getCvsAddress],
  (defaultAddress, userInfoAddressList, cvsAddress) =>
  buildCvsUrls(defaultAddress, userInfoAddressList, cvsAddress, true)
);

/**
 * Get expected delivery date for CVS delivery types
 **/
const getCvsDeliveryDate = createSelector(
  [getDeliveryMethodListOfDiv, getDeliveryTypeApplied],
  (deliveryMethodList, deliveryTypeApplied) => ({
    [SEJ]: getDelvDateTime(SEJ, { deliveryMethodList, deliveryTypeApplied }),
    [FM]: getDelvDateTime(FM, { deliveryMethodList, deliveryTypeApplied }),
    [LAWSON]: getDelvDateTime(LAWSON, { deliveryMethodList, deliveryTypeApplied }),
  })
);

/**
 * Get expected delivery date in CVS address panel display
 **/
export const getCvsAddressDeliveryDescription = createSelector(
  [getDeliveryTypeApplied, getCvsDeliveryDate],
  (deliveryTypeApplied, cvsDeliveryDate) =>
  (isCVSDeliveryType(deliveryTypeApplied) && cvsDeliveryDate[deliveryTypeApplied] ? cvsDeliveryDate[deliveryTypeApplied] : '')
);

/**
 * Get is STORE_PICKUP delievry selected
 **/
export const getIsStorePickupSelected = createSelector(
  [getDeliveryMethodType, isEditDeliveryOption], (deliveryType, isEditDeliveryOptionn) =>
    !!(deliveryType === STORE_PICKUP && !isEditDeliveryOptionn)
);

/**
* Get planned delivery date and time for STORE_PICKUP delivery
 **/
export const getStorePickupDeliveryDate = createSelector(
  [getDeliveryMethodListOfDiv, getDeliveryTypeApplied],
  (deliveryMethodList, deliveryTypeApplied) =>
    getDelvDateTime(STORE_PICKUP, { deliveryTypeApplied, deliveryMethodList })
);

/**
* Get delivery lead date and time for STORE_PICKUP delivery
 **/
export const getStorePickupDeliveryDescription = createSelector(
  [getDeliveryTypeApplied, getStorePickupDeliveryDate], (deliveryTypeApplied, plannedDateTime) => (
    deliveryTypeApplied === STORE_PICKUP
      ? plannedDateTime
      : ''
  )
);

/**
 * Get STORE_PICKUP shipping fee
 **/
export const getPickupStoreShippingFee = createSelector(
  [getShippingThreshold, getOrderTotal, isFirstOrder],
  (shippingThreshold, totalAmount, firstOrderFlag) =>
    getShippingFee(STORE_PICKUP, { shippingThreshold, totalAmount, isFirstOrder: firstOrderFlag })
);

/**
 * Get pickup Store Address
 **/
export const getCurrentPickupStoreOfBrand = createSelector(
  [getCurrentPickupStore, getBrand],
  (currentPickupStore, brand) => currentPickupStore[brand]
);

export const isDefaultAddressComplete = createSelector(
  [getDefaultAddress],
  defaultAddress => isUserDefaultAddressComplete(defaultAddress)
);

/**
 * Check if the default address from account platform it's valid
 */
export const isDefaultAddressValid = createSelector(
  [isDefaultAddressComplete, isFromAddressBook],
  (isAddressComplete, isFromAddressBookk) => isAddressComplete && isFromAddressBookk);

/**
 * Check if the user it's currently selecting the address options, such as timeframe
 */
export const isEditingAddressOptions = createSelector(
  [isReturnedUser, isDefaultAddressValid, isDeliveryTypeSelected, state => state.delivery],
  (isReturnUser, isAddressValid, isDeliverySelected, delivery) => (
    isReturnUser && !(delivery.isEditDeliveryAddress || delivery.isEditDeliveryOption || isAddressValid || !isDeliverySelected)));

/**
 * Returns status of available cvs stores.
 **/
export const getAvailableCvsBrands = createSelector(
  [getAllDeliveryTypes],
  deliveryTypes => ({
    sevenEleven: deliveryTypes && deliveryTypes.includes(SEJ),
    lawson: deliveryTypes && deliveryTypes.includes(LAWSON),
    familyMart: deliveryTypes && deliveryTypes.includes(FM),
  })
);

/**
 * Check if user has atleast one user address
**/
export const getIfReturnCVSUser = createSelector(
  [getCvsStoreAddresses, getAvailableCvsBrands],
  (cvsStoreAddresses, availableBrands) =>
  !!(Object.keys(availableBrands).find(brand => availableBrands[brand] && cvsStoreAddresses[brand]))
);

/**
 * Checks if Yu Packet delivery option is available
 * Only show YuPacket option if all splits have yu packet option
 */
export const isYuPacketAvailable = createSelector(
  [getDeliveryTypesOfDiv, isSplitDeliverySelected, getDeliveryMethodList],
  (deliveryTypes, isSplitDelivery, deliveryMethodList) => {
    let shouldShowYuPacket = true;

    if (isSplitDelivery) {
      shouldShowYuPacket = Object.entries(deliveryMethodList).every(option =>
        option &&
        option.length &&
        option[1][SPLIT_DELIVERY] &&
        option[1][SPLIT_DELIVERY].deliveryTypes &&
        option[1][SPLIT_DELIVERY].deliveryTypes.includes(YU_PACKET)
      );
    }

    return deliveryTypes.includes(YU_PACKET) && shouldShowYuPacket;
  }
);

/**
 * Checks if same day delivery method it's available
 * This selector is used to enable the same day delivery option when selecting delivery time
 */
export const isSameDayAvailable = createSelector(
  [isGiftApplied, getDeliveryTypesOfDiv],
  (isGiftAppliedd, deliveryTypes) => !isGiftAppliedd && deliveryTypes.includes(SAME_DAY)
);

/**
 * This selector is used to enable the next_day_delivery option if available.
 */
export const isNextDayAvailable = createSelector(
  [isStandardDeliveryAvailable, getNextDateOption],
  (isStandardDeliveryAvailablee, nextDateOption) => !!(isStandardDeliveryAvailable && nextDateOption)
);

/**
 * To promote nextDay delivery option, we redirect user to delivery page upon checkout in each session.
 * To avoid resetting user's delivery preferences everytime, each the session begins nextday is available to user in the shipping preference section.
 * Flag is set in both cases if user chooses or ignores next day option.
 */
export const shouldSetNextDaySession = createSelector(
  [isNextDayAvailable, getAllNextDateOptions, getDeliveryPreference],
  (isNextDayAvailablee, nextDateOptions, preference) => (preference === GROUP_DELIVERY
    ? isNextDayAvailablee
    : !!Object.entries(nextDateOptions).find(option => !!(option && option.length && option[1][SPLIT_DELIVERY]))
  )
);

export const shouldShowNextDay = createSelector(
  [isUniqlo, isNextDayAvailable],
  (isUQCart, isNextDayAvailablee) => isUQCart || isNextDayAvailablee
);

/**
 * This selector is used to decide if timeframe and preference component should be shown in delivery page.
 */
export const isNotStoreOrCvsDelvType = createSelector(
  [getDeliveryMethodType],
  deliveryType => !([SEJ, LAWSON, FM, STORE_PICKUP].includes(deliveryType))
);

/**
 * Checks if the user has a custom date and timeframe selected for shipping method
 */
export const isCustomTimeFrameSelected = createSelector(
  [isShipping, getDeliveryMethodOfDiv, isDeliveryDateSelected, isDeliveryTimeSelected],
  (isShippingg, deliveryMethod, isDeliveryDateSelectedd, isDeliveryTimeSelectedd) => (
    !!(
      // Is this shipping and delivery method selected?
      isShippingg && deliveryMethod
      // Is time or date selected?
      && (isDeliveryTimeSelectedd || isDeliveryDateSelectedd)
    )
  )
);

/**
 * Checks if the current shipping selection it's YuPacket
 */
export const isYuPacketSelected = createSelector(
  [getDeliveryMethodType, isYuPacketAvailable],
  (deliveryType, yuPacketAvailable) => (yuPacketAvailable && deliveryType === YU_PACKET)
);

/**
 * Get Yu Packet delivery option text
 */
export const getYuPacketText = createSelector(
  [getDeliveryMethodOfDiv],
  deliveryMethod => (deliveryMethod.deliveryType === YU_PACKET
    ? getTranslation().checkout.yuExplanatoryText
    : null));

/**
 * Checks if the current shipping selection it's same day delivery
 */
export const isSameDaySelected = createSelector(
  [getDeliveryMethodType, isSameDayAvailable],
  (deliveryType, sameDayAvailable) => (sameDayAvailable && deliveryType === SAME_DAY)
);

/**
 * Checks if Nekopos Packet delivery option is available
 * Only show Nekoposu option if all splits have Nekoposu option
 * Regarding option[1][SPLIT_DELIVERY] :
 * state.delivery.deliveryMethodList is an object and each variable iterate as option looks like this.
   1: {
     C: {
       deliveryRequestedDateTimes: [],
       deliveryTypes: [],
       deliveryDetails: []
     },
     S: {
       deliveryRequestedDateTimes: [],
       deliveryTypes: [],
       deliveryDetails: []
     }
   }
 * Since we want the options for split-delivery here, we check option[1][SPLIT_DELIVERY].deliveryTypes.includes(YAMATO_MAIL);
 */
export const isNekoposPacketAvailable = createSelector(
  [getDeliveryTypesOfDiv, isSplitDeliverySelected, getDeliveryMethodList],
  (deliveryTypes, isSplitDelivery, deliveryMethodList) => {
    let shouldShowNekoposPacket = true;

    if (isSplitDelivery) {
      shouldShowNekoposPacket = Object.entries(deliveryMethodList).every(option =>
        option &&
        option.length &&
        option[1][SPLIT_DELIVERY] &&
        option[1][SPLIT_DELIVERY].deliveryTypes &&
        option[1][SPLIT_DELIVERY].deliveryTypes.includes(YAMATO_MAIL)
      );
    }

    return deliveryTypes.includes(YAMATO_MAIL) && shouldShowNekoposPacket;
  }
);

/**
 * Checks if the current shipping selection is Nekopos
 */
export const isNekoposPacketSelected = createSelector(
  [getDeliveryMethodType, isNekoposPacketAvailable],
  (deliveryType, nekoposPacketAvailable) =>
    nekoposPacketAvailable && deliveryType === YAMATO_MAIL
  );

/**
 * Get Nekopos Packet delivery option text
 * @return {?Array<{type: string, text: string}>}
 */
export const getNekoposPacketText = createSelector(
  [isNekoposPacketSelected],
  nekoposPacketSelected => (nekoposPacketSelected
    ? getTranslation().checkout.nekoposExplanatoryText
    : null));

/**
 * Checks if standard delivery is selected
 */
export const isStandardDeliverySelected = createSelector(
 [isStandardDeliveryAvailable, getDeliveryMethodType, getStandardDeliveryOfDiv],
 (isStandardAvailable, deliveryType, deliveryStandard) =>
  !!(isStandardAvailable && deliveryType && deliveryStandard)
);

/**
 * Get the CVS address if current delivery method it's CVS
 **/
export const getCvsAddressToDisplay = createSelector(
  [isReturnedUser, getDeliveryMethodType, getCurrentShippingAddress, getShippingAddress],
  (isReturnUser, deliveryType, currentShippingAddress, shippingAddress) => (
    isReturnUser && isCVSDeliveryType(deliveryType)
      ? { ...currentShippingAddress, ...shippingAddress }
      : {}
  ));

/**
 * Get the shipping address to display when displaying the selected method on delivery page.
 */
export const getShippingAddressToDisplay = createSelector(
  [isReturnedUser, isShipping, getCurrentShippingAddress, getDefaultAddress, getShippingAddress],
  (isReturnUser, isShippingMethod, currentShippingAddress, defaultAddress, shippingAddress) => {
    const addressToDisplay = isReturnUser && isShippingMethod
      ? currentShippingAddress
      : defaultAddress;

    return { ...addressToDisplay, ...shippingAddress };
  }
);

/**
 * Get the shipping address to display when displaying the selected method on delivery page.
 */
export const getShippingAddressFormValues = createSelector(
  [getDefaultAddress, getShippingAddress],
  (defaultAddress, shippingAddress) => ({ ...defaultAddress, ...shippingAddress })
);

/**
 * Checks if there's a user address or valid default address on account platform, this means we need to show the address book on delivery page
 **/
export const isAddressBookAvailable = createSelector(
  [getUserInfoAddressList, isDefaultAddressComplete],
  (userInfoAddressList, hasValidDefaultAddress) => (
    !!(userInfoAddressList && userInfoAddressList.length || hasValidDefaultAddress)
  ));

/**
 * Checks whether to show the address form or the adddess book, if shipping delivery method is selected
 * and the user it's not selecting delivery options.
 */
export const isEditingShippingAddress = createSelector(
  [isShipping, isEditDeliveryOption, isEditDeliveryAddress, isFromAddressBook],
  (isShippingg, isEditDeliveryOptionn, isEditDeliveryAddresss, isFromAddressBookk) => (
    isShippingg && !isEditDeliveryOptionn && (isEditDeliveryAddresss || isFromAddressBookk)
  ));

/**
 * Decides if we need to show the address book or not
 */
export const shouldShowAddressBook = createSelector(
  [isEditingShippingAddress, isAddressBookAvailable],
  (isEditingShippingAddresss, isAddressBookAvailablee) => isEditingShippingAddresss && isAddressBookAvailablee
);

/**
 * Decides if we need to show the address form or not when the user is editing delivery method
 */
export const shouldShowAddressForm = createSelector(
  [isEditingShippingAddress, isAddressBookAvailable],
  (isEditingShippingAddresss, isAddressBookAvailablee) => isEditingShippingAddresss && !isAddressBookAvailablee
);

/**
 * Checks if delivery method options should be displayed or not.
 */
export const isDeliveryOptionsEnabled = createSelector(
  [isReturnedUser, isDefaultAddressValid, isDeliveryTypeSelected, state => state.delivery],
  (isReturnUser, isDefaultAddressValidd, isDeliveryTypeSelectedd, delivery) => (
    delivery.isEditDeliveryAddress || delivery.isEditDeliveryOption || !isReturnUser || isDefaultAddressValidd || !isDeliveryTypeSelectedd
  ));

/**
 * Get the planned dates for the delivery type - delivery page address panel display
 */
export const getPlannedDates = createSelector(
  [isShipping, getDeliveryMethodType, getDeliveryMethodListOfDiv, getDeliveryTypeApplied],
  (isShippingg, deliveryType, deliveryMethodList, deliveryTypeApplied) => (
    !isShippingg ? getDelvDateTime(deliveryType, {
      deliveryMethodList,
      deliveryTypeApplied,
    }) : '')
);

/**
 * Returns true if delivery method: Shipping is selected.
 * This selector is used to select the selectbox component on delivery page.
 */
export const isShippingMethodSelected = createSelector(
  [isShipping, isEditDeliveryOption, shouldShowAddressBook, shouldShowAddressForm],
  (isShippingg, isEditDeliveryOptionn, isAddressBookVisible, isAddressFormVisible) =>
  isShippingg && !isEditDeliveryOptionn && (isAddressBookVisible || isAddressFormVisible)
);

/**
 * Get's the delivery shipping address based on the delivery type
 */
export const getDeliveryShippingAddress = createSelector(
  [getShippingAddressToDisplay, getDeliveryMethodType, getCurrentShippingAddress, getCvsAddressToDisplay],
  (shippingAddress, deliveryType, currentShippingAddress, cvsDisplayAddress) => {
    let deliveryShippingAddress = shippingAddress;

    switch (deliveryType) {
      case SHIPPING:
      case YU_PACKET:
      case SAME_DAY:
      case STORE_PICKUP:
      case YAMATO_MAIL:
        deliveryShippingAddress = currentShippingAddress;
        break;
      case SEJ:
      case FM:
      case LAWSON:
        deliveryShippingAddress = cvsDisplayAddress;
        break;
      default:
        deliveryShippingAddress = shippingAddress;
        break;
    }

    return deliveryShippingAddress;
  }
);

/**
 * Shipping fee config
 */
const getShippingFeeParams = createSelector(
  [getShippingThreshold, getOrderTotal, isFirstOrder],
  (shippingThreshold, totalAmount, firstOrderFlag) => (
    {
      shippingThreshold,
      totalAmount,
      i18n: getTranslation(),
      isFirstOrder: firstOrderFlag,
    }
  )
);

/**
 * Calculate shipping fees
 */
export const getShippingFees = createSelector(
  [getShippingFeeParams, getSameDayDeliveryCharges],
  (shippingFeeParams, sameDayDeliveryCharges) => ({
    [SAME_DAY]: getShippingFee(SAME_DAY, shippingFeeParams, sameDayDeliveryCharges),
    [SHIPPING]: getShippingFee(SHIPPING, shippingFeeParams),
    [YU_PACKET]: getShippingFee(YU_PACKET, shippingFeeParams),
    [YAMATO_MAIL]: getShippingFee(YAMATO_MAIL, shippingFeeParams),
  })
);

/**
 * Calculate shipping descriptions
 */
export const getShippingDescriptions = createSelector(
  [getDeliveryMethodListOfDiv],
  deliveryMethodList => ({
    [SAME_DAY]: getShippingMethodDescription({ shippingType: 'today', deliveryMethodList }),
    [SHIPPING]: getShippingMethodDescription({ shippingType: 'defaultDelivery', deliveryMethodList }),
    [YU_PACKET]: getShippingMethodDescription({ shippingType: 'yuPacket', deliveryMethodList }),
    [YAMATO_MAIL]: getShippingMethodDescription({ shippingType: 'nekoposPacket', deliveryMethodList }),
  })
);

/**
 * Get the date and time the user has selected for delivery (Shipping method)
 */
export const getSelectedDeliveryTime = createSelector(
  [isCustomTimeFrameSelected, getDeliveryMethodOfDiv, getDeliveryMethodListOfDiv],
  (isTimeFrameSelected, deliveryMethod, deliveryMethodList) => (
    isTimeFrameSelected
      ? getShippingMethodDescription({ shippingType: 'selectedDelivery', deliveryMethodList, deliveryMethod })
      : ''
  )
);

/**
 * Get the next_day_delivery date and time the user has selected for delivery (Shipping method)
 */
export const getSelectedNextDeliveryTime = createSelector(
  [isNextDayAvailable, getDeliveryMethodOfDiv, getNextDateOption, getSelectedDeliveryTime],
  (isNextDayAvailablee, deliveryMethod, nextDateOption, selectedDeliveryTime) => (
    (isNextDayAvailablee && deliveryMethod.deliveryReqDate && deliveryMethod.deliveryReqDate === nextDateOption[0].date)
      ? selectedDeliveryTime
      : ''
    )
);

/**
 * Checks if the current shipping selection is next_day_delivery
 */
export const isNextDaySelected = createSelector(
  [isNextDayAvailable, getDeliveryMethodType, getSelectedNextDeliveryTime],
  (isNextDayAvailablee, deliveryType, selectedNextDayDeliveryTime) =>
  !!(isNextDayAvailablee && deliveryType === SHIPPING && selectedNextDayDeliveryTime)
);

/**
 * Checks if the selected delivery type it's any of the available shipping methods
 */
export const getPossibleShippingMethods = createSelector(
  [getAllDeliveryTypes],
  (deliveryTypes) => {
    const cvs = ['15', '13', '18'];
    const pickup = ['11'];

    return {
      isShipping: areIntersecting(deliveryTypes, shippingTypes),
      isCvs: areIntersecting(deliveryTypes, cvs),
      isPickup: areIntersecting(deliveryTypes, pickup),
    };
  }
);

/**
 * For some GU products, the standard delivery time is not available, but instead Yamato Mail,
 * in this case we need to return Yamato Mail isntead. If standard delivery is present we should
 * always return its value.
 - address
 */
export const getShippingArivesAt = createSelector(
  [isGU, getDeliveryMethodList, getDeliveryTypeApplied, isSplitDeliverySelected],
  (isGu, deliveryMethodList, deliveryTypeApplied, isSplitDelivery) => {
    let delList;

    if (isSplitDelivery) {
      delList = deliveryMethodList[defaultSplitNumber][SPLIT_DELIVERY];
    } else {
      delList = deliveryMethodList[defaultSplitNumber][GROUP_DELIVERY];
    }

    const shippingDates = getDelvDateTime(SHIPPING, { deliveryMethodList: delList, deliveryTypeApplied: '' }, true);
    const yamatoMailDates = getDelvDateTime(YAMATO_MAIL, { deliveryMethodList: delList, deliveryTypeApplied });

    // For GU only, if standard delivery is not present,
    // we need to return yamato mail.
    if (isGu && !shippingDates) {
      return yamatoMailDates;
    }

    return shippingDates;
  }
);

/**
 * Check if delivery lead time is available in props
 * and CVS brand from props is same as the applied CVS brand.
 */
export const shouldShowCvsArrivesAt = createSelector(
  [getDeliveryTypeApplied, getCvsBrandFromProps, getCvsArrivesAtFromProps],
  (appliedDeliveryType, cvsBrand, arrivesAt) => {
    const cvsBrandInProps = getCvsAPIConfigInfo(cvsBrand);

    return !!(arrivesAt && appliedDeliveryType === cvsBrandInProps.type);
  }
);

/**
 * Check if save billing addess check box should be shown in address form.
 */
export const shouldShowAddressCheckBox = createSelector(
  [isDefaultAddressComplete, getIsEditAddressFormFromProps],
  (isAddressValid, isEditAddressForm) => !(isAddressValid || isEditAddressForm)
);

/**
 * Checks if we need to show next day instruction message and link
 */
export const shouldShowNextDayMessage = createSelector(
  [isDeliveryTypeCvs, getIsStorePickupSelected, isShippingMethodSelected, isEditingAddressOptions, isUniqlo],
  (isDeliveryTypeCvss, isStorePickupSelected, isShippingMethodSelectedd, isEditingAddressOptionss, isUniqloCart) =>
  !(isDeliveryTypeCvss || isStorePickupSelected || isShippingMethodSelectedd || isEditingAddressOptionss) && isUniqloCart
);
