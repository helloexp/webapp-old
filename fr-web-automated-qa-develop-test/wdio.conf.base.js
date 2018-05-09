/**
 *
 * wdio.conf.base.js
 * Basic test configuration file that will be extended by specific environment test configuration files
 *
 */
exports.config = {

  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.

  suites: {

    smoke: [
      './e2e/features/UQ/newUser/shipto/ACC2-GC-couponAndStandardWithGifting.feature',
      './e2e/features/UQ/newUser/shipto/ACC8-GC-CC-standard.feature',
      './e2e/features/UQ/newUser/shipto/ACC15-GC-CC-bydateAndCouponAndGifting.feature',
      './e2e/features/UQ/newUser/shipto/ACC18-PS-bydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC19-COD-nextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC26-GC-CC-giftingAndNextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC34-GC-CC-couponAndYupacket.feature',
      './e2e/features/UQ/newUser/UQstore/ACC39-CC-couponAndUQStoreWithGifting.feature',
      './e2e/features/UQ/newUser/UQstore/ACC42-GC-CC-UQStore.feature',
      './e2e/features/UQ/newUser/cvs/ACC49-GC-CC-giftingAndSevenEleven.feature',
      './e2e/features/UQ/newUser/cvs/ACC56-GC-CC-familymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC62-GC-CC-couponAndLawson.feature',
      './e2e/features/GU/newUser/shipto/ACC65-COD-standardAndGifting.feature',
      './e2e/features/GU/newUser/shipto/ACC66-CC-standardAndCouponAndGifting.feature',
      './e2e/features/GU/newUser/shipto/ACC67-COD-bydate.feature',
      './e2e/features/GU/newUser/shipto/ACC69-CC-nekopos.feature',
      './e2e/features/UQ/newUser/shipto/ACC143-deferred-nextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC222-CC-SD-validatingSplitdeliveryChanges.feature',

    ],

    smokeExisting: [
      './e2e/features/UQ/returningUser/shipto/ACC70-COD-standardAndGiftingWithCoupon.feature',
      './e2e/features/UQ/returningUser/shipto/ACC84-GC-CC-bydateAndCouponAndGifting.feature',
      './e2e/features/GU/returningUser/shipto/ACC88-CC-nekopos.feature', 
      './e2e/features/UQ/returningUser/shipto/ACC96-GC-CC-nextdayWithGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC104-GC-CC-yupacket.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC111-GC-CC-UQStore.feature',
      './e2e/features/UQ/returningUser/cvs/ACC119-GC-CC-sevenElevenAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC128-GC-CC-familyMart.feature',
      './e2e/features/UQ/returningUser/cvs/ACC135-GC-CC-lawsonAndGifting.feature',
      './e2e/features/GU/returningUser/shipto/ACC139-CC-standardWIthGiftingAndCoupon.feature', //Coupon not available
      './e2e/features/GU/returningUser/shipto/ACC140-COD-bydate.feature',
      './e2e/features/UQ/returningUser/shipto/ACC215-CC-SD-bydateAndSameday.feature'
    ],

    regression: [
      './e2e/features/UQ/newUser/shipto/ACC1-COD-couponAndStandard.feature',
      './e2e/features/UQ/newUser/shipto/ACC4-GC-standard.feature',
      './e2e/features/UQ/newUser/shipto/ACC5-CC-standardAndGifting.feature',
      './e2e/features/UQ/newUser/shipto/ACC9-PS-couponAndStandardwithGifting.feature',
      './e2e/features/UQ/newUser/shipto/ACC10-COD-bydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC11-GC-giftingAndBydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC13-GC-bydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC14-CC-couponAndBydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC17-GC-CC-bydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC20-GC-giftingAndNextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC22-GC-CC-giftingAndNextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC23-CC-couponAndNextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC24-GC-CC-nextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC25-GC-CC-nextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC27-PS-couponAndNextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC28-GC-yupacket.feature',
      './e2e/features/UQ/newUser/shipto/ACC30-GC-yupacket.feature',
      './e2e/features/UQ/newUser/shipto/ACC31-CC-couponAndYupacket.feature',
      './e2e/features/UQ/newUser/shipto/ACC35-PS-yupacket.feature',
      './e2e/features/UQ/newUser/UQstore/ACC36-GC-UQStoreAndGifting.feature',
      './e2e/features/UQ/newUser/UQstore/ACC38-GC-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC43-PS-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC205-PS-UQStoreLinkvalidation.feature',
      './e2e/features/UQ/newUser/cvs/ACC44-GC-couponAndSevenElevenWithGifting.feature',
      './e2e/features/UQ/newUser/cvs/ACC46-GC-giftingAndSevenEleven.feature',
      './e2e/features/UQ/newUser/cvs/ACC47-CC-giftingAndSevenEleven.feature',
      './e2e/features/UQ/newUser/cvs/ACC50-GC-CC-sevenEleven.feature',
      './e2e/features/UQ/newUser/cvs/ACC51-GC-couponAndFamilymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC53-GC-couponAndFamilymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC54-CC-familymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC58-GC-couponAndLawson.feature',
      './e2e/features/UQ/newUser/cvs/ACC60-GC-lawson.feature',
      './e2e/features/UQ/newUser/cvs/ACC61-CC-lawsonWithGifting.feature',
      './e2e/features/GU/newUser/shipto/ACC68-CC-bydateAndCoupon.feature',
      './e2e/features/GU/newUser/shipto/ACC147-deferred-bydateWithGiftingAndCoupon.feature',
      './e2e/features/UQ/newUser/cvs/ACC203-CC-ministopLawson.feature',
      './e2e/features/UQ/newUser/UQstore/ACC206-PS-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC207-PS-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC209-PS-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC208-PS-UQStore.feature',
      './e2e/features/UQ/newUser/shipto/ACC212-CC-SD-nextdayAndStandard.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC-229.feature'
    ],

    regressionExisting: [
      './e2e/features/UQ/returningUser/shipto/ACC73-GC-standard.feature',
      './e2e/features/UQ/returningUser/shipto/ACC74-CC-standardWithGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC77-GC-CC-standard.feature',
      './e2e/features/UQ/returningUser/shipto/ACC78-PS-standardWithGiftingAndCoupon.feature',
      './e2e/features/UQ/returningUser/shipto/ACC79-COD-bydate.feature',
      './e2e/features/UQ/returningUser/shipto/ACC82-GC-bydate.feature',
      './e2e/features/UQ/returningUser/shipto/ACC83-CC-bydateAndCoupon.feature',
      './e2e/features/UQ/returningUser/shipto/ACC87-PS-bydateAndCoupon.feature',
      './e2e/features/UQ/returningUser/shipto/ACC89-COD-nextday.feature',
      './e2e/features/UQ/returningUser/shipto/ACC92-GC-nextday.feature',
      './e2e/features/UQ/returningUser/shipto/ACC93-CC-couponAndNextdayWithGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC97-PS-couponAndNextday.feature',
      './e2e/features/UQ/returningUser/shipto/ACC98-GC-yupacket.feature',
      './e2e/features/UQ/returningUser/shipto/ACC101-CC-couponAndYupacket.feature',
      './e2e/features/UQ/returningUser/shipto/ACC105-PS-couponAndYupacket.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC106-GC-UQStoreAndGifting.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC109-CC-UQStoreAndCouponAndGifting.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC112-GC-CC-UQStore.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC113-PS-UQStore.feature',
      './e2e/features/UQ/returningUser/cvs/ACC116-GC-sevenElevenAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC117-CC-sevenElevenAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC120-GC-CC-sevenEleven.feature',
      './e2e/features/UQ/returningUser/cvs/ACC121-PS-sevenEleven.feature',
      './e2e/features/UQ/returningUser/cvs/ACC124-GC-couponAndFamilyMart.feature',
      './e2e/features/UQ/returningUser/cvs/ACC125-CC-familyMartAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC129-PS-familyMart.feature',
      './e2e/features/UQ/returningUser/cvs/ACC132-GC-lawson.feature',
      './e2e/features/UQ/returningUser/cvs/ACC133-CC-lawsonAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC136-GC-CC-lawson.feature',
      './e2e/features/GU/returningUser/shipto/ACC138-COD-standardWithGifting.feature',
      //'./e2e/features/GU/returningUser/shipto/ACC141-CC-bydateAndCoupon.feature',
      // './e2e/features/GU/returningUser/shipto/ACC186-deferred-bydateWithGiftingAndCoupon.feature',
      './e2e/features/UQ/returningUser/shipto/ACC202-CC-standard-editCreditCard.feature',
      './e2e/features/UQ/returningUser/cvs/ACC204-GC-CC-ministopLawson.feature',
    ],

    apiErrorHandling: [
      './e2e/features/UQ/newUser/shipto/ACC151-GC-giftCardIsUnset.feature'
    ],

    validation: [
      './e2e/features/UQ/newUser/shipto/ACC152-validateNewShippingFormMandatoryData.feature',
      './e2e/features/UQ/newUser/shipto/ACC153-validateNewShippingFormInvalidData.feature',
      './e2e/features/UQ/returningUser/shipto/ACC154-validateShippingFormMandatoryData.feature',
      './e2e/features/UQ/newUser/shipto/ACC156-CC-validateCreditCardForm.feature',
      './e2e/features/UQ/newUser/shipto/ACC157-CC-validateNewCreditCardForm.feature',
      './e2e/features/UQ/newUser/shipto/ACC158-validateMySizeFieldsWithValidData.feature',
      './e2e/features/UQ/newUser/shipto/ACC159-validateMySizeFieldsWithInvalidData.feature',
      './e2e/features/UQ/newUser/shipto/ACC160-GC-validateGiftCardInfoNotDisplayedOnCartPage.feature',
      './e2e/features/GU/newUser/shipto/ACC161-COD-validateNewShippingFormMandatoryData.feature',
      './e2e/features/UQ/newUser/shipto/ACC163-GC-validateGiftCardForm.feature',
      './e2e/features/UQ/newUser/shipto/ACC164-shippingNotAsBillingAndUqStoreCancel.feature',
      './e2e/features/UQ/newUser/shipto/ACC165-COD-validateDeliveryAfterMemberEditAdderss.feature',
      './e2e/features/UQ/newUser/shipto/ACC166-GC-CC-validateGiftCardAndCreditCard.feature',
      './e2e/features/UQ/newUser/shipto/ACC167-shippingNotAsBillingAndUqStoreUpdateQuantity.feature',
      //'./e2e/features/UQ/newUser/shipto/ACC168-validateEditDeliveryOption.feature',
      //'./e2e/features/UQ/newUser/cvs/ACC169-validatePaymentOptions.feature',
      './e2e/features/UQ/returningUser/shipto/ACC170-GC-CC-validatePaymentPageErrorMessages.feature',
      './e2e/features/UQ/newUser/shipto/ACC171-GC-CC-validateGiftCardCreditCardErrorMessages.feature',
      './e2e/features/UQ/newUser/cvs/ACC172-GC-cvsAllThreeStoresAndGiftCardValidation.feature',
      //'./e2e/features/UQ/newUser/shipto/ACC173-validateRecentlyViewed.feature',
      './e2e/features/UQ/returningUser/shipto/ACC174-validateDeliveryAddressChange.feature',
      './e2e/features/UQ/newUser/shipto/ACC188-GC-validateMandatoryFields.feature',
      './e2e/features/UQ/newUser/shipto/ACC189-GC-validateReceipt.feature'
    ],

    nightjob: [
     './e2e/features/UQ/newUser/shipto/ACC1-COD-couponAndStandard.feature',
 	    './e2e/features/UQ/newUser/shipto/ACC2-GC-couponAndStandardWithGifting.feature',
     './e2e/features/UQ/newUser/shipto/ACC3-GC-standard.feature',
      './e2e/features/UQ/newUser/shipto/ACC4-GC-standard.feature',
      './e2e/features/UQ/newUser/shipto/ACC5-CC-standardAndGifting.feature',
      './e2e/features/UQ/newUser/shipto/ACC6-GC-CC-couponAndstandard.feature',
      './e2e/features/UQ/newUser/shipto/ACC7-GC-CC-standard.feature',
      './e2e/features/UQ/newUser/shipto/ACC8-GC-CC-standard.feature',
      './e2e/features/UQ/newUser/shipto/ACC9-PS-couponAndStandardwithGifting.feature',
      './e2e/features/UQ/newUser/shipto/ACC10-COD-bydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC11-GC-giftingAndBydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC12-GC-bydate.feature',
	    './e2e/features/UQ/newUser/shipto/ACC13-GC-bydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC14-CC-couponAndBydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC15-GC-CC-bydateAndCouponAndGifting.feature',
      './e2e/features/UQ/newUser/shipto/ACC16-GC-CC-bydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC17-GC-CC-bydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC18-PS-bydate.feature',
      './e2e/features/UQ/newUser/shipto/ACC19-COD-nextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC20-GC-giftingAndNextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC21-GC-nextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC22-GC-CC-giftingAndNextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC23-CC-couponAndNextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC24-GC-CC-nextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC25-GC-CC-nextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC26-GC-CC-giftingAndNextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC27-PS-couponAndNextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC28-GC-yupacket.feature',
      './e2e/features/UQ/newUser/shipto/ACC29-GC-couponAndYupacket.feature',
      './e2e/features/UQ/newUser/shipto/ACC30-GC-yupacket.feature',
      './e2e/features/UQ/newUser/shipto/ACC31-CC-couponAndYupacket.feature',
      './e2e/features/UQ/newUser/shipto/ACC32-GC-CC-yupacket.feature',
      './e2e/features/UQ/newUser/shipto/ACC33-GC-CC-yupacket.feature',
      './e2e/features/UQ/newUser/shipto/ACC34-GC-CC-couponAndYupacket.feature',
      './e2e/features/UQ/newUser/shipto/ACC35-PS-yupacket.feature',
      './e2e/features/UQ/newUser/UQstore/ACC36-GC-UQStoreAndGifting.feature',
      './e2e/features/UQ/newUser/UQstore/ACC37-GC-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC38-GC-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC39-CC-couponAndUQStoreWithGifting.feature',
      './e2e/features/UQ/newUser/UQstore/ACC40-GC-CC-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC41-GC-CC-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC42-GC-CC-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC43-PS-UQStore.feature',
      './e2e/features/UQ/newUser/cvs/ACC44-GC-couponAndSevenElevenWithGifting.feature',
      './e2e/features/UQ/newUser/cvs/ACC45-GC-sevenEleven.feature',
      './e2e/features/UQ/newUser/cvs/ACC46-GC-giftingAndSevenEleven.feature',
      './e2e/features/UQ/newUser/cvs/ACC47-CC-giftingAndSevenEleven.feature',
      './e2e/features/UQ/newUser/cvs/ACC48-GC-CC-couponAndSevenEleven.feature',
      './e2e/features/UQ/newUser/cvs/ACC49-GC-CC-giftingAndSevenEleven.feature',
      './e2e/features/UQ/newUser/cvs/ACC50-GC-CC-sevenEleven.feature',
      './e2e/features/UQ/newUser/cvs/ACC51-GC-couponAndFamilymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC52-GC-familymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC53-GC-couponAndFamilymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC54-CC-familymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC55-GC-CC-familymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC56-GC-CC-familymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC57-GC-CC-familymart.feature',
      './e2e/features/UQ/newUser/cvs/ACC58-GC-couponAndLawson.feature',
      './e2e/features/UQ/newUser/cvs/ACC59-GC-lawsonWithGifting.feature',
      './e2e/features/UQ/newUser/cvs/ACC60-GC-lawson.feature',
      './e2e/features/UQ/newUser/cvs/ACC61-CC-lawsonWithGifting.feature',
      './e2e/features/UQ/newUser/cvs/ACC62-GC-CC-couponAndLawson.feature',
      './e2e/features/UQ/newUser/cvs/ACC63-GC-CC-lawsonWithGifting.feature',
      './e2e/features/UQ/newUser/cvs/ACC64-GC-CC-lawson.feature',
      './e2e/features/GU/newUser/shipto/ACC65-COD-standardAndGifting.feature',
      './e2e/features/GU/newUser/shipto/ACC66-CC-standardAndCouponAndGifting.feature',
      './e2e/features/GU/newUser/shipto/ACC67-COD-bydate.feature',
      './e2e/features/GU/newUser/shipto/ACC69-CC-nekopos.feature',
      './e2e/features/UQ/returningUser/shipto/ACC70-COD-standardAndGiftingWithCoupon.feature',
      './e2e/features/UQ/returningUser/shipto/ACC71-GC-standardAndCouponAndGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC72-GC-standard.feature',
      './e2e/features/UQ/returningUser/shipto/ACC73-GC-standard.feature',
      './e2e/features/UQ/returningUser/shipto/ACC74-CC-standardWithGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC75-GC-CC-standard.feature',
      './e2e/features/UQ/returningUser/shipto/ACC76-GC-CC-standard.feature',
      './e2e/features/UQ/returningUser/shipto/ACC77-GC-CC-standard.feature',
      './e2e/features/UQ/returningUser/shipto/ACC78-PS-standardWithGiftingAndCoupon.feature',
      './e2e/features/UQ/returningUser/shipto/ACC79-COD-bydate.feature',
      './e2e/features/UQ/returningUser/shipto/ACC80-GC-bydateAndGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC81-GC-bydate.feature',
      './e2e/features/UQ/returningUser/shipto/ACC82-GC-bydate.feature',
      './e2e/features/UQ/returningUser/shipto/ACC83-CC-bydateAndCoupon.feature',
      './e2e/features/UQ/returningUser/shipto/ACC84-GC-CC-bydateAndCouponAndGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC85-GC-CC-bydate.feature',
      './e2e/features/UQ/returningUser/shipto/ACC86-GC-CC-bydate.feature',
      './e2e/features/UQ/returningUser/shipto/ACC87-PS-bydateAndCoupon.feature',
      './e2e/features/GU/returningUser/shipto/ACC88-CC-nekopos.feature',
      './e2e/features/UQ/returningUser/shipto/ACC89-COD-nextday.feature',
      './e2e/features/UQ/returningUser/shipto/ACC90-GC-nextdayWithGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC91-GC-nextday.feature',
      './e2e/features/UQ/returningUser/shipto/ACC92-GC-nextday.feature',
      './e2e/features/UQ/returningUser/shipto/ACC93-CC-couponAndNextdayWithGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC94-GC-CC-nextday.feature',
      './e2e/features/UQ/returningUser/shipto/ACC95-GC-CC-nextday.feature',
      './e2e/features/UQ/returningUser/shipto/ACC96-GC-CC-nextdayWithGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC97-PS-couponAndNextday.feature',
      './e2e/features/UQ/returningUser/shipto/ACC98-GC-yupacket.feature',
      './e2e/features/UQ/returningUser/shipto/ACC99-GC-couponAndYupacket.feature',
      './e2e/features/UQ/returningUser/shipto/ACC100-GC-yupacket.feature',
      './e2e/features/UQ/returningUser/shipto/ACC101-CC-couponAndYupacket.feature',
      './e2e/features/UQ/returningUser/shipto/ACC102-GC-CC-yupacket.feature',
      './e2e/features/UQ/returningUser/shipto/ACC103-GC-CC-yupacket.feature',
      './e2e/features/UQ/returningUser/shipto/ACC104-GC-CC-yupacket.feature',
      './e2e/features/UQ/returningUser/shipto/ACC105-PS-couponAndYupacket.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC106-GC-UQStoreAndGifting.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC107-GC-UQStore.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC108-GC-UQStore.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC109-CC-UQStoreAndCouponAndGifting.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC110-GC-CC-UQStore.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC111-GC-CC-UQStore.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC112-GC-CC-UQStore.feature',
      './e2e/features/UQ/returningUser/UQstore/ACC113-PS-UQStore.feature',
      './e2e/features/UQ/returningUser/cvs/ACC114-GC-couponAndSevenElevenWithGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC115-GC-sevenEleven.feature',
      './e2e/features/UQ/returningUser/cvs/ACC116-GC-sevenElevenAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC117-CC-sevenElevenAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC118-GC-CC-CouponAndSevenEleven.feature',
      './e2e/features/UQ/returningUser/cvs/ACC119-GC-CC-sevenElevenAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC120-GC-CC-sevenEleven.feature',
      './e2e/features/UQ/returningUser/cvs/ACC121-PS-sevenEleven.feature',
      './e2e/features/UQ/returningUser/cvs/ACC122-GC-couponAndFamilyMart.feature',
      './e2e/features/UQ/returningUser/cvs/ACC123-GC-familyMart.feature',
      './e2e/features/UQ/returningUser/cvs/ACC124-GC-couponAndFamilyMart.feature',
      './e2e/features/UQ/returningUser/cvs/ACC125-CC-familyMartAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC126-GC-CC-familyMart.feature',
      './e2e/features/UQ/returningUser/cvs/ACC127-GC-CC-familyMart.feature',
      './e2e/features/UQ/returningUser/cvs/ACC128-GC-CC-familyMart.feature',
      './e2e/features/UQ/returningUser/cvs/ACC129-PS-familyMart.feature',
      './e2e/features/UQ/returningUser/cvs/ACC130-GC-couponAndLawson.feature',
      './e2e/features/UQ/returningUser/cvs/ACC131-GC-lawsonAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC132-GC-lawson.feature',
      './e2e/features/UQ/returningUser/cvs/ACC133-CC-lawsonAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC134-GC-CC-couponAndLawson.feature',
      './e2e/features/UQ/returningUser/cvs/ACC135-GC-CC-lawsonAndGifting.feature',
      './e2e/features/UQ/returningUser/cvs/ACC136-GC-CC-lawson.feature',
      './e2e/features/GU/returningUser/shipto/ACC138-COD-standardWithGifting.feature',
      './e2e/features/GU/returningUser/shipto/ACC139-CC-standardWIthGiftingAndCoupon.feature',
      './e2e/features/GU/returningUser/shipto/ACC140-COD-bydate.feature',
      './e2e/features/GU/returningUser/shipto/ACC141-CC-bydateAndCoupon.feature',
      './e2e/features/UQ/newUser/shipto/ACC142-COD-standardAnd99Products.feature',
      './e2e/features/UQ/newUser/shipto/ACC143-deferred-nextday.feature',
      './e2e/features/UQ/newUser/shipto/ACC144-deferred-standard.feature',
      './e2e/features/UQ/newUser/shipto/ACC145-deferred-bydate.feature',
      './e2e/features/GU/newUser/shipto/ACC146-deferred-standardWithGifting.feature',
      './e2e/features/GU/newUser/shipto/ACC147-deferred-bydateWithGiftingAndCoupon.feature',
      './e2e/features/GU/newUser/shipto/ACC148-deferred-standardWithCoupon.feature',
      './e2e/features/UQ/newUser/shipto/ACC151-GC-giftCardIsUnset.feature',
      './e2e/features/UQ/newUser/shipto/ACC152-validateNewShippingFormMandatoryData.feature',
      './e2e/features/UQ/newUser/shipto/ACC153-validateNewShippingFormInvalidData.feature',
      './e2e/features/UQ/returningUser/shipto/ACC154-validateShippingFormMandatoryData.feature',
      './e2e/features/UQ/newUser/shipto/ACC156-CC-validateCreditCardForm.feature',
      './e2e/features/UQ/newUser/shipto/ACC157-CC-validateNewCreditCardForm.feature',
      './e2e/features/UQ/newUser/shipto/ACC158-validateMySizeFieldsWithValidData.feature',
      './e2e/features/UQ/newUser/shipto/ACC159-validateMySizeFieldsWithInvalidData.feature',
      './e2e/features/UQ/newUser/shipto/ACC160-GC-validateGiftCardInfoNotDisplayedOnCartPage.feature',
      './e2e/features/GU/newUser/shipto/ACC161-COD-validateNewShippingFormMandatoryData.feature',
      './e2e/features/UQ/newUser/shipto/ACC163-GC-validateGiftCardForm.feature',
      './e2e/features/UQ/newUser/shipto/ACC164-shippingNotAsBillingAndUqStoreCancel.feature',
      './e2e/features/UQ/newUser/shipto/ACC165-COD-validateDeliveryAfterMemberEditAdderss.feature',
      './e2e/features/UQ/newUser/shipto/ACC166-GC-CC-validateGiftCardAndCreditCard.feature',
      './e2e/features/UQ/newUser/shipto/ACC167-shippingNotAsBillingAndUqStoreUpdateQuantity.feature',
      // './e2e/features/UQ/newUser/shipto/ACC168-validateEditDeliveryOption.feature',
      // './e2e/features/UQ/newUser/cvs/ACC169-validatePaymentOptions.feature',
      './e2e/features/UQ/returningUser/shipto/ACC170-GC-CC-validatePaymentPageErrorMessages.feature',
      './e2e/features/UQ/newUser/shipto/ACC171-GC-CC-validateGiftCardCreditCardErrorMessages.feature',
      './e2e/features/UQ/newUser/cvs/ACC172-GC-cvsAllThreeStoresAndGiftCardValidation.feature',
      // './e2e/features/UQ/newUser/shipto/ACC173-validateRecentlyViewed.feature',
      //'./e2e/features/UQ/returningUser/shipto/ACC174-validateDeliveryAddressChange.feature',
      //'./e2e/features/UQ/returningUser/UQstore/ACC176-deferred-UQStoreAndGifting.feature',
      './e2e/features/UQ/returningUser/shipto/ACC179-deferred-nextday.feature',
      './e2e/features/UQ/returningUser/shipto/ACC180-deferred-standard.feature',
      './e2e/features/UQ/returningUser/shipto/ACC181-deferred-bydate.feature',
      './e2e/features/GU/returningUser/shipto/ACC185-deferred-standardWithGifting.feature',
      './e2e/features/GU/returningUser/shipto/ACC186-deferred-bydateWithGiftingAndCoupon.feature',
      './e2e/features/GU/returningUser/shipto/ACC187-deferred-standardWithCoupon.feature',
      './e2e/features/UQ/newUser/shipto/ACC188-GC-validateMandatoryFields.feature',
     './e2e/features/UQ/newUser/shipto/ACC189-GC-validateReceipt.feature',
      './e2e/features/UQ/returningUser/shipto/ACC190-CC-standard-validateFAQRedirection.feature',
      './e2e/features/UQ/newUser/shipto/ACC191-CC-validateBillingAddressAndShippingAddress.feature',
      './e2e/features/UQ/newUser/shipto/ACC192-CC-billingAddressNotSameAsShippingAddress.feature',
      './e2e/features/UQ/newUser/shipto/ACC193-COD-standard.feature',
      // './e2e/features/UQ/newUser/shipto/ACC194-COD-validateNewEmail.feature',
      './e2e/features/UQ/newUser/shipto/ACC195-GC-standard-validateCartShippingMessages.feature',
      './e2e/features/UQ/newUser/shipto/ACC196-validateSameDayDeliveryShippingCharge.feature',
      './e2e/features/UQ/newUser/shipto/ACC197-COD-standard-validateGiftCardAmountExceedErrorToolTip.feature',
      './e2e/features/UQ/newUser/shipto/ACC198-COD-validateCancelOrder.feature',
      './e2e/features/UQ/returningUser/shipto/ACC199-COD-validateCancelOrder.feature',
      './e2e/features/UQ/newUser/shipto/ACC200-validateAddressBook.feature',
     // './e2e/features/UQ/returningUser/shipto/ACC201-validateOrdersInOrderHistory.feature',
      './e2e/features/UQ/returningUser/shipto/ACC202-CC-standard-editCreditCard.feature',
      './e2e/features/UQ/returningUser/cvs/ACC204-GC-CC-ministopLawson.feature',
      './e2e/features/UQ/newUser/UQstore/ACC205-PS-UQStoreLinkvalidation.feature',
      './e2e/features/UQ/newUser/UQstore/ACC206-PS-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC207-PS-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC208-PS-UQStore.feature',
      './e2e/features/UQ/newUser/UQstore/ACC209-PS-UQStore.feature',
      './e2e/features/UQ/returningUser/shipto/ACC210-standard-split-CC.feature',
      './e2e/features/UQ/newUser/shipto/ACC211-SplitDelivery-standard.feature',
       './e2e/features/UQ/newUser/shipto/ACC212-CC-SD-nextdayAndStandard.feature',
       './e2e/features/UQ/newUser/shipto/ACC213-CVS-checkoutRedirection.feature',
       './e2e/features/UQ/returningUser/shipto/ACC215-CC-SD-bydateAndSameday.feature',
       './e2e/features/UQ/newUser/shipto/ACC216-individualToCollectiveShipping.feature',
       './e2e/features/UQ/newUser/shipto/ACC217-collectiveToIndividualShipping.feature',
       './e2e/features/UQ/newUser/shipto/ACC218-CC-SD-nextdayAndBydate.feature',
       './e2e/features/UQ/newUser/shipto/ACC219-validateProductsInShippingPreferencePanel.feature',
       './e2e/features/UQ/newUser/shipto/ACC220-SD-noBillingAddress.feature',
       './e2e/features/UQ/newUser/shipto/ACC221-SD-validateGiftingAndCoupon.feature',
       './e2e/features/UQ/newUser/shipto/ACC222-CC-SD-validatingSplitdeliveryChanges.feature',
       './e2e/features/GU/newUser/shipto/ACC223-invidualToCollectiveShipping.feature',
       './e2e/features/GU/newUser/shipto/ACC224-collectiveToInvidualShipping.feature',
       './e2e/features/GU/newUser/shipto/ACC225-gu-SplitDelivery-standard.feature.feature',
       './e2e/features/GU/newUser/GUstore/ACC226-CC-GU-Bro-StoreAndGifting.feature',
       './e2e/features/GU/newUser/GUstore/ACC227-CC-GUBroGUStoreCoupon.feature',
       './e2e/features/GU/newUser/cvs/ACC228-GC-GUBroSevenElevenWithGifting.feature',
       './e2e/features/UQ/returningUser/UQstore/ACC229-UQStoreDelivery-StorePay.feature',     
   ]
   },

  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //

  //
  // First, you can define how many instances should be started at the same time.
  // The property handles how many capabilities from the same test should run tests.
  //
  maxInstances: process.env.instance || 5,

  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //

  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // e.g. using promises you can set the sync option to false.
  sync: true,

  //
  // Level of logging verbosity: silent | verbose | command | data | result | error
  logLevel: 'silent',

  //
  // Enables colors for log output.
  coloredLogs: true,

  //
  // Set a base URL in order to shorten url command calls. If your url parameter starts
  // with "/", then the base url gets prepended.
  baseUrl: 'http://dev.uniqlo.com:3000',

  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 30000,

  //
  // Default timeout in milliseconds for request if Selenium Grid doesn't send response
  connectionRetryTimeout: 70000,

  //
  // Default request retries count
  connectionRetryCount: 3,

  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: http://webdriver.io/guide/testrunner/reporters.html
  reporters: ['spec', 'junit'],

  //
  // Some reporter require additional information which should get defined here
  reporterOptions: {
    junit: {
      outputDir: './e2e/reports/'
    }
  },

  plugins: {
    'wdio-screenshot': {}
  },

  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  // services: ['sauce','appium','selenium-standalone'],
  //
  // services: ['selenium-standalone'],
  // seleniumLogs: './e2e/reports/',
  // seleniumArgs: [{'version': '3.0.1'}, {'drivers.chrome.version': '2.27'}, {'drivers.chrome.arch': 'x64'}],

  //
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  framework: 'cucumber',

  cucumberOpts: {
    tags: require('./e2e/tagsProcessor')(process.argv),
    require: [
      './e2e/step_definitions/addToCart.stepDefinitions.js',
      './e2e/step_definitions/account.stepDefinitions.js',
      './e2e/step_definitions/cart.stepDefinitions.js',
      './e2e/step_definitions/orderDelivery.stepDefinitions.js',
      './e2e/step_definitions/orderPayment.stepDefinitions.js',
      './e2e/step_definitions/addressForm.stepDefinitions.js',
      './e2e/step_definitions/uniqloStoreFinder.stepDefinitions.js',
      './e2e/step_definitions/orderReview.stepDefinitions.js',
      './e2e/step_definitions/orderConfirmation.stepDefinitions.js',
      './e2e/step_definitions/orderHistory.stepDefinitions.js',
      './e2e/step_definitions/mySize.stepDefinitions.js',
      './e2e/step_definitions/coupon.stepDefinitions.js',
      './e2e/step_definitions/creditCard.stepDefinitions.js'
    ],
    failFast: true,
    dryRun: false,
    colors: true,
    timeout: 120000
  },

  onPrepare: function () {
    let fs = require('fs');

    if (!fs.existsSync(__dirname + '/e2e/reports/screenShots')) {
      if (!fs.existsSync(__dirname + '/e2e/reports')) {
        fs.mkdirSync(__dirname + '/e2e/reports');
      }
      fs.mkdirSync(__dirname + '/e2e/reports/screenShots');
    }
  },

  afterStep: function (step) {
    if (step.getStatus() === 'failed') {
      let stepName = step.getStep().getName();
      let featureName = step.getStep().getScenario().getFeature().getName();
      let screenShot = './e2e/reports/screenShots/' + new Date().getTime() + featureName + ' ' + stepName + ' ' + '.png';
      console.log('Adding screenshot: ' + screenShot);
      browser.saveScreenshot(screenShot);
    }
  },

  params: {
    language: process.env.npm_config_locale || 'jp',
    currencySymbol: '¥',
    testUrl: "http://test3.uniqlo.com/jp/",
    queryString: {
      brand: 'brand=uq'
    },
    featureContext: {
      products: {},
      priceDetails: {},
      deliveryMethod: {},
      paymentMethods: [],
      billingMethod: {},
      coupon: {},
      giftingOption: {},
      registeredUser: {},
      mySizedetails: {}
    }
  }
};
