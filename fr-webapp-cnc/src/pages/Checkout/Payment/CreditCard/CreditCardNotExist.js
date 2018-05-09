import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import If from 'components/uniqlo-ui/If';
import Button from 'components/uniqlo-ui/Button';
import CheckBox from 'components/Atoms/CheckBox';
import Text from 'components/uniqlo-ui/Text';
import CreditCardForm from 'components/CreditCardForm';
import InfoToolTip from 'components/InfoToolTip';
import ValidationMessage from 'components/AddressForm/ValidationMessage';
import { isSplitDeliverySelected } from 'redux/modules/checkout/delivery/selectors';
import {
  setCreditCard as setCreditCardAction,
  setSaveCardStatus as setSaveCardStatusAction,
} from 'redux/modules/checkout/payment/creditCard/actions';
import {
  isCreditCardValid as isCreditCardValidSelector,
  isAddressFormVisible as isAddressFormVisibleSelector,
  isCreditCardNotApplicable as isCreditCardNotApplicableSelector,
} from './utils';

import CreditCardAddressForm from './CreditCardAddressForm';
import CreditCardAddressPanel from './CreditCardAddressPanel';

import styles from './styles.scss';

const { string, object, func, bool } = PropTypes;

// TODO: check setCreditCard method, maybe it should comes from paymentActions instead
@connect((state, props) => ({
  creditCard: state.creditCard,
  isValid: isCreditCardValidSelector(state),
  isCreditCardNotApplicable: isCreditCardNotApplicableSelector(state),
  isAddressFormVisible: isAddressFormVisibleSelector(state, props),
  isSplitDeliveryApplied: isSplitDeliverySelected(state),
}), {
  setCreditCard: setCreditCardAction,
  setSaveCardStatus: setSaveCardStatusAction,
})

export default class CreditCardNotExist extends Component {
  static propTypes = {
    error: string,
    creditCard: object,
    isValid: bool,
    isAddressFormVisible: bool,
    setCreditCard: func,
    setSaveCardStatus: func,
    applyCreditCard: func,
    isSplitDeliveryApplied: bool,
    isCreditCardNotApplicable: bool,
  };

  static contextTypes = {
    i18n: object,
    validateForm: func,
    config: object,
  };

  state = {
    isConfirmDisabled: !this.props.isValid || !this.context.validateForm(),
  }

  componentWillReceiveProps(nextProps) {
    if (!(nextProps.isValid === this.props.isValid)) {
      this.setState({ isConfirmDisabled: !this.context.validateForm() });
    }
  }

  setCreditCard = (name, value) => {
    const isValidForm = this.context.validateForm();

    if (this.state.isConfirmDisabled === isValidForm) {
      this.setState({ isConfirmDisabled: !isValidForm });
    }
    this.props.setCreditCard(name, value);
  }

  validateAddressForm = (isValid) => {
    this.setState({ isConfirmDisabled: !isValid });
  }

  updateButtonState = (isValidForm) => {
    if (this.state.isConfirmDisabled === isValidForm) {
      this.setState({ isConfirmDisabled: !isValidForm });
    } else {
      this.forceUpdate();
    }
  }

  render() {
    const { i18n: { payment } } = this.context;
    const {
      creditCard,
      isCreditCardNotApplicable,
      isAddressFormVisible,
      setSaveCardStatus,
      applyCreditCard,
      error,
      isSplitDeliveryApplied,
    } = this.props;
    const { isConfirmDisabled } = this.state;
    const buttonStatus = isConfirmDisabled || isCreditCardNotApplicable;

    return (
      <div className={styles.creditPayment}>
        <CreditCardForm
          {...creditCard}
          isFromCheckout
          setCreditCard={this.setCreditCard}
        />
        <If
          if={isAddressFormVisible}
          then={CreditCardAddressForm}
          else={CreditCardAddressPanel}
          updateButtonState={this.updateButtonState}
          validateAddressForm={this.validateAddressForm}
          error={error}
        />
        <ValidationMessage isConfirmDisabled={isConfirmDisabled} />
        <div className={styles.cardIconWrap}>
          <CheckBox
            checked={creditCard.isSaveThisCard}
            id="isSaveThisCard"
            label={payment.saveThisCard}
            onChange={setSaveCardStatus}
            className={styles.checkBox}
          />
          <InfoToolTip
            className="iconCard cardInfo"
            heading={payment.alreadyRegistered}
          />
        </div>
        <If
          if={isSplitDeliveryApplied}
          then={Text}
          className={classNames('freeText', styles.saveCreditCardInfo)}
          content={payment.creditCardSaveRequired}
        />
        <Button
          className={classNames('medium', 'secondary', 'applyButton', styles.applyCreditCard)}
          disabled={buttonStatus}
          label={payment.applyCreditCard}
          onTouchTap={event => applyCreditCard(event, isAddressFormVisible)}
          analyticsOn="Button Click"
          analyticsLabel="Confirm"
          analyticsCategory="Checkout Funnel"
          preventMultipleClicks
        />
      </div>
    );
  }
}
