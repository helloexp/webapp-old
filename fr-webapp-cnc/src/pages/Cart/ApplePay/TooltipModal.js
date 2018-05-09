import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';
import Text from 'components/uniqlo-ui/Text';
import Drawer from 'components/Drawer';
import Link from 'components/uniqlo-ui/Link';
import Image from 'components/uniqlo-ui/Image';
import jcb from 'components/CreditCardForm/images/jcb.png';
import master from 'components/CreditCardForm/images/master.png';
import amex from 'components/CreditCardForm/images/amex.png';
import { checkUQNativeApp, checkGUNativeApp } from 'helpers/NativeAppHelper';
import styles from './styles.scss';

const { object, func } = PropTypes;

function cards() {
  return [jcb, master, amex].map((cardImage, index) =>
    <Image
      key={index}
      className={cx('cardCvvImage', 'withImageTag')}
      source={cardImage}
    />
  );
}

class TooltipModal extends PureComponent {
  componentDidMount() {
    document.body.classList.add(styles.modalOpen);
  }

  componentWillUnmount() {
    document.body.classList.remove(styles.modalOpen);
  }

  render() {
    const { toggleModal } = this.props;
    const { i18n: { applePay: applePayConfig }, config: { applePay: applePayLinks } } = this.context;
    let appleWebsiteLink = applePayLinks.appleWebsite;

    if (checkUQNativeApp()) {
      appleWebsiteLink = `${appleWebsiteLink}?${applePayLinks.browserFlag.uq}`;
    } else if (checkGUNativeApp()) {
      appleWebsiteLink = `${appleWebsiteLink}?${applePayLinks.browserFlag.gu}`;
    }

    return (
      <Drawer
        cartSpacing="cartSpacingTitle"
        onCancel={toggleModal}
        title={applePayConfig.aboutApplePay}
        variation="noFooter"
        className="applePayDrawer"
        noMargin
        noNavBar
      >
        <Text className={styles.applePayDrawerText}>{applePayConfig.aboutApplePayText}</Text>
        <Text className={styles.applePayDrawerText}>{applePayConfig.applePayShippingFeeText}</Text>
        <Text className={styles.applePayDrawerSubHeading}>{applePayConfig.aboutApplePayHeading}</Text>
        <Text className={styles.applePayDrawerText}>{applePayConfig.applePayInfo}</Text>
        <Text className={styles.applePayDrawerText}>{applePayConfig.howToUseApplePay}</Text>
        <Link
          contentType="linkTab"
          target="_blank"
          to={appleWebsiteLink}
          analyticsOn="Button Click"
          analyticsLabel="ApplePayOfficialSite"
          analyticsCategory="Checkout Funnel"
        >
          <span className={styles.appleWebsiteLink}>{applePayConfig.appleWebsite}</span>
        </Link>
        <Text className={styles.applePayDrawerText}>{applePayConfig.enquiryByPhone}</Text>
        <div className={styles.applePayContact}>
          <Text className={styles.applePayContactHeading}>{applePayConfig.contactDetails[0].name}</Text>
          <Text className={styles.applePayContactNumber}>{`: ${applePayConfig.contactDetails[0].value}`}</Text>
        </div>
        <div className={styles.applePayContact}>
          <Text className={styles.applePayContactHeading}>{applePayConfig.contactDetails[1].name}</Text>
          <Text className={styles.applePayContactNumber}>{`: ${applePayConfig.contactDetails[1].value}`}</Text>
        </div>
        <Text className={styles.applePayDrawerSubHeading}>{applePayConfig.aboutCreditCards}</Text>
        <Text className={styles.applePayDrawerText}>{applePayConfig.availableCreditCards}</Text>
        <div className={styles.imageWrap}>
          {cards()}
        </div>
        <Text className={styles.applePayDrawerSubHeading}>{applePayConfig.noRegistrationOrLoginHeading}</Text>
        <Text className={styles.applePayDrawerText}>{applePayConfig.noRegistrationOrLoginText}</Text>
        <Text className={styles.applePayDrawerSubHeading}>{applePayConfig.notesOnUsingApplePayHeading}</Text>
        <Text className={styles.notesOnUsingApplePayText}>{applePayConfig.notesOnUsingApplePayText}</Text>
      </Drawer>
    );
  }
}

TooltipModal.propTypes = {
  toggleModal: func,
};

TooltipModal.contextTypes = {
  i18n: object,
  config: object,
};

export default TooltipModal;
