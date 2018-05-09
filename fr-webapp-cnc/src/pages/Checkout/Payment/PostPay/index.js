import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { routes } from 'utils/urlPatterns';
import constants from 'config/site/default';
import {
  setLocalPaymentMethod,
  setBillingAddress,
  confirmPostPaymentMethod,
  resetDummyValuesInBillingAddress,
  togglePostPayConfirmation } from 'redux/modules/checkout/payment/actions';
import ValidationMessage from 'components/AddressForm/ValidationMessage';
import { getCurrentBillingAddress } from 'redux/modules/checkout/payment/selectors';
import { getBrand } from 'redux/modules/cart/selectors';
import AddressForm from 'containers/AddressForm';
import BoxSelector from 'components/BoxSelector';
import formValidator from 'components/FormValidator';
import Button from 'components/uniqlo-ui/Button';
import Link from 'components/uniqlo-ui/Link';
import Image from 'components/uniqlo-ui/Image';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import Heading from 'components/uniqlo-ui/Heading';
import { trackEvent } from 'utils/gtm';
import PostPayInfoModal from './PostPayInfoModal';
import * as utils from './utils';
import npImage from './np.png';
import styles from './styles.scss';

const { object, func, bool, string } = PropTypes;
const { gyroTags } = constants;

const BillingAddressForm = (props, context) => {
  const { currentBillingAddress } = props;
  const { i18n: { payment: paymentTexts } } = context;

  return (
    <div className={styles.addressContainer}>
      <Heading
        className={`subHeader ${styles.addressHead}`}
        headingText={paymentTexts.invoiceAddress}
        type="h4"
      />
      <AddressForm
        setBillingAddress={props.setBillingAddress}
        validateAddressForm={props.validateAddressForm}
        gyroTagValue={gyroTags.PAYMENT}
        setShippingAddress={props.setBillingAddress}
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
        additionalFields
        isDeliveryAddressForm
      />
    </div>
  );
};

BillingAddressForm.propTypes = {
  currentBillingAddress: object,
  setBillingAddress: func,
  validateAddressForm: func,
};

BillingAddressForm.contextTypes = {
  i18n: object,
};

@connect((state, props) => ({
  isPostPaySelected: utils.isSelected(state),
  showBillingAddressForm: utils.showBillingAddressForm(state),
  currentBillingAddress: getCurrentBillingAddress(state, props),
  brand: getBrand(state),
}), {
  setLocalPaymentMethod,
  confirmPostPaymentMethod,
  setBillingAddress,
  resetDummyValuesInBillingAddress,
  toggleConfirmBox: togglePostPayConfirmation,
})
@formValidator
export default class PostPay extends PureComponent {
  static propTypes = {
    /**
     * From Parent
     */
    disabled: bool,

    /**
     * From selectors
     */
    isPostPaySelected: bool,
    showBillingAddressForm: bool,
    currentBillingAddress: object,
    brand: string,

    /**
     * Actions
     */
    setLocalPaymentMethod: func,
    confirmPostPaymentMethod: func,
    setBillingAddress: func,
    resetDummyValuesInBillingAddress: func,
    toggleConfirmBox: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
    validateForm: func,
  };

  static defaultProps = {
    disabled: false,
  };

  state = {
    showInfoModal: false,
    didConfirmAge: false,
    isConfirmDisabled: !this.context.validateForm(),
  };

  componentWillReceiveProps(nextProps) {
    const { isPostPaySelected, currentBillingAddress } = nextProps;

    this.props.resetDummyValuesInBillingAddress(isPostPaySelected, currentBillingAddress, this.props.isPostPaySelected);

    if (this.props.isPostPaySelected && !isPostPaySelected && this.state.didConfirmAge) {
      this.toggleAgeConfirmCheck();
    }

    if (this.props.isPostPaySelected !== isPostPaySelected) {
      trackEvent({
        action: 'Payment Checkbox Toggle',
        label: isPostPaySelected ? 'Deffer on' : 'Deffer out',
        value: isPostPaySelected,
        category: 'Checkout Funnel',
      });
    }
  }

