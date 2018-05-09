import React, { Component, PropTypes } from 'react';
import Label from 'components/uniqlo-ui/Label';
import Text from 'components/uniqlo-ui/Text';
import Button from 'components/uniqlo-ui/Button';
import Input from 'components/Atoms/Input';
import Select from 'components/Atoms/Select';
import Html from 'components/uniqlo-ui/Html';
import Helmet from 'react-helmet';
import { getCurrentSubDomain } from 'utils/routing';
import CheckBox from 'components/uniqlo-ui/core/CheckBox';
import If from 'components/uniqlo-ui/If';
import { formatBirthDate } from 'utils/formatDate';
import { removeHyphen, toHankakuNumber, hiraganaToKatakana } from 'utils/format';
import spacing from 'theme/spacing.scss';
import { checkUQNativeApp, checkGUNativeApp } from 'helpers/NativeAppHelper';
import NewsLetterCheckBoxes from './NewsLetterCheckBoxes';
import DateSelector from './DateSelector';
import newsLetterActions from './newsLetterActions';
import GenderRadioButtonGroup from './GenderRadioButtonGroup';
import styles from './styles.scss';

const { string, func, bool, object } = PropTypes;

export default class AddressForm extends Component {
  static propTypes = {
    errors: object,
    id: string,
    firstName: string,
    lastName: string,
    firstNameKatakana: string,
    lastNameKatakana: string,
    postalCode: string,
    prefecture: string,
    city: string,
    street: string,
    apt: string,
    phoneNumber: string,
    cellPhoneNumber: string,
    email: string,
    gender: string,
    birthday: string,
    streetNumber: string,
    gyroTagValue: string,
    password: string,
    year: string,
    month: string,
    day: string,
    additionalFields: bool,
    isBillingAddress: bool,
    isNewAddressReg: bool,
    regNewAddress: bool,
    newUserStoresSelection: bool,
    isDeliveryAddressForm: bool,
    memberInfo: bool,
    fromAddressBook: bool,
    setShippingAddress: func,
    setNewAddress: func,
    onInputChange: func,
    validateAddressForm: func,
  };

  static contextTypes = {
    i18n: PropTypes.object,
    validateForm: func,
    config: object,
  };

  static defaultProps = {
    firstName: '',
    lastName: '',
    firstNameKatakana: '',
    lastNameKatakana: '',
    postalCode: '',
    prefecture: '',
    city: '',
    street: '',
    apt: '',
    phoneNumber: '',
    cellPhoneNumber: '',
    email: '',
    streetNumber: '',
    gender: '',
    password: '',
    year: '',
    month: '',
    day: '',
    isDeliveryAddressForm: false,
  };

  state = {
    isGeneral: false,
    isMen: false,
    isWomen: false,
    isKids: false,
    isBaby: false,
    isExtendedSize: false,
    isSmallSize: false,
    isOnlineOrLimitedStore: false,
    subscribeAll: false,
    newUserStoresSelection: false,
  };

  componentWillMount() {
    const props = this.props;

    if (props.firstName && props.setNewAddress) {
      props.setNewAddress('id', props.id);
    }

    this.domainKey = getCurrentSubDomain();
    this.isNativeApp = checkUQNativeApp() || checkGUNativeApp();
  }

  componentDidMount() {
    this.retryCount = 0;
    this.checkAndLoadSFS();

    this.efoScript = `var __gyrefo_queue = __gyrefo_queue || [];
     __gyrefo_queue.push(["loadEFO", ${this.props.gyroTagValue}]);
     (function() {
       var ge = document.createElement('script');
       ge.type = 'text/javascript'; ge.async = true;
       ge.charset = "utf-8";
       ge.src = location.protocol + "//efo.gyro-n.com/js/gyr-efo.min.js";
       var s = document.getElementsByTagName('script')[0];
       s.parentNode.insertBefore(ge, s);
     })();`;
    if (this.props.validateAddressForm) {
      this.props.validateAddressForm(this.context.validateForm());
    }
  }

