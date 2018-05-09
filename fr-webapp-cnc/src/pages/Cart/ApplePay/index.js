import React, { PureComponent, PropTypes } from 'react';
import reactCookie from 'react-cookie';
import config from 'config';
import { connect } from 'react-redux';
import cx from 'classnames';
import MessageBox from 'components/MessageBox';
import Button from 'components/uniqlo-ui/Button';
import If from 'components/uniqlo-ui/If';
import Link from 'components/uniqlo-ui/Link';
import Text from 'components/uniqlo-ui/Text';
import { initApplePaySession } from 'helpers/ApplePay';
import { applePayVersion } from 'utils/applePay';
import { saveAndRedirectToLogin, getLoginStatus } from 'redux/modules/account/auth';
import { pushAPIErrorMessage, popAPIErrorMessage } from 'redux/modules/errorHandler';
import { isCouponApplied } from 'redux/modules/membership/selectors';
import { setApplePayCookie, removeApplePayCookie, toggleApplePayLoginPopup } from 'redux/modules/applePay';
import scrollToTop, { scrollToPosition, getScrollPosition } from 'utils/scroll';
import { checkUQNativeApp, checkGUNativeApp } from 'helpers/NativeAppHelper';
import { trackEvent } from 'utils/gtm';
import TooltipModal from './TooltipModal.js';
import styles from './styles.scss';

const { func, object, bool, string } = PropTypes;

@connect(
  (state, props) => ({
    isAuthenticated: getLoginStatus(state, props),
    isCookieValid: !state.applePay.isLoginCookieInvalid,
    isCouponAppliedOnCart: isCouponApplied(state, props),
    showApplePayLoginPopup: state.applePay.showApplePayLoginPopup,
    isNativeAppApplePayAvailable: state.applePay.isNativeAppApplePayAvailable,
  }),
  {
    redirectToLogin: saveAndRedirectToLogin,
    pushErrorMessage: pushAPIErrorMessage,
    setApplePayCookie,
    removeApplePayCookie,
    toggleApplePayLoginPopup,
    popAPIErrorMessage,
  })
export default class ApplePay extends PureComponent {
  static propTypes = {
    // from redux
    isAuthenticated: bool,
    isCookieValid: bool,
    isCouponAppliedOnCart: bool,
    isGiftCardPayment: bool,
    redirectToLogin: func,
    pushErrorMessage: func,
    setApplePayCookie: func,
    removeApplePayCookie: func,
    toggleApplePayLoginPopup: func,
    popAPIErrorMessage: func,
    showApplePayLoginPopup: bool,
    // from parent
    brand: string,
    isNativeAppApplePayAvailable: bool,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    showApplePayDrawer: false,
  };

 /**
  * @param { String } status - The status sent by MessageBox component on popUp actions (values are "yes" and "no")
  */
  onPopupConfirm = (status) => {
    const { redirectToLogin, pushErrorMessage, isCouponAppliedOnCart, brand } = this.props;
    const { i18n: { cart }, config: { applePay, common: { status: { yes: login } } } } = this.context;

    // Close the Login popUp
    this.props.toggleApplePayLoginPopup();

    // User choose to Login from login popUp
    if (status === login) {
      // GA event for login action
      trackEvent({
        action: 'Button Click',
        label: 'ApplePayGuestLogin',
        category: 'Checkout Funnel',
      });

      // Set apple pay cookie as 'm' for the current brand and redirect to Login page
      this.props.setApplePayCookie(brand, applePay.memberFlag);
      redirectToLogin();
      // show errorMessage on top of cart, if coupon is applied on cart page for guest user
    } else if (isCouponAppliedOnCart) {
      pushErrorMessage(cart.couponNeedsLogin, 'coupon');
      scrollToTop();
      // proceed as guest if user clicked the Guest button in MessageBox
    } else {
      // GA event for guest action
      trackEvent({
        action: 'Button Click',
        label: 'ApplePayGuestShopping',
        category: 'Checkout Funnel',
      });
      // Set apple pay cookie as 'g' for the current brand and scroll to Apple Pay button
      this.props.setApplePayCookie(brand, applePay.guestFlag);
      scrollToPosition(0, this.scrollToPos);
    }
  }

  // On clicking Apple Pay button
  onApplePayButtonClicked = () => {
    const { applePay } = this.context.config;
    const { cookies } = config.app;
    const {
      isAuthenticated,
      isCookieValid,
      brand,
      isNativeAppApplePayAvailable,
      isGiftCardPayment,
    } = this.props;

   /**
    * @type {String} applePayCookie - Value of Apple Pay cookie (value can be "m" and "g")
    * @type {Boolean} isNotGuest - True if applePayCookie is not "g"
    */
    const applePayCookie = reactCookie.load(`${brand}_${cookies.applePayCookie}`);
    const isNotGuest = applePayCookie !== applePay.guestFlag;

    // GA event for Apple Pay checkout
    trackEvent({
      action: 'Button Click',
      label: 'ApplePaySelect',
      category: 'Checkout Funnel',
    });

    // show Apple Pay errors in Cart page
    this.props.popAPIErrorMessage('applePayOrder', true);
    // Apple Pay is available only if gift card is NOT applied. Otherwise no action is required on Apple Pay button click
    if (!isGiftCardPayment) {
      this.scrollToPos = getScrollPosition();
      // show Apple Pay login popup if user is logged in, his session expired and apple Pay cookie is not "g"
      if (isAuthenticated && !isCookieValid && (isNotGuest)) {
        this.props.toggleApplePayLoginPopup();
     /**
      * show Apple Pay Payment sheet for the following users,
      *   1) Logged in user with valid session
      *   2) Logged in user whose session expired but Apple Pay cookie is "g"
      *   3) Guest user (not logged in)
      */
      } else {
        initApplePaySession(isAuthenticated && isCookieValid && isNotGuest, isNativeAppApplePayAvailable);
      }
    }
  }

