import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import If from 'components/uniqlo-ui/If';
import BoxSelector from 'components/BoxSelector';
import formValidator from 'components/FormValidator';
import ErrorHandler from 'containers/ErrorHandler';

import { getCreditInfo, getGiftCards } from 'redux/modules/checkout/payment/selectors';
import { getCurrentShippingAddress, isDefaultAddressComplete as isDefaultAddressCompleteSelector } from 'redux/modules/checkout/delivery/selectors';
import { isCreditCardSaved } from 'utils/CardValidator/bluegate';
import { isValidCreditCard } from 'utils/validation';

import * as creditCardActions from 'redux/modules/checkout/payment/creditCard/actions';
import * as paymentActions from 'redux/modules/checkout/payment/actions';
import { setShippingSelectedAddress as setShippingSelectedAddressAction } from 'redux/modules/checkout/delivery/actions';
import { addAndLoadUserAddresses as addAndLoadUserAddressesAction } from 'redux/modules/account/userInfo';
import { setDifference as setDifferenceAction } from 'redux/modules/checkout/order/actions';

import CreditCardExist from './CreditCardExist';
import CreditCardNotExist from './CreditCardNotExist';

import * as utils from './utils';
import styles from './styles.scss';

const { string, object, func, bool, array } = PropTypes;

@connect((state, props) => ({
  creditCard: state.creditCard,
  creditInfo: getCreditInfo(state),
  currentShippingAddress: getCurrentShippingAddress(state),
  giftCards: getGiftCards(state),
  isSelected: utils.isSelected(state, props),
  boxTitle: utils.getBoxTitle(state, props),
  isDefaultAddressComplete: isDefaultAddressCompleteSelector(state),
  currentBillingAddress: utils.getCurrentBillingAddress(state),
  creditCardHasTypeAndLastFourDigits: utils.isCreditCardHasTypeAndLastFourDigits(state),
  isSetToAddressBook: utils.isSetToAddressBook(state),
  isCreditCardNumberValid: utils.isCreditCardNumberValid(state),
  isCreditCardNotApplicable: utils.isCreditCardNotApplicable(state),
  isTemporalCCInValid: utils.isTemporalCCExistsAndIsInvalid(state),
}), {
  setLocalPaymentMethod: paymentActions.setLocalPaymentMethod,
  setBillingSelectedAddress: paymentActions.setBillingSelectedAddress,
  registerCard: creditCardActions.registerCard,
  deleteCreditCard: creditCardActions.deleteCreditCard,
  updateLocalCreditCard: creditCardActions.updateLocalCreditCard,
  resetCard: creditCardActions.resetCard,
  selectCard: creditCardActions.selectCard,
  resetDummyValuesInBillingAddress: paymentActions.resetDummyValuesInBillingAddress,
  addAndLoadUserAddresses: addAndLoadUserAddressesAction,
  setShippingSelectedAddress: setShippingSelectedAddressAction,
  setDifference: setDifferenceAction,
})
@formValidator
@ErrorHandler(['placeOrder'])
export default class CreditCard extends PureComponent {
  static propTypes = {
    creditCard: object,
    creditInfo: object,
    currentShippingAddress: object,
    giftCards: array,
    isSelected: bool,
    boxTitle: string,
    currentBillingAddress: object,
    creditCardHasTypeAndLastFourDigits: bool,
    isCreditCardNumberValid: bool,
    isSetToAddressBook: bool,
    isDefaultAddressComplete: bool,
    setLocalPaymentMethod: func,
    setBillingSelectedAddress: func,
    registerCard: func,
    deleteCreditCard: func,
    updateLocalCreditCard: func,
    resetCard: func,
    addAndLoadUserAddresses: func,
    setShippingSelectedAddress: func,
    selectCard: func,
    resetDummyValuesInBillingAddress: func,
    setDifference: func,
    error: string,
    isCreditCardNotApplicable: bool,
    isTemporalCCInValid: bool,
  };

  static contextTypes = {
    i18n: object,
    config: object,
    validateForm: func,
  };

  state = {
    error: null,
    cardInfo: null,
    isDeletePopup: false,
    isEditInProgress: false,
    isCardSelected: false,
    cardOnLoad: false,
  };

  componentWillMount() {
    const { creditCard, creditInfo, creditCardHasTypeAndLastFourDigits, selectCard, isCreditCardNotApplicable, isTemporalCCInValid } = this.props;

    if ((isCreditCardNotApplicable && !isCreditCardSaved(creditInfo)) || isTemporalCCInValid) {
      this.setState({ isEditInProgress: true });
    }
    selectCard({});
    if (creditCardHasTypeAndLastFourDigits) {
      this.setState({
        cardOnLoad: true,
        cardInfo: creditCard,
      });
    }
    this.isCCAlreadyValid = isValidCreditCard(creditCard);
  }

