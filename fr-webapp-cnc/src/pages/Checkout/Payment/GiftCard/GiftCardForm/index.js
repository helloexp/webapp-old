import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import ErrorHandler from 'containers/ErrorHandler';
import Button from 'components/uniqlo-ui/Button';
import Input from 'components/Atoms/Input';
import Tooltip from 'components/Atoms/Tooltip';
import Heading from 'components/uniqlo-ui/Heading';
import ValidationMessage from 'components/AddressForm/ValidationMessage';
import validator from 'components/uniqlo-ui/core/Validation/Validator';
import { MATCH_COMMA_SPACE } from 'helpers/regex';
import If from 'components/uniqlo-ui/If';
import Text from 'components/uniqlo-ui/Text';
import { shouldShowBillingAddressForm } from 'redux/modules/checkout/payment/giftCard/selectors';
import { verifyGiftCard } from 'redux/modules/checkout/payment/giftCard/actions';
import { getCurrentBillingAddress, getErrorMessages } from 'redux/modules/checkout/payment/selectors';
import { setBillingAddress } from 'redux/modules/checkout/payment/actions';
import { popAPIErrorMessage } from 'redux/modules/errorHandler';
import AddressForm from 'containers/AddressForm';
import formValidator from 'components/FormValidator';
import { toHalfWidth, formatCardNumber, isThisNumberWithSpace } from 'utils/format';
import styles from '../styles.scss';

const { bool, func, object, array, string } = PropTypes;

@connect((state, props) => ({
  currentBillingAddress: getCurrentBillingAddress(state, props),
  errorMessages: getErrorMessages(state),
  isBillingAddressIncomplete: shouldShowBillingAddressForm(state),
  giftCards: state.giftCard.giftCards,
  activeGiftCard: state.giftCard.giftCard,
}), {
  setBillingAddress,
  verifyGiftCard,
  popErrorMessage: popAPIErrorMessage,
})
@ErrorHandler(['verifyGiftCard'])
@formValidator
export default class GiftCardForm extends Component {
  static propTypes = {
    // From selectors
    currentBillingAddress: object,
    isBillingAddressIncomplete: bool,

    // From redux state
    error: string,
    activeGiftCard: object,
    giftCards: array,

    // From parent component
    giftCard: object,

    setBillingAddress: func,
    verifyGiftCard: func,
    popErrorMessage: func,
  };

  static contextTypes = {
    i18n: PropTypes.object,
    config: PropTypes.object,
    validateForm: func,
  };

  state = {
    cardNumberFocused: false,
    isConfirmDisabled: !this.context.validateForm() || !this.isValidNumberAndPin,
    giftCard: {},
  };

  onSetInputValue = (id, value) => {
    this.setState({
      giftCard: {
        ...this.state.giftCard,
        [id]: value ? value.replace(MATCH_COMMA_SPACE, '') : '',
      },
    });
  };

  onNumberChange = (event) => {
    const value = event.target.value;
    const halfWidth = toHalfWidth(value);
    const newValue = formatCardNumber(halfWidth);

    if (this.props.error) {
      this.props.popErrorMessage('verifyGiftCard', true);
    }

    this.showCharError = newValue.length !== value.length && !isThisNumberWithSpace(value);
    this.onSetInputValue(event.target.id, newValue);
    this.validateForm();
  };

  onCardNumberFocus = () => {
    this.setState({ cardNumberFocused: true });
    this.validateForm();
  };

  onCardNumberBlur = () => {
    this.setState({ cardNumberFocused: false });
    this.validateForm();
  };

  setBillingAddress = (name, value) => {
    this.props.setBillingAddress(name, value);
    this.validateForm();
  }

  setBillingAndVerifyGift = () => {
    const { giftCards, currentBillingAddress, isBillingAddressIncomplete } = this.props;

    if (this.context.validateForm()) {
      const updateBilling = giftCards.length === 0 ? currentBillingAddress : 0;

      this.props.verifyGiftCard(this.state.giftCard, updateBilling, isBillingAddressIncomplete);
    }
  };

  isValidNumberAndPin = () => {
    const giftCard = this.state.giftCard.giftCard;

    return (
      giftCard && validator.numericExactLength(giftCard.number, 16) && validator.numericExactLength(giftCard.pin, 4)
    );
  };

