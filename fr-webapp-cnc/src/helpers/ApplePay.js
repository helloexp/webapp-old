import {
  checkUQNativeApp,
  checkGUNativeApp,
  initNativeAppApplePay,
  sendDataToNativeApp,
} from 'helpers/NativeAppHelper';
import {
  isApplePaySessionAvailable,
  applePayVersion,
  getPaymentRequestObj,
  getErrorsForInvalidFields,
  getshippingContactErrors,
  getLineItems,
  getNativeAppError,
} from 'utils/applePay';
import {
  getApplePaySession,
  createShippingContact,
  processApplePayOrder,
  createShippingMethod,
  removeApplePayCookie,
  updateShippingMethods,
  toggleApplePayLoginPopup,
} from 'redux/modules/applePay';
import { getStore } from 'redux/create';
import { getCurrentBrand } from 'utils/routing';
import { pushAPIErrorMessage } from 'redux/modules/errorHandler';
import { getTranslation } from 'i18n';

/**
 * Setup global event-handlers which are to be invoked by native-app
 * @param {String('0'|'1')} guestFlag
 */
function setUpEventHandlersForNativeApp(guestFlag) {
  const { dispatch, getState } = getStore();
  const currentBrand = getCurrentBrand(getState());

  // Create `APPLE_PAY_SESSION` object on window.
  window.APPLE_PAY_SESSION = {};

  /**
   * @typedef {Object} NativeAppErrorObj
   * @property {Array.<{forceClose: Boolean(true)}|{contactField: String, message: String}>} error
   */

  /**
   * The SPA event handler which will be invoked by App on two occassions.
   *  - as soon as payment sheet is initialized
   *  - whenever user updates/changes shippingContact
   * @param {{postal_code: String}} data
   * @returns {Promise<{lineItems: Array, total: Object, shippingMethods: Array}|NativeAppErrorObj>}
   */
  window.APPLE_PAY_SESSION.onShippingContactUpdate = (data) => {
    const methodName = 'onShippingContactUpdate';
    const { postal_code: postalCode } = data;

    // NB: Here the argument to `getErrorsForInvalidFields` should be
    // an object with property `postalCode`. The property name is so
    // significant and if changed the validation will not work.
    const postalCodeError = getErrorsForInvalidFields({ postalCode }, true)[0];

    // postalCodeError will be `undefined` for a valid postal code
    if (!postalCodeError) {
      return dispatch(updateShippingMethods(guestFlag, postalCode))
        .then((newShippingMethods) => {
          const { cart } = getState();
          const isGUNativeApp = checkGUNativeApp();
          const paymentRequest = getPaymentRequestObj(cart[currentBrand].orderSummary, currentBrand, isGUNativeApp);

          return sendDataToNativeApp(methodName, (
            {
              result: {
                lineItems: paymentRequest.lineItems,
                total: paymentRequest.total,
                shippingMethods: newShippingMethods,
              },
            }
          ));
        })
        .catch(() => {
          dispatch(removeApplePayCookie(currentBrand));

          return Promise.reject(sendDataToNativeApp(methodName, getNativeAppError()));
        });
    }

    return Promise.reject(sendDataToNativeApp(methodName, getNativeAppError([postalCodeError])));
  };

  /**
   * @typedef {Object} OrderInfoObj
   * @property {Object} shippingContact
   * @property {Object} shippingMethod
   * @property {Object} token
   */

  /**
   * The SPA event handler which will be invoked by App once
   * touch-id authorization is successfully completed.
   * @param {OrderInfoObj} orderInfo
   * @returns {Promise<{result: {valid: Boolean(true)}}|NativeAppErrorObj>}
   */
  window.APPLE_PAY_SESSION.onPaymentAuthorized = (orderInfo) => {
    const methodName = 'onPaymentAuthorized';
    const { shippingContact, shippingMethod, token: paymentToken } = orderInfo;
    const addressErrors = getErrorsForInvalidFields(shippingContact);
    const isShippingContactErrors = getshippingContactErrors(shippingContact);
    const { applePay: { shippingContactErrorMessage } } = getTranslation();
    const { applePay: { isNativeAppApplePayAvailable } } = getState();

    // looking for special characters
    if (isShippingContactErrors && isNativeAppApplePayAvailable) {
      dispatch(pushAPIErrorMessage(shippingContactErrorMessage, 'applePayOrder'));
      sendDataToNativeApp(methodName, getNativeAppError());
    } else if (!addressErrors.length) {
      // passed validation
      dispatch(createShippingMethod(shippingMethod));
      dispatch(createShippingContact(shippingContact));

      return dispatch(
        processApplePayOrder(
          guestFlag,
          paymentToken.paymentData,
          currentBrand
        )
      )
      .then(() => sendDataToNativeApp(methodName, ({ result: { valid: true } })))
      .then(() => dispatch(removeApplePayCookie(currentBrand)))
      .catch(() => {
        dispatch(removeApplePayCookie(currentBrand));

        return Promise.reject(sendDataToNativeApp(methodName, getNativeAppError()));
      });
    }

    return Promise.reject(sendDataToNativeApp(methodName, getNativeAppError(addressErrors)));
  };

  /**
  * The SPA event handler which will be invoked by App when the session is aborted
  */
  window.APPLE_PAY_SESSION.onDismissPaymentSheet = () => {
    dispatch(removeApplePayCookie(currentBrand));
  };
}