  componentWillReceiveProps(nextProps) {
    const { creditCard, creditInfo, isCreditCardNotApplicable, isSelected, currentBillingAddress } = nextProps;

    if (!isValidCreditCard(creditCard) && !isCreditCardSaved(creditInfo)) {
      this.isCCAlreadyValid = false;
    }
    if (isCreditCardNotApplicable && creditCard.selected) {
      this.setState({ isEditInProgress: true });
    }
    this.props.resetDummyValuesInBillingAddress(isSelected, currentBillingAddress, this.props.isSelected);
  }

  applyCreditCard = (event, addressChanged) => {
    const {
      creditCard,
      creditInfo,
      registerCard,
      setBillingSelectedAddress,
      giftCards,
      setShippingSelectedAddress,
      addAndLoadUserAddresses,
      currentShippingAddress,
      currentBillingAddress,
      isSetToAddressBook,
      isCreditCardNumberValid,
      setDifference,
      selectCard,
    } = this.props;

    setDifference();

    if (this.context.validateForm() && isCreditCardNumberValid) {
      // When adding a new credit card we want to select this
      // new card to show it on review page.
      if (!creditInfo.selected) {
        selectCard(creditCard);
      }

      setBillingSelectedAddress(currentBillingAddress);
      registerCard(creditCard, giftCards.length, addressChanged).catch((error) => {
        // TODO: server error handling
        this.setState({ error });
      });

      if (isSetToAddressBook) {
        setShippingSelectedAddress(currentShippingAddress);
        addAndLoadUserAddresses();
      }
    }
  };

  confirmDelete = (card) => { this.setState({ isDeletePopup: true, toDelete: card }); };

  handleDelete = (close) => {
    const stateProperties = {
      isDeletePopup: false,
    };

    if (close === 'yes') {
      const { toDelete } = this.state;

      this.props.deleteCreditCard(toDelete);
      stateProperties.cardInfo = null;
      if (toDelete.selected) {
        stateProperties.isCardSelected = false;
      }
    }

    this.setState(stateProperties);
  };

  editCreditCard = () => {
    this.props.resetCard();
    this.props.selectCard({});
    this.setState({ isCardSelected: false, isEditInProgress: true });
  };

  selectCard = (card) => {
    const { props: { updateLocalCreditCard, selectCard }, state: { cardOnLoad, cardInfo } } = this;

    if (cardOnLoad) {
      updateLocalCreditCard(cardInfo);
    }
    selectCard(card);
    this.setState({ isCardSelected: true, isEditInProgress: false });
  };

  render() {
    const { i18n: { payment }, config: { payment: method } } = this.context;
    const {
      creditCard,
      creditInfo,
      setLocalPaymentMethod,
      isSelected,
      boxTitle,
      isDefaultAddressComplete,
      error: customError,
    } = this.props;
    const { error, isDeletePopup, isEditInProgress, isCardSelected, cardOnLoad, cardInfo } = this.state;
    const { selectCard, confirmDelete, handleDelete, applyCreditCard, editCreditCard } = this;

    const currentCardInfo = cardOnLoad ? cardInfo || creditInfo : creditInfo;
    const creditCardExists = (currentCardInfo && currentCardInfo.cardType) || this.isCCAlreadyValid && isDefaultAddressComplete;

    return (
      <BoxSelector
        boxType="paymentTile"
        changeByProps
        checked={isSelected}
        className="payment"
        id="cc"
        label={boxTitle}
        labelStyle={styles.paymentTitle}
        showLockToolTip
        name="method"
        onChange={setLocalPaymentMethod}
        shadow
        value={method.creditCard}
        variation="checkbox"
        analyticsOn="Payment Checkbox Toggle"
        analyticsLabel={isSelected ? 'Credit Card out' : 'Credit Card on'}
        analyticsCategory="Checkout Funnel"
      >
        <If
          if={creditCardExists}
          then={CreditCardExist}
          else={CreditCardNotExist}
          i18n={payment}
          error={error || customError}
          savedCreditCard={creditInfo}
          temporalCreditCard={creditCard}
          {...{ isCardSelected, isEditInProgress, isDeletePopup, selectCard, confirmDelete, handleDelete, applyCreditCard, editCreditCard }}
        />
      </BoxSelector>
    );
  }
}
