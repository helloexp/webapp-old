import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'components/uniqlo-ui/Button';
import If from 'components/uniqlo-ui/If';
import Text from 'components/uniqlo-ui/Text';
import TSLToolTip from 'components/TSLToolTip';
import { removeOrderAndContinue, toggleRegistrationModal } from 'redux/modules/checkout/order';
import { getFirstOrderDetails } from 'redux/modules/checkout/order/selectors';
import { popAPIErrorMessage } from 'redux/modules/errorHandler';
import OrderItemsSummary from 'pages/Checkout/ConfirmOrder/components/OrderItemsSummary';
import ApplePayForm from './ApplePayForm';
import ApplePayRegistrationSuccess from './ApplePayRegistrationSuccess';
import { isAccountRegistrationComplete, getGuestUserOrderDeliveryDate, shouldShowRegistrationModal } from '../../utils';
import styles from './styles.scss';

const { object, bool, func, string } = PropTypes;

@connect(state => ({
  isRegistrationSuccess: isAccountRegistrationComplete(state),
  orderDetails: getFirstOrderDetails(state),
  arrivalDate: getGuestUserOrderDeliveryDate(state),
  isRegistrationModalActive: shouldShowRegistrationModal(state),
}), {
  removeOrderAndContinue,
  toggleRegistrationModal,
  popAPIErrorMessage,
})
export default class ApplePay extends PureComponent {
  static propTypes = {
    isRegistrationSuccess: bool,
    isRegistrationModalActive: bool,
    removeOrderAndContinue: func,
    toggleRegistrationModal: func,
    popAPIErrorMessage: func,
    orderDetails: object,
    arrivalDate: string,
  };

  static contextTypes = {
    i18n: object,
  };

  closeRegistrationModal = () => {
    this.props.toggleRegistrationModal(false);
  }

  openRegisterModal = () => {
    this.props.popAPIErrorMessage('registerUserAddress', true);
    this.props.toggleRegistrationModal(true);
  }

  render() {
    const { i18n: { applePay } } = this.context;
    const { isRegistrationSuccess, orderDetails = {}, arrivalDate, isRegistrationModalActive } = this.props;

    return (
      <div>
        <OrderItemsSummary
          plannedDates={arrivalDate}
          orderNo={orderDetails.ord_no}
          isApplePayGuestUser
        />
        <div className={styles.outerPanel}>
          <div className={`${styles.flexWrapper} ${styles.toolTipText}`}>
            <Text content={applePay.register} className={styles.applePayPanelTitle} />
            <TSLToolTip />
          </div>
          <Text content={applePay.enterPassword} className={styles.applePayPanelText} />
          <Button
            className={`${styles.toggleRegistrationModalBtn} default secondary medium`}
            label={applePay.registerAsMember}
            onTouchTap={this.openRegisterModal}
            analyticsOn="Button Click"
            analyticsLabel="ApplePay_continue_register"
            analyticsCategory="Checkout Funnel"
          />
        </div>
        <If
          if={isRegistrationModalActive}
          then={ApplePayForm}
          toggleRegistrationModal={this.closeRegistrationModal}
        />
        <If
          if={isRegistrationSuccess}
          then={ApplePayRegistrationSuccess}
          closeRegistrationSuccessModal={this.props.removeOrderAndContinue}
        />
      </div>
    );
  }
}