  onConfirmPostPay = () => {
    const {
      state: { didConfirmAge },
      context: { validateForm },
      props: { isPostPaySelected, showBillingAddressForm: shouldSaveBillTo, currentBillingAddress },
    } = this;

    if (isPostPaySelected && didConfirmAge && validateForm()) {
      this.props.confirmPostPaymentMethod(currentBillingAddress, shouldSaveBillTo);
    }
  }

  onPostPayChange = (paymentType) => {
    const { isPostPaySelected, toggleConfirmBox } = this.props;

    if (!isPostPaySelected) {
      // if the option was previously not selected, show a confirmation popup to the user.
      return toggleConfirmBox();
    }

    // if the box selector for Post Pay is already selected, just refresh the redux state once again.
    return this.props.setLocalPaymentMethod(paymentType);
  }

  setBillingAddress = (name, value) => {
    this.props.setBillingAddress(name, value);
    this.validateAddressForm(this.context.validateForm());
  }

  validateAddressForm = (isValidForm) => {
    if (this.state.isConfirmDisabled === isValidForm) {
      this.setState({ isConfirmDisabled: !isValidForm });
    }
  }

  toggleAgeConfirmCheck = () => {
    this.setState({ didConfirmAge: !this.state.didConfirmAge });
  }

  toggleInfoModal = () => {
    this.setState({ showInfoModal: !this.state.showInfoModal });
  }

  render() {
    const { isPostPaySelected, showBillingAddressForm, currentBillingAddress, disabled, brand } = this.props;
    const {
      i18n: { payment, paymentMethod: paymentMethodTexts, postPay, membershipInfo },
      config: { payment: paymentTypes, aboutPostPay },
    } = this.context;
    const postPayText = paymentMethodTexts.postPay.join('');
    const buttonStatus = this.state.isConfirmDisabled || !this.state.didConfirmAge;

    return (
      <div>
        <If
          if={this.state.showInfoModal}
          then={PostPayInfoModal}
          onCancel={this.toggleInfoModal}
          brand={brand}
        />
        <BoxSelector
          boxType="paymentTile"
          id="deferred"
          changeByProps
          checked={isPostPaySelected}
          className="postPay"
          enabled={!disabled}
          label={postPayText}
          name="method"
          onChange={this.onPostPayChange}
          shadow
          value={paymentTypes.postPay}
          variation="checkbox"
          rightIcon="infoIcon"
          onRightIconClick={this.toggleInfoModal}
        >
          <div className={styles.boxContainer}>
            <div className={styles.npDetails}>
              <Link className={styles.npBanner} to={aboutPostPay} target="_blank">
                <Image source={npImage} />
              </Link>
              <Text className={classnames('blockText', styles.aboutPostPay)}>{postPay.aboutPostPay}</Text>
            </div>
            <Text className="blockText">{postPay.aboutBillingAddress}</Text>
            <Link to={routes.memberInfo} className={styles.memberInfoLink}>
              {membershipInfo.editMemberInfo}
            </Link>
            <BoxSelector
              label={postPay.ageConfirmText}
              variation="checkbox"
              className={styles.ageConfirmBox}
              labelStyle={styles.ageConfirmText}
              checked={this.state.didConfirmAge}
              onChange={this.toggleAgeConfirmCheck}
              enabled
            />
            <If
              if={showBillingAddressForm}
              then={BillingAddressForm}
              currentBillingAddress={currentBillingAddress}
              setBillingAddress={this.setBillingAddress}
              validateAddressForm={this.validateAddressForm}
            />
            <ValidationMessage isConfirmDisabled={this.state.isConfirmDisabled} />
            <Button
              className={classnames('medium secondary applyButton', styles.confirmPostPayBtn)}
              disabled={buttonStatus}
              label={payment.confirmPaymentMethod}
              onTouchTap={this.onConfirmPostPay}
              preventMultipleClicks
            />
          </div>
        </BoxSelector>
      </div>
    );
  }
}
