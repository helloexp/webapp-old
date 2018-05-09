import React, { PureComponent, PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Button from 'components/uniqlo-ui/Button';
import Container from 'components/uniqlo-ui/core/Container';
import Drawer from 'components/Drawer';
import Link from 'components/uniqlo-ui/Link';
import { connect } from 'react-redux';
import { removeOrderAndContinue } from 'redux/modules/checkout/order';
import { checkUQNativeApp, checkGUNativeApp } from 'helpers/NativeAppHelper';
import styles from './styles.scss';
import RegistrationInfoModal from './RegistrationInfoModal';

const { func, object } = PropTypes;

@connect(null, { removeOrderAndContinue })
export default class ApplePayRegistrationSuccess extends PureComponent {
  static propTypes = {
    removeOrderAndContinue: func,
    closeRegistrationSuccessModal: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    isRegistrationInfoModalActive: false,
  };

  toggleRegistrationInfoModal = () => {
    this.setState({ isRegistrationInfoModalActive: !this.state.isRegistrationInfoModalActive });
  }

  render() {
    const { i18n: { applePay, common }, config: { applePay: applePayLinks } } = this.context;
    const { closeRegistrationSuccessModal } = this.props;
    const { isRegistrationInfoModalActive } = this.state;

    if (isRegistrationInfoModalActive) {
      return <RegistrationInfoModal toggleRegistrationInfoModal={this.toggleRegistrationInfoModal} />;
    }

    let notReceiveMailLink = applePayLinks.notReceiveMail;

    if (checkUQNativeApp()) {
      notReceiveMailLink = `${notReceiveMailLink}?${applePayLinks.browserFlag.uq}`;
    } else if (checkGUNativeApp()) {
      notReceiveMailLink = `${notReceiveMailLink}?${applePayLinks.browserFlag.gu}`;
    }

    return (
      <Drawer
        onCancel={closeRegistrationSuccessModal}
        title={applePay.registrationComplete}
        variation="noFooter"
        cartSpacing="cartSpacingSubTitle"
        noMargin
        noNavBar
        className="applePayRegSuccessDrawer"
      >
        <Container>
          <Text content={applePay.thankyouForRegistration} className={`${styles.largeBottomMargin} ${styles.baseBlockText}`} />
          <div className={styles.flexWrapper}>
            <Text content={applePay.checkConfirmMail} className={`${styles.baseBlockText} ${styles.registrationPolicy}`} />
            <span className={styles.infoIcon} onClick={this.toggleRegistrationInfoModal} />
          </div>
          <div className={styles.notReceiveMailWrapper}>
            <Link
              className={styles.notReceiveMail}
              contentType="linkTab"
              target="_blank"
              to={notReceiveMailLink}
            >
              {applePay.notReceiveMail}
            </Link>
          </div>
          <Text content={applePay.orderHistoryFromNextPurchase} className={styles.baseBlockText} />
          <Button
            label={common.continueShopping}
            onTouchTap={this.props.removeOrderAndContinue}
            className={`${styles.continueShopping} default medium`}
            analyticsOn="Button Click"
            analyticsCategory="Checkout Funnel"
            analyticsLabel="ApplePay_continue_shopping"
          />
        </Container>
      </Drawer>
    );
  }
}