  /**
   * A that invokes callback methods which updates the global state.
   * [TODO] the third argument could be avoided if all the reducers we were mapping
   * the same API field to the same 'name' field. For this we need to standardize
   * the 'name' prop for each AddressForm input field across the site.
   * @param {object} event - JavaScript event object
   * @param {string} name - the store key which tracks input field value
   * @param {string} fieldName - identifies the key corresponding to API error validation
   */
  setInputValue = (event, name, fieldName) => {
    const props = this.props;
    let value = event.target.value;

    if (name === 'phoneNumber' || name === 'cellPhoneNumber' || name === 'postalCode') {
      value = value.replace(/-|\s/g, '');
      value = toHankakuNumber(removeHyphen(value));
    }

    if (event.type === 'blur' && (name === 'firstNameKatakana' || name === 'lastNameKatakana')) {
      value = hiraganaToKatakana(value);
    }

    if (props.setNewAddress) this.props.setNewAddress(name, value);
    if (props.setShippingAddress) {
      props.setShippingAddress(name, value);
    }

    if (props.onInputChange) props.onInputChange(event, fieldName);
  };

  addressPickedUp = (event) => {
    // ACC-426 - sfs.js script will call the onBlur event of input fields that it sets.
    // we pass the newly set value to corresponding visible react component.
    const reactFieldName = event.target.name === 'aptName' ? 'apt' : event.target.name;

    this.setInputValue(event, reactFieldName);
  };

  checkAndLoadSFS = () => {
    if (typeof loadSFSQuery !== 'undefined' && this.retryCount < 20) { // eslint-disable-line no-undef
      loadSFSQuery(); // eslint-disable-line no-undef
    } else {
      this.retryCount++;
      clearTimeout(this.timeoutID);
      this.timeoutID = setTimeout(this.checkAndLoadSFS, 250);
    }
  };

  newsLetterSelected = (event, value) => {
    const newsLetter = this.context.i18n.address.newsLetter;

    newsLetterActions(this, this.state, newsLetter, value);
  };

  togglePassword = () => {
    this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
  };

  renderInputGroup(name, hintText, value, validations, required, maxLength = null, errors = {}, fieldName) {
    return (
      <div>
        <Input
          value={value}
          onChange={event => this.setInputValue(event, name, fieldName)}
          onBlur={event => this.setInputValue(event, name, fieldName)}
          label={hintText}
          className={spacing.MBSM}
          name={`${name}React`}
          isValid={!errors[fieldName]}
          validations={validations}
          required={required}
          maxLength={maxLength}
        />
        <input type="hidden" name={name} onBlur={this.addressPickedUp} />
      </div>
    );
  }