  validateForm = () => {
    const isValidForm = this.context.validateForm();

    if (this.state.isConfirmDisabled === isValidForm) {
      this.setState({ isConfirmDisabled: !isValidForm });
    }
  };

  validateAddressForm = (isValid) => {
    this.setState({ isConfirmDisabled: !isValid });
  }

  formatInputValue = (value) => {
    if (this.state.cardNumberFocused) {
      return value || '';
    }

    return formatCardNumber(toHalfWidth(value));
  };

  showCharError = false;

  render() {
    const {
      currentBillingAddress,
      isBillingAddressIncomplete,
      error,
    } = this.props;
    const { payWithGiftCard, payCash, payment, common: { validation } } = this.context.i18n;
    const verifyError = this.showCharError ? validation.singleByteNumber : error;
    const disableButton = this.state.isConfirmDisabled || !this.isValidNumberAndPin;
    const inputGroupClass = classNames(styles.inputGroup, { [styles.inputGroupError]: !!verifyError });

    return (
      <div className={styles.giftCardWrap}>
        <div className={inputGroupClass}>
          <div className={styles.requiredWrapper}>
            <Text className={styles.required}>{payment.required}</Text>
          </div>
          <If if={verifyError} then={Tooltip} type="error">{verifyError}</If>
          <Input
            value={this.formatInputValue(this.state.giftCard.number)}
            id="number"
            maxLength={this.state.cardNumberFocused ? 16 : 19}
            name="giftCardNumber"
            onChange={this.onNumberChange}
            onFocus={this.onCardNumberFocus}
            onBlur={this.onCardNumberBlur}
            pattern="[0-9]{13,16}"
            label={payWithGiftCard.giftCardNumber}
            inputStyle={styles.inputBottomPadding}
            type="tel"
            required
            validations={[{
              rule: 'required',
              errorMessage: validation.giftCardRequired,
            }, {
              rule: 'numericExactLength',
              errorMessage: validation.invalidGiftCard,
              params: '16',
            }]}
          />
        </div>
        <Input
          value={this.formatInputValue(this.state.giftCard.pin)}
          id="pin"
          maxLength="4"
          name="giftCardPin"
          onChange={this.onNumberChange}
          label={payWithGiftCard.pin}
          inputStyle={styles.inputBottomPadding}
          type="tel"
          className={styles.giftCardPin}
          required
          validations={[{
            rule: 'required',
            errorMessage: validation.pinRequired,
          }, {
            rule: 'numericExactLength',
            errorMessage: validation.invalidGiftCardPin,
            params: '4',
          }]}
        />
        <If
          if={isBillingAddressIncomplete}
          then={Heading}
          className={classNames('subHeader', styles.addressFormHeader)}
          headingText={payCash.contactAddress}
          type="h4"
        />
        <If
          if={isBillingAddressIncomplete}
          then={AddressForm}
          validateAddressForm={this.validateAddressForm}
          additionalFields
          setShippingAddress={this.setBillingAddress}
          apt={currentBillingAddress.apt}
          cellPhoneNumber={currentBillingAddress.cellPhoneNumber}
          city={currentBillingAddress.city}
          email={currentBillingAddress.email}
          firstName={currentBillingAddress.firstName}
          firstNameKatakana={currentBillingAddress.firstNameKatakana}
          lastName={currentBillingAddress.lastName}
          lastNameKatakana={currentBillingAddress.lastNameKatakana}
          phoneNumber={currentBillingAddress.phoneNumber}
          postalCode={currentBillingAddress.postalCode}
          prefecture={currentBillingAddress.prefecture}
          receiverCountryCode={currentBillingAddress.receiverCountryCode}
          street={currentBillingAddress.street}
          streetNumber={currentBillingAddress.streetNumber}
          isDeliveryAddressForm
        />
        <ValidationMessage isConfirmDisabled={this.state.isConfirmDisabled} />
        <Button
          className={classNames('medium', 'secondary', 'applyButton', styles.applyGiftCard)}
          disabled={disableButton}
          label={payWithGiftCard.verifyGiftCard}
          onTouchTap={this.setBillingAndVerifyGift}
          analyticsOn="Button Click"
          analyticsLabel="Update Gift  Card Info"
          analyticsCategory="Checkout Funnel"
          preventMultipleClicks
        />
      </div>
    );
  }
}
