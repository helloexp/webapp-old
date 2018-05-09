import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/Atoms/Text';
import Image from 'components/uniqlo-ui/Image';
import BoxSelector from 'components/BoxSelector';
import If from 'components/uniqlo-ui/If';
import { redirect, getUrlWithQueryData } from 'utils/routing';
import { setLocalPaymentMethod, togglePayAtUQStoreConfirmation, setBillingAddress } from 'redux/modules/checkout/payment/actions';
import {
  isUniqloStorePaymentSelected, getAppliedStore,
  isUniqloStoreSelected, isGiftCardsAvailable, getCurrentBillingAddress,
  shouldShowBillingAddressFormForNewUserStoresSelection,
  shouldShowBillingAddressForm,
  shouldUpdateBillingAddress as shouldUpdateBillingAddressSelector,
  shouldShowPaymentStore,
  getSelectedStore,
} from 'redux/modules/checkout/payment/selectors';
import { resetPaymentStore, setUQPaymentAndRedirect, selectPaymentStore } from 'redux/modules/checkout/payment/store';
import { setLocationAccess } from 'redux/modules/checkout/delivery/store/actions';
import cx from 'classnames';
import { routes } from 'utils/urlPatterns';
import { getBrand } from 'redux/modules/cart/selectors';
import styles from './styles.scss';
import PayInStoreAddress from './PayInStoreAddress';

const { object, func, bool, string } = PropTypes;
const instructionsImg = require('theme/images/instructions.png');

@connect((state, props) => ({
  isSelected: isUniqloStorePaymentSelected(state),
  appliedStore: getAppliedStore(state),
  isStoreSelected: isUniqloStoreSelected(state),
  selectedStore: getSelectedStore(state),
  brand: getBrand(state, props),
  isGiftCardAvailable: isGiftCardsAvailable(state),
  currentBillingAddress: getCurrentBillingAddress(state, props),
  shouldShowCompleteBillingAddressForm: shouldShowBillingAddressForm(state),
  shouldShowNewUserStoresSelectionBillingAddressForm: shouldShowBillingAddressFormForNewUserStoresSelection(state),
  shouldUpdateBillingAddress: shouldUpdateBillingAddressSelector(state),
  shouldShowStoreHistory: shouldShowPaymentStore(state),
}), {
  resetPaymentStore,
  setLocalPaymentMethod,
  setLocationAccess,
  setUQPaymentAndRedirect,
  togglePayAtUQStoreConfirmation,
  setBillingAddress,
  selectPaymentStore,
})
export default class StorePayment extends PureComponent {
  static propTypes = {
    brand: string,
    isSelected: bool,
    setLocalPaymentMethod: func,
    setLocationAccess: func,
    resetPaymentStore: func,
    appliedStore: object,
    isStoreSelected: bool,
    setUQPaymentAndRedirect: func,
    isGiftCardAvailable: bool,
    togglePayAtUQStoreConfirmation: func,
    setBillingAddress: func,
    currentBillingAddress: object,
    shouldShowCompleteBillingAddressForm: bool,
    shouldShowNewUserStoresSelectionBillingAddressForm: bool,
    shouldUpdateBillingAddress: bool,
    shouldShowStoreHistory: bool,
    selectPaymentStore: func,
    selectedStore: object,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  constructor(props) {
    super(props);

    this.buttonStyles = cx('secondary', 'medium', styles.uniqloPaymentBtn);
  }

  onSetLocationAccess = () => {
    this.props.setLocationAccess('yes');
    this.props.resetPaymentStore();
    this.props.selectPaymentStore(null);
    redirect(getUrlWithQueryData(routes.paymentStore, { brand: this.props.brand }));
  };

  onMapPress = () => {
    if (!this.props.selectedStore) {
      this.props.selectPaymentStore(this.props.appliedStore);
    }
    redirect(getUrlWithQueryData(routes.paymentStore, { brand: this.props.brand }));
  };

  onRemovePress = () => this.props.resetPaymentStore();

  onSelectPress = () => {
    const {
      currentBillingAddress,
      shouldShowCompleteBillingAddressForm,
      shouldShowNewUserStoresSelectionBillingAddressForm,
      isGiftCardAvailable,
      shouldUpdateBillingAddress,
    } = this.props;
    const billingAddress = (shouldShowCompleteBillingAddressForm || shouldShowNewUserStoresSelectionBillingAddressForm) ? currentBillingAddress : false;

    this.props.setUQPaymentAndRedirect(isGiftCardAvailable, billingAddress, shouldUpdateBillingAddress);
  }

  onPayAtUQStoreChange = (paymentType) => {
    const { setLocalPaymentMethod: setLocalPaymentMethodAction, isSelected, togglePayAtUQStoreConfirmation: confirmPayAtUQStoreAction } = this.props;

    if (!isSelected) {
      // if the option was previously not selected, show a confirmation popup to the user.
      return confirmPayAtUQStoreAction();
    }

    // if the box selector for pay at UQ store is already selected, just refresh the redux state once again.
    return setLocalPaymentMethodAction(paymentType);
  }

  render() {
    const {
      isSelected,
      appliedStore,
      isStoreSelected,
      currentBillingAddress,
      shouldShowCompleteBillingAddressForm,
      shouldShowNewUserStoresSelectionBillingAddressForm,
      brand,
      shouldShowStoreHistory,
    } = this.props;
    const { i18n: { payment }, config: { payment: method } } = this.context;
    const btnClass = isStoreSelected && shouldShowStoreHistory ? styles.continueToBtn : this.buttonStyles;

    return (
      <BoxSelector
        boxType="paymentTile"
        changeByProps
        checked={isSelected}
        className="payment"
        id="us"
        label={payment.payAtStore[brand]}
        labelStyle={styles.paymentTitle}
        name="method"
        onChange={this.onPayAtUQStoreChange}
        shadow
        value={method.uniqloStore}
        variation="checkbox"
        analyticsOn="Payment Checkbox Toggle"
        analyticsLabel={isSelected ? 'Store Payment out' : 'Store Payment on'}
        analyticsCategory="Checkout Funnel"
      >
        <div className={styles.container}>
          <Text type={Text.type.paragraph}>{payment.payUniqloInstructions}</Text><br />
          <Text type={Text.type.paragraph}>{payment.payUniqloBarcode}</Text><br />
          <Image className={styles.instructionsImage} source={instructionsImg} />
          <If
            if={!!isStoreSelected && shouldShowStoreHistory}
            then={PayInStoreAddress}
            onChoose={this.onMapPress}
            onRemove={this.onRemovePress}
            onSelect={this.onSelectPress}
            store={appliedStore}
            currentBillingAddress={currentBillingAddress}
            shouldShowCompleteBillingAddressForm={shouldShowCompleteBillingAddressForm}
            shouldShowNewUserStoresSelectionBillingAddressForm={shouldShowNewUserStoresSelectionBillingAddressForm}
            setBillingAddress={this.props.setBillingAddress}
          />
          <Button
            className={btnClass}
            label={payment.payUniqloBtn}
            labelClass={styles.continueLabel}
            onTouchTap={this.onSetLocationAccess}
            analyticsOn="Button Click"
            analyticsLabel="Select Store Location"
            analyticsCategory="Checkout Funnel"
            preventMultipleClicks
          />
        </div>
      </BoxSelector>
    );
  }
}
