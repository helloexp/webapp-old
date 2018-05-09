import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'components/uniqlo-ui/Button';
import CheckBox from 'components/uniqlo-ui/core/CheckBox';
import If from 'components/uniqlo-ui/If';
import Text from 'components/uniqlo-ui/Text';
import ValidationMessage from 'components/AddressForm/ValidationMessage';
import CreditCardForm from 'components/CreditCardForm';
import InfoToolTip from 'components/InfoToolTip';
import cx from 'classnames';
import { isSplitDeliverySelected } from 'redux/modules/checkout/delivery/selectors';
import { setCreditCard, setSaveCardStatus } from 'redux/modules/checkout/payment/creditCard/actions';
import { getCreditCard, isCreditCardValid } from 'redux/modules/checkout/payment/selectors';
import { isCreditCardNotApplicable as isCreditCardNotApplicableSelector } from './utils';

import styles from './styles.scss';

const { object, func, bool } = PropTypes;

@connect(state => ({
  creditCard: getCreditCard(state),
  isCreditCardValid: isCreditCardValid(state),
  isCreditCardNotApplicable: isCreditCardNotApplicableSelector(state),
  isSplitDeliveryApplied: isSplitDeliverySelected(state),
}), {
  setCreditCard,
  setSaveCardStatus,
})
export default class CreditCardEditor extends PureComponent {
  static propTypes = {
    applyCreditCard: func,
    delivery: object,

    creditCard: object,
    isCreditCardValid: bool,
    setCreditCard: func,
    setSaveCardStatus: func,
    isSplitDeliveryApplied: bool,
    isCreditCardNotApplicable: bool,
  };

  static contextTypes = {
    i18n: object,
    validateForm: func,
  };

  // TODO: check if state can be removed
  state = {
    isUseShippingAddress: false,
    isConfirmDisabled: !this.props.isCreditCardValid || !this.context.validateForm(),
  };

  setCreditCard = (name, value) => {
    const isValidForm = this.context.validateForm();

    if (this.state.isConfirmDisabled === isValidForm) {
      this.setState({ isConfirmDisabled: !isValidForm });
    }
    this.props.setCreditCard(name, value);
  }

  render() {
    const {
      context: { i18n: { payment } },
      props: { applyCreditCard, creditCard, isCreditCardValid: isCCValid, isSplitDeliveryApplied, isCreditCardNotApplicable },
    } = this;
    const isCCButtonDisabled = !isCCValid || isCreditCardNotApplicable;

    return (
      <div className={styles.ccEditorContainer}>
        <CreditCardForm
          {...creditCard}
          setCreditCard={this.setCreditCard}
        />
        <div className={styles.cardIconWrap}>
          <CheckBox
            className={`spaCheckBox spaCheck ${styles.checkBox}`}
            defaultChecked={creditCard.isSaveThisCard}
            id="isSaveThisCard"
            label={payment.saveThisCard}
            labelClass={styles.checkBoxLabel}
            onCheck={this.props.setSaveCardStatus}
          />
          <InfoToolTip className={`iconCard cardInfo ${styles.savedCardIcon}`}>
            <div>{payment.alreadyRegistered}</div>
          </InfoToolTip>
        </div>
        <ValidationMessage isConfirmDisabled={this.state.isConfirmDisabled} />
        <If
          if={isSplitDeliveryApplied}
          then={Text}
          className={cx('freeText', styles.saveCreditCardInfo)}
          content={payment.creditCardSaveRequired}
        />
        <Button
          className={cx(
            'medium',
            'secondary',
            { [styles.applyCreditCard]: isSplitDeliveryApplied, [styles.disabledBtn]: isCCButtonDisabled }
          )}
          label={payment.useEnteredCard}
          onTouchTap={applyCreditCard}
          disabled={isCCButtonDisabled}
          preventMultipleClicks
        />
      </div>
    );
  }
}