  render() {
    const state = this.state;
    const {
      firstName,
      lastName,
      firstNameKatakana,
      lastNameKatakana,
      postalCode,
      prefecture,
      city,
      street,
      apt,
      phoneNumber,
      cellPhoneNumber,
      email,
      additionalFields,
      isBillingAddress,
      isNewAddressReg,
      regNewAddress,
      streetNumber,
      isDeliveryAddressForm,
      gender,
      memberInfo,
      birthday,
      fromAddressBook,
      password,
      year,
      month,
      day,
      errors,
      newUserStoresSelection,
    } = this.props;

    const { ubicast, gyro } = this.context.config;
    const { address, common: { validation } } = this.context.i18n;
    const newsLetter = address.newsLetter;
    const fieldClass = `formLabel ${styles.fieldStyle}`;
    const streetValidations = [{
      rule: 'required',
      errorMessage: validation.streetRequired,
    }];
    const phoneMessageClass = `formLabel ${styles.messageStyle}`;

    const cellPhoneNumberField = additionalFields && !newUserStoresSelection
      ? (<Input
        value={cellPhoneNumber}
        onChange={event => this.setInputValue(event, 'cellPhoneNumber', 'mobilePhoneNumber')}
        label={address.cellPhoneNumber}
        className={spacing.MBSM}
        name="cellPhoneNumber"
        isValid={!errors.mobilePhoneNumber}
        type="tel"
        validations={[{
          rule: 'singleByteNumber',
          errorMessage: validation.singleByteNumber,
        }, {
          rule: 'phoneNumber',
          errorMessage: validation.invalidPhoneNumber,
        }]}
        maxLength="13"
      />)
      : null;
    const katakanaFields = additionalFields
      ? (<div>
        <Input
          value={lastNameKatakana}
          onChange={event => this.setInputValue(event, 'lastNameKatakana', 'phoneticFamilyName')}
          onBlur={event => this.setInputValue(event, 'lastNameKatakana', 'phoneticFamilyName')}
          label={address.lastNameKatakana}
          isValid={!errors.phoneticFamilyName}
          className={spacing.MBSM}
          name="lastNameKatakana"
          validations={[{
            rule: 'required',
            errorMessage: validation.lastNameKatakanaRequired,
          }, {
            rule: 'katakana',
            errorMessage: validation.katakana,
          }]}
          maxLength="12"
          required
        />
        <Input
          value={firstNameKatakana}
          onChange={event => this.setInputValue(event, 'firstNameKatakana', 'phoneticGivenName')}
          onBlur={event => this.setInputValue(event, 'firstNameKatakana', 'phoneticGivenName')}
          label={address.firstNameKatakana}
          className={spacing.MBSM}
          name="firstNameKatakana"
          isValid={!errors.phoneticGivenName}
          validations={[{
            rule: 'required',
            errorMessage: validation.nameKatakanaRequired,
          }, {
            rule: 'katakana',
            errorMessage: validation.katakana,
          }]}
          maxLength="12"
          required
        />
      </div>)
      : null;
    const streetNumberField = additionalFields
      ? (<div>
        <Input
          value={streetNumber}
          onChange={event => this.setInputValue(event, 'streetNumber', 'address')}
          label={address.streetNumber}
          className={spacing.MBSM}
          name="streetNumberReact"
          isValid={!errors.address}
          validations={streetValidations}
          maxLength="20"
          required
        />
        <input type="hidden" name="streetNumber" onBlur={this.addressPickedUp} />
      </div>)
      : null;

    const emailField = (
      <Input
        value={email}
        onChange={event => this.setInputValue(event, 'email')}
        label={address.email}
        className={spacing.MBSM}
        name="email"
        required
      />
    );

    let cityField = null;
    let streetField = null;
    let genderField = null;
    let birthdayField = null;
    let newsLetterCheckBoxes = null;
    let nextButton = null;
    let passwordField = null;
    let passwordInfo = null;
    const cityValidations = [{
      rule: 'required',
      errorMessage: validation.cityRequired,
    }];

    if (!additionalFields) {
      cityField = this.renderInputGroup('city', address.city, city, cityValidations, true, 15, errors, 'city');
    }

    if (isDeliveryAddressForm) {
      cityField = this.renderInputGroup('city', address.cityCountry, city, cityValidations, true, 15, errors, 'city');
    } else if (memberInfo || fromAddressBook || isBillingAddress) {
      streetField = this.renderInputGroup('city', address.street, city, cityValidations, true, 20, errors, 'city');
    } else {
      streetField = this.renderInputGroup('city', address.street, street, streetValidations, true, 20);
    }

    if (isNewAddressReg) {
      genderField = <GenderRadioButtonGroup address={address} gender={gender} me={this} />;
      birthdayField = !birthday
        ? (<DateSelector
          address={address}
          me={this}
          year={year}
          month={month}
          day={day}
        />)
      : (<div>
        <div className={styles.fieldLabelWrapper}>
          <Label className={fieldClass} text={address.birthday} />
        </div>
        <div className={styles.birthday}>
          {formatBirthDate(birthday)}
        </div>
      </div>);

      newsLetterCheckBoxes = (<NewsLetterCheckBoxes
        me={this}
        newsLetter={newsLetter}
        state={state}
      />);
      nextButton = (<Button
        className="secondary medium"
        label={address.next}
        onTouchTap={regNewAddress}
      />);
    }

    if (memberInfo) {
      passwordField =
        (<div>
          <Input
            value={password}
            onChange={event => this.setInputValue('password', event)}
            label={address.password}
            className={spacing.MBSM}
            name="password"
            type={this.state.isPasswordVisible ? 'text' : 'password'}
            validations={[{
              rule: 'required',
              errorMessage: validation.passwordRequired,
            }]}
            required
          />
          <CheckBox className="spaCheckBox formCheck" id="AddressFormShowPassword" label={address.showPassword} onCheck={this.togglePassword} />
        </div>)
      ;

      passwordInfo = <div className={styles.passInfoText}>{address.passwordInfoText}</div>;
    }

    return (
      <form id="fr_gyroefo" onSubmit={(event) => { event.preventDefault(); }}>
        <Helmet {...ubicast} />
        <Helmet {...gyro} />
        <div className={styles.addressForm}>
          {passwordInfo}
          {
            isNewAddressReg && !isDeliveryAddressForm
            ? emailField
            : null
          }
          { passwordField }
          <div>
            <div className={styles.requiredWrapper}>
              <Text className={styles.required}>{this.context.i18n.address.required}</Text>
            </div>
            <Input
              value={lastName}
              onChange={event => this.setInputValue(event, 'lastName', 'familyName')}
              onBlur={event => this.setInputValue(event, 'lastName', 'familyName')}
              label={address.lastName}
              className={spacing.MBSM}
              isValid={!errors.familyName}
              name="lastName"
              validations={[{
                rule: 'required',
                errorMessage: validation.lastNameRequired,
              }]}
              maxLength="12"
              required
            />
          </div>
          <Input
            value={firstName}
            onChange={event => this.setInputValue(event, 'firstName', 'givenName')}
            onBlur={event => this.setInputValue(event, 'firstName', 'givenName')}
            className={spacing.MBSM}
            label={address.firstName}
            isValid={!errors.givenName}
            name="firstName"
            validations={[{
              rule: 'required',
              errorMessage: validation.nameRequired,
            }]}
            maxLength="12"
            required
          />
          {katakanaFields}
          <div className={`${spacing.MBSM} ${styles.row} ${styles.rowSearch}`}>
            <div className={styles.col}>
              <Input
                value={postalCode}
                onChange={event => this.setInputValue(event, 'postalCode', 'zipCode')}
                onBlur={event => this.setInputValue(event, 'postalCode', 'zipCode')}
                label={address.postalCode}
                className={styles.postalCode}
                toolTipClass={styles.postalCodeToolTip}
                isValid={!errors.zipCode}
                name="postalCodeReact"
                validations={[{
                  rule: 'required',
                  errorMessage: validation.zipCodeRequired,
                }, {
                  rule: 'jpZipCode',
                  errorMessage: validation.jpZipCode,
                }]}
                maxLength="7"
                type="text"
                pattern="\d*"
                required
              />
              <input type="hidden" name="postalCode" onBlur={this.addressPickedUp} />
            </div>
            <div className={styles.wrapFindBtn} id="sfs-easyaddress-button" />
          </div>
          <If if={!newUserStoresSelection}>
            <Select
              value={prefecture}
              values={['', ...this.context.i18n.address.prefectureList]}
              onChange={event => this.setInputValue(event, 'prefecture', 'prefecture')}
              label={address.prefecture}
              isValid={!errors.prefecture}
              className={spacing.MBSM}
              name="prefectureReact"
              validations={[
                {
                  rule: 'required',
                  errorMessage: validation.stateRequired,
                },
              ]}
              required
            />
            <input type="hidden" name="prefecture" onBlur={this.addressPickedUp} />
            {cityField}
            {streetField}
            {streetNumberField}
            <Input
              value={apt}
              onChange={event => this.setInputValue(event, 'apt', 'roomNumber')}
              onBlur={event => this.setInputValue(event, 'apt', 'roomNumber')}
              label={address.apt}
              className={spacing.MBSM}
              isValid={!errors.roomNumber}
              name="aptNameReact"
              validations={[{ rule: 'none' }]}
              maxLength="20"
            />
            <input type="hidden" name="aptName" onBlur={this.addressPickedUp} />
          </If>
          <Input
            value={phoneNumber}
            onChange={event => this.setInputValue(event, 'phoneNumber', 'phoneNumber')}
            onBlur={event => this.setInputValue(event, 'phoneNumber', 'phoneNumber')}
            label={address.phoneNumber}
            className={spacing.MBSM}
            name="phoneNumber"
            isValid={!errors.phoneNumber}
            type="tel"
            validations={[{
              rule: 'required',
              errorMessage: validation.enterPhonenumber,
            }, {
              rule: 'singleByteNumber',
              errorMessage: validation.singleByteNumber,
            }, {
              rule: 'phoneNumber',
              errorMessage: validation.invalidPhoneNumber,
            }]}
            maxLength="13"
            required
          />
          <Label className={phoneMessageClass} text={address.phoneNumberMessage} />
          {cellPhoneNumberField}
          {
            additionalFields && !isNewAddressReg && !isDeliveryAddressForm && !fromAddressBook && !isBillingAddress
            ? emailField
            : null
          }
          {genderField}
          {birthdayField}
          {newsLetterCheckBoxes}
          {nextButton}
        </div>
        { this.gyroEnable ? <Html javascript={this.efoScript} /> : null }
      </form>
    );
  }
}