  // Show or hide Apple Pay tooltip modal
  toggleModal = () => {
    // Save the scroll position on showing the tooltip modal and scroll to that position on closing the modal
    if (!this.state.showApplePayDrawer) {
      this.scrollPosition = getScrollPosition();
    } else {
      scrollToPosition(0, this.scrollPosition);
    }

    this.setState({ showApplePayDrawer: !this.state.showApplePayDrawer });
  }

  render() {
    const { i18n: { applePay: applePayText, cart, orderHistory: { here } }, config: { applePay: applePayConfig } } = this.context;
    const { showApplePayDrawer } = this.state;
    const applePayButtonClass = cx(styles.applePayButton, {
      [styles.applePayButtonVer1]: applePayVersion === 1,
      [styles.applePayBlackButton]: applePayVersion !== 1,
    });
    const {
      brand,
      isAuthenticated,
      isCookieValid,
      showApplePayLoginPopup,
      isGiftCardPayment,
      redirectToLogin,
    } = this.props;

    let faqLink = applePayConfig[brand].faq;
    let termsLink = applePayConfig[brand].terms;
    let privacyLink = applePayConfig[brand].privacy;

    if (checkUQNativeApp()) {
      faqLink = `${faqLink}?${applePayConfig.browserFlag.uq}`;
      termsLink = `${termsLink}?${applePayConfig.browserFlag.uq}`;
      privacyLink = `${privacyLink}?${applePayConfig.browserFlag.uq}`;
    } else if (checkGUNativeApp()) {
      faqLink = `${faqLink}?${applePayConfig.browserFlag.gu}`;
      termsLink = `${termsLink}?${applePayConfig.browserFlag.gu}`;
      privacyLink = `${privacyLink}?${applePayConfig.browserFlag.gu}`;
    }

    return (
      <div>
        <If
          if={showApplePayLoginPopup}
          then={MessageBox}
          confirmLabel={cart.signIn}
          message={applePayText.promptLogin}
          onAction={this.onPopupConfirm}
          rejectLabel={applePayText.returnToCart}
          variation="loginOrProceed"
        />
        <hr className={styles.horizontalRule} />
        <If
          if={isGiftCardPayment}
          then={Text}
          className={styles.giftCardApplyMessage}
          content={applePayText.giftCardApplyMessage}
        />
        <Button
          lang={applePayConfig.languageJP}
          className={applePayButtonClass}
          onTouchTap={this.onApplePayButtonClicked}
        />
        <div className={styles.termsAndConditions}>
          {applePayText.termsAndConditions.text1}
          <Link
            inlineLink
            contentType="linkTab"
            target="_blank"
            className={styles.termsAndConditionsLink}
            to={termsLink}
          >
            {applePayText.termsAndConditions.link1}
          </Link>
          {applePayText.termsAndConditions.text2}
          <Link
            inlineLink
            contentType="linkTab"
            target="_blank"
            className={styles.termsAndConditionsLink}
            to={privacyLink}
          >
            {applePayText.termsAndConditions.link2}
          </Link>
          {applePayText.termsAndConditions.text3}
        </div>
        <If
          if={!(isAuthenticated && isCookieValid)}
        >
          <div className={styles.checkOrderHistory}>
            <Button
              className={styles.checkOrderHistoryLink}
              onTouchTap={redirectToLogin}
            >
              {applePayText.checkOrderHistory.link}
            </Button>
            {applePayText.checkOrderHistory.text}
          </div>
        </If>
        <If
          if={showApplePayDrawer}
          then={TooltipModal}
          brand={brand}
          toggleModal={this.toggleModal}
        />
        <div className={styles.aboutApplePayContainer}>
          <Text className={`blockText ${styles.aboutApplePay}`}>{applePayText.aboutApplePay}</Text>
          <div className={styles.wrapInfoIcon}>
            <Button
              className={styles.infoIconButton}
              analyticsOn="Button Click"
              analyticsLabel="ApplePayToolTip"
              analyticsCategory="Checkout Funnel"
            >
            <span
              className={styles.infoIcon}
              onClick={this.toggleModal}
            />
            </Button>
          </div>
        </div>
        <div className={styles.applePayFAQLinkContainer}>
          <Text content={cart.applePayFAQMessage} className={styles.applePayFAQMessage} />
          <Link
            analyticsOn="Button Click"
            analyticsLabel="ApplePay_FAQ"
            analyticsCategory="Checkout Funnel"
            className={styles.applePayFAQLink}
            contentType="linkTab"
            target="_blank"
            to={faqLink}
            label={here}
          />
        </div>
      </div>
    );
  }
}