/**
 * Check if ApplePay is supported by native-app, if so create initial configuration
 * that will be supplied to native-app and initialize native-app ApplePay session.
 * @param {String('0'|'1')} guestFlag
 * @param {String('uq'|'gu')} currentBrand
 */
function initNativeAppApplePaySession(guestFlag, currentBrand) {
  const isGUNativeApp = checkGUNativeApp();
  // getPaymentRequestObj(orderSummary = null, currentBrand, isGUNativeApp)
  const initConfig = getPaymentRequestObj(null, currentBrand, isGUNativeApp);

  // Set up global event handlers to be invoked by native-app
  setUpEventHandlersForNativeApp(guestFlag);

  // we are all set, now initialize native-app payment sheet
  initNativeAppApplePay(initConfig);
}

// Will be reassigned with the instance of ApplePaySession
let session;

/**
 * Creates an instance of ApplePaySession from `window.ApplePaySession`
 * based on `applePayVersion`. This method also setups event handlers
 * required to receive data from payment sheet on user interaction.
 *
 * NB: This function should be called directly under the user input/gesture handler.
 * Invoking this outside gesture handler will cause session instantiation to fail.
 * {@link https://developer.apple.com/documentation/applepayjs/applepaysession}
 *
 * @param {Boolean} isMember - A flag to distinguish between guest/member user
 * @param {Boolean} isNativeAppApplePayAvailable
 */
