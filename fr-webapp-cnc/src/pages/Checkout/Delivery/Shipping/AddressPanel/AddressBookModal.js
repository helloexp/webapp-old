import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Text from 'components/uniqlo-ui/Text';
import AddressForm from 'containers/AddressForm';
import Drawer from 'components/Drawer';
import formValidator from 'components/FormValidator';
import constants from 'config/site/default';
import TSLToolTip from 'components/TSLToolTip';
import ErrorMessage from 'components/ErrorMessage';
import ValidationMessage from 'components/AddressForm/ValidationMessage';
import If from 'components/uniqlo-ui/If';
import { shouldShowAddressCheckBox } from 'redux/modules/checkout/delivery/selectors';
import CheckBoxWithToolTip from 'pages/Checkout/Delivery/components/CheckBoxWithToolTip';
import styles from './styles.scss';

const { gyroTags } = constants;
const { object, func, string, bool } = PropTypes;

@connect((state, props) => ({
  shouldShowCheckBox: shouldShowAddressCheckBox(state, props),
}))
@formValidator
export default class AddressBookModal extends PureComponent {
  static propTypes = {
    cancelAddressForm: func,
    setNewAddress: func,
    setShippingAddress: func,
    shippingAddress: object,
    error: string,
    toggleHeaderDisplay: func,
    isEditAddressForm: bool,
    setBillingAddressCheckBox: func,
    shouldShowCheckBox: bool,
  };

  static contextTypes = {
    i18n: object,
    validateForm: func,
  };

  componentDidMount() {
    if (this.props.shouldShowCheckBox) {
      this.props.setBillingAddressCheckBox(true);
    }
  }

  componentWillUnmount() {
    this.props.toggleHeaderDisplay(true);
  }

  onSaveAddress = () => {
    if (this.context.validateForm() === true) {
      this.props.setNewAddress();
    } else {
      this.forceUpdate();
    }
  };

  setShippingAddress = (name, value) => {
    this.props.setShippingAddress(name, value);
    this.context.validateForm();
  }

  render() {
    const { i18n: { account, common } } = this.context;
    const {
      cancelAddressForm,
      shippingAddress,
      error,
      shouldShowCheckBox,
    } = this.props;

    return (
      <Drawer
        acceptLabel={common.done}
        cancelLabel={account.cancel}
        className={styles.contentWrap}
        onAccept={this.onSaveAddress}
        onCancel={cancelAddressForm}
        title={account.registrationOfAddressBook}
        variation="fixedFooter"
        bodyClass={styles.modalBody}
        acceptBtnProps={{
          analyticsOn: 'Receipt Checkbox Toggle',
          analyticsLabel: 'UPDATE ADDRESS',
          analyticsCategory: 'Checkout Funnel',
        }}
      >
        <div className={styles.headIconWrap}>
          <Text className={styles.addressFormSubHead}>
            {account.pleaseEnterNewAddress}
          </Text>
          <TSLToolTip />
        </div>
        <If
          if={error}
          then={ErrorMessage}
          isCustomError
          message={error}
          rootClassName="addressFormError"
        />
        <AddressForm
          {...shippingAddress}
          additionalFields
          gyroTagValue={gyroTags.DELIVERY}
          isDeliveryAddressForm
          setShippingAddress={this.setShippingAddress}
        />
        <If
          if={shouldShowCheckBox}
          then={CheckBoxWithToolTip}
        />
        <ValidationMessage />
      </Drawer>
    );
  }
}
