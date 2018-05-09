import React, { Component, PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Button from 'components/uniqlo-ui/Button';
import Link from 'components/uniqlo-ui/Link';
import Input from 'components/Atoms/Input';
import Image from 'components/uniqlo-ui/Image';
import CheckBox from 'components/Atoms/CheckBox';
import Container from 'components/uniqlo-ui/core/Container';
import Drawer from 'components/Drawer';
import formValidator from 'components/FormValidator';
import InfoToolTip from 'components/InfoToolTip';
import If from 'components/uniqlo-ui/If';
import ErrorMessage from 'components/ErrorMessage';
import ErrorHandler from 'containers/ErrorHandler';
import { register } from 'redux/modules/account/userInfo';
import { connect } from 'react-redux';
import { checkUQNativeApp, checkGUNativeApp } from 'helpers/NativeAppHelper';
import { MATCH_SPACE } from 'helpers/regex';
import uqLogo from 'images/logo.png';
import guLogo from 'images/logo-gu.svg';
import { getCurrentBrand } from 'utils/routing';
import { getGuestUserEmail } from '../../utils';
import styles from './styles.scss';

const { func, object, string } = PropTypes;

const logo = {
  uq: uqLogo,
  gu: guLogo,
};

const PrivacyTermsLinks = (props, context) => {
  const { config: { applePay: applePayLinks }, i18n: { applePay } } = context;
  const { brand } = props;
  let termsLink = applePayLinks[brand].terms;
  let privacyLink = applePayLinks[brand].privacy;

  if (checkUQNativeApp()) {
    termsLink = `${termsLink}?${applePayLinks.browserFlag.uq}`;
    privacyLink = `${privacyLink}?${applePayLinks.browserFlag.uq}`;
  } else if (checkGUNativeApp()) {
    termsLink = `${termsLink}?${applePayLinks.browserFlag.gu}`;
    privacyLink = `${privacyLink}?${applePayLinks.browserFlag.gu}`;
  }

  return (
    <div className={styles.largeBottomMargin}>
      <div className={styles.flex} key={brand}>
        <Image source={logo[brand]} className={`logoApplePayForm ${styles.smallRightMargin}`} />
        <div className={styles.linksWrapper}>
          <Link
            contentType="linkTab"
            target="_blank"
            className={styles.link}
            to={termsLink}
          >
            {applePay.terms}
          </Link>
          &nbsp; / &nbsp;
          <Link
            contentType="linkTab"
            target="_blank"
            to={privacyLink}
            className={styles.link}
          >
            {applePay.privacy}
          </Link>
        </div>
      </div>
    </div>
  );
};

PrivacyTermsLinks.propTypes = {
  brand: string,
};

PrivacyTermsLinks.contextTypes = {
  config: object,
  i18n: object,
};

@ErrorHandler(['registerUserAddress'])
@connect(state => ({
  emailId: getGuestUserEmail(state),
  brand: getCurrentBrand(state),
}), {
  register,
})
@formValidator
export default class ApplePayForm extends Component {
  static propTypes = {
    error: string,
    brand: string,
    emailId: string.isRequired,
    register: func,
    toggleRegistrationModal: func,
  };

  static contextTypes = {
    i18n: object,
    validateForm: func,
  };

  state = {
    email: this.props.emailId,
    isFormValid: false,
    isPasswordVisible: false,
    isSubscribed: true,
    password: '',
  }

  setInputValue = (event, name) => {
    let value = event.target.value;

    if (value) {
      value = value.replace(MATCH_SPACE, '');
    }

    this.setState({ [name]: value });
    this.validateForm();
  };

  getRef = (node) => { this.drawerNode = node; };

  togglePassword = () => {
    this.setState(prevState => ({ isPasswordVisible: !prevState.isPasswordVisible }));
  };

  toggleSubscription = () => {
    this.setState(prevState => ({ isSubscribed: !prevState.isSubscribed }));
  };

  validateForm = () => {
    const isValidForm = this.context.validateForm();

    if (this.state.isFormValid !== isValidForm) {
      this.setState({ isFormValid: isValidForm });
    }
  };

  registerGuestUser = () => {
    this.props.register(this.state);
  };

  updateEmail = (event) => {
    this.setInputValue(event, 'email');
  };

  updatePassword = (event) => {
    this.setInputValue(event, 'password');
  };

  render() {
    const { i18n: { address, common: { validation }, applePay } } = this.context;
    const { email, password, isSubscribed, isPasswordVisible, isFormValid } = this.state;
    const { toggleRegistrationModal, error, brand } = this.props;

    return (
      <Drawer
        onCancel={toggleRegistrationModal}
        title={applePay.register}
        variation="noFooter"
        cartSpacing="cartSpacingSubTitle"
        getRef={this.getRef}
        className="applePayDrawer"
        noMargin
        noNavBar
      >
        <Container>
          <Text className={`${styles.baseBlockText} ${styles.largeBottomMargin}`} content={applePay.registrationPolicy} />
          <If
            if={error}
            then={ErrorMessage}
            message={error}
            scrollUpOnError
            type="error"
          />
          <Text className={styles.requiredNotice} content={address.required} />
          <InfoToolTip
            className={styles.infoToolTip}
            heading={applePay.registrationInfo}
          />
          <Input
            value={email}
            onChange={this.updateEmail}
            onBlur={this.updateEmail}
            label={address.email}
            inputStyle={styles.smallBottomPadding}
            labelStyle={styles.smallBottomMargin}
            className={styles.xLBottomMargin}
            name="email"
            validations={[{
              rule: 'required',
              errorMessage: validation.emailRequired,
            }, {
              rule: 'email',
              errorMessage: validation.emailNotValid,
            }, {
              rule: 'emailLength',
              errorMessage: validation.emailLength,
            }]}
            required
          />
          <div>
            <Input
              value={password}
              onChange={this.updatePassword}
              onBlur={this.updatePassword}
              label={address.password}
              inputStyle={styles.smallBottomPadding}
              labelStyle={styles.smallBottomMargin}
              className={styles.largeBottomMargin}
              name="password"
              type={isPasswordVisible ? 'text' : 'password'}
              validations={[{
                rule: 'required',
                errorMessage: validation.passwordRequired,
              }, {
                rule: 'passwordValid',
                errorMessage: validation.passwordValid,
              }, {
                rule: 'passwordLength',
                errorMessage: validation.passwordLength,
              }]}
              required
            />
            <CheckBox
              label={address.showPassword}
              onChange={this.togglePassword}
              checked={isPasswordVisible}
              className={styles.showPassword}
            />
          </div>
          <Text content={applePay.emailMagazine} className={styles.emailMagazine} />
          <CheckBox
            checked={isSubscribed}
            className={styles.newsLetter}
            label={applePay.newsLetter[brand]}
            onChange={this.toggleSubscription}
          />
          <div className={styles.blackBorderBottom} />
          <Text content={applePay.agreeToTerms} className={styles.terms} />
          <PrivacyTermsLinks brand={brand} />
          <Button
            className={`default secondary medium ${styles.succesRgnButton}`}
            label={applePay.register}
            onTouchTap={this.registerGuestUser}
            disabled={!isFormValid}
            analyticsOn="Button Click"
            analyticsLabel="ApplePay_complete_register"
            analyticsCategory="Checkout Funnel"
          />
          <Button
            className={`${styles.skipRgnButton} default medium`}
            label={applePay.notRegister}
            onTouchTap={toggleRegistrationModal}
            analyticsOn="Button Click"
            analyticsLabel="ApplePay_non_complete"
            analyticsCategory="Checkout Funnel"
          />
        </Container>
      </Drawer>
    );
  }
}