function initApplePaySession(isMember = false, isNativeAppApplePayAvailable) {
  const guestFlag = isMember ? '0' : '1';
  const { dispatch, getState } = getStore();
  const currentBrand = getCurrentBrand(getState());

  if (isApplePaySessionAvailable) {
    const isVersion3 = applePayVersion === 3;
    const { cart } = getState();
    let paymentRequest = getPaymentRequestObj(cart[currentBrand].orderSummary, currentBrand);

    if (
      // disallow duplicate session instantation
      !session ||
      // session exists, but is an aborted/cancelled session
      (session && !session.isActive)
    ) {
      // new session instantiation
      session = new window.ApplePaySession(applePayVersion, paymentRequest);
    }

    if (session) {
      /**
       * Merchant Validation
       * We call our merchant session endpoint, passing the URL to use
       */
      session.onvalidatemerchant = (event) => {
        const validationURL = event.validationURL;

        dispatch(getApplePaySession(validationURL))
          .then(res => session.completeMerchantValidation(res));
      };

      /**
       * Shipping Method Selection
       * If the user changes their chosen shipping method we need to recalculate
       * the total price. We can use the shipping method identifier to determine
       * which method was selected.
       */
      session.onshippingmethodselected = (event) => {
        dispatch(createShippingMethod(event.shippingMethod));

        const argsArray = isVersion3 ? [{
          newLineItems: paymentRequest.lineItems,
          newTotal: paymentRequest.total,
        }] : [
          window.ApplePaySession.STATUS_SUCCESS,
          paymentRequest.total,
          paymentRequest.lineItems,
        ];

        session.completeShippingMethodSelection(...argsArray);
      };

      /**
       * If we don't create the shippingContact object in paymentSheet, `onshippingcontactselected'
       * is invoked when the ApplePay button is clicked (before customer's touchID validation).
       * At this moment, we can only access to the customer's
       *    administrativeArea, country,  countryCode, locality, and postal code.
       *    (ex. 東京 日本 jp 千代田区 1010047)
       * Postal code is essential to call GDS api to pre-book the product from inventory.
       * Therefore, we validate the shippingContact and if there's any problem with it,
       * we have to indicate the error to let customer type their address again.
       */
      session.onshippingcontactselected = (event) => {
        const postalCode = event.shippingContact.postalCode;

        // NB: Here the argument to `getErrorsForInvalidFields` should be
        // an object with property `postalCode`. The property name is so
        // significant and if changed the validation will not work.
        const postalCodeError = getErrorsForInvalidFields({ postalCode }, true)[0];

        // postalCodeError will be `undefined` for a valid postal code
        if (!postalCodeError) {
          dispatch(updateShippingMethods(guestFlag, postalCode))
          .then((fetchedShippingMethods) => {
            const { cart: updatedCartData } = getState();

            paymentRequest = getPaymentRequestObj(updatedCartData[currentBrand].orderSummary, currentBrand);
            const newLineItems = getLineItems(updatedCartData[currentBrand].orderSummary);
            const argsArray = isVersion3 ? [{
              errors: [],
              newLineItems,
              newShippingMethods: fetchedShippingMethods,
              newTotal: paymentRequest.total,
            }] : [
              window.ApplePaySession.STATUS_SUCCESS,
              fetchedShippingMethods,
              paymentRequest.total,
              newLineItems,
            ];

            session.completeShippingContactSelection(...argsArray);
          });
        } else {
          /**
           * Client-side postal code validation fails,
           * hence show error on payment sheet.
           *
           * ApplePay version 3 support custom errors.
           * {@link https://developer.apple.com/documentation/applepayjs/applepayerror}
           *
           * Undocumented usage:
           *  const error = new ApplePayError(code, contactField, message);
           */

          const argsArray = isVersion3 ? [{
            errors: [
              new window.ApplePayError(
                'shippingContactInvalid',
                postalCodeError.contactField,
                postalCodeError.message,
              ),
            ],
            newLineItems: paymentRequest.lineItems,
            newShippingMethods: [],
            newTotal: paymentRequest.total,
          }] : [
            window.ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
            [],
            paymentRequest.total,
            paymentRequest.lineItems,
          ];

          session.completeShippingContactSelection(...argsArray);
        }
      };

      session.oncancel = () => {
        session.isActive = false;

        dispatch(removeApplePayCookie(currentBrand));
      };

      /**
       * Payment Authorization
       * Here you receive the encrypted payment data. You would then send it
       * on to your payment provider for processing, and return an appropriate
       * status in session.completePayment()
       */
      session.onpaymentauthorized = (event) => {
        const { applePay: { isLoginCookieInvalid } } = getState();

        dispatch(removeApplePayCookie(currentBrand));
        if (isMember && isLoginCookieInvalid) {
          session.abortactivesession();
          dispatch(toggleApplePayLoginPopup());
        } else {
          // Send payment for processing...
          const shippingAddress = event.payment.shippingContact;
          const addressErrors = getErrorsForInvalidFields(shippingAddress);
          const isShippingContactErrors = getshippingContactErrors(shippingAddress);
          const { applePay: { shippingContactErrorMessage } } = getTranslation();

          // looking for special characters
          if (isShippingContactErrors && isApplePaySessionAvailable && session) {
            dispatch(pushAPIErrorMessage(shippingContactErrorMessage, 'applePayOrder'));
            session.abortactivesession();
          } else if (!addressErrors.length) {
            // passed validation
            dispatch(createShippingContact(shippingAddress));
            dispatch(processApplePayOrder(guestFlag, event.payment.token.paymentData, currentBrand))
            .then(() => {
              const argsArray = isVersion3 ? [{
                status: window.ApplePaySession.STATUS_SUCCESS,
                errors: [],
              }] : [window.ApplePaySession.STATUS_SUCCESS];

              session.completePayment(...argsArray);
              session.isActive = false;
            });

          // handle address error
          } else if (isVersion3) {
            // construct `error` sequence for version 3
            const addressErrsWithCode = addressErrors.map(
              error => (
                new window.ApplePayError(
                  'shippingContactInvalid',
                  error.contactField,
                  error.message,
                )
              )
            );

            session.completePayment({
              status: window.ApplePaySession.STATUS_FAILURE,
              errors: addressErrsWithCode,
            });

            // handle address error for versions < 3
          } else {
            // If only phoneNumber is invalid, set shipping contact invalid status
            const applePayErrorStatus = (
              addressErrors.length === 1 &&
              addressErrors[0].contactField === 'phoneNumber'
            ) ? window.ApplePaySession.STATUS_INVALID_SHIPPING_CONTACT
              : window.ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS;

            session.completePayment(applePayErrorStatus);
          }
        }
      };

      // custom event handler to abort session
      session.abortactivesession = () => {
        dispatch(removeApplePayCookie(currentBrand));
        session.abort();
        session.isActive = false;
      };

      // safe-guarding against re-initializing an active session
      if (!session.isActive) {
        // All our handlers are setup - start the Apple Pay payment
        session.begin();
        session.isActive = true;
      }
    }
  } else if ((checkUQNativeApp() || checkGUNativeApp()) && isNativeAppApplePayAvailable) {
    initNativeAppApplePaySession(guestFlag, currentBrand);
  }
}

/**
 * Gets instance of ApplePay session created on apple-pay button click.
 * Currently this instance is used by ErrorReactor to abort payment session
 * and thus close the payment sheet when something bad happens.
 * @returns {Object|undefined} - an instance of ApplePaySession if exists
 */
function getInstanceOfApplePaySession() {
  return session;
}

export {
  getInstanceOfApplePaySession,
  initApplePaySession,
};
