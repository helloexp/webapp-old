import React, { PropTypes } from 'react';
import Drawer from 'components/Drawer';
import Text from 'components/uniqlo-ui/Text';
import { multilineMessage } from 'utils/format';
import styles from './styles.scss';

const { object, func } = PropTypes;

const RegistrationInfoModal = ({ toggleRegistrationInfoModal }, context) => {
  const { i18n: { applePay } } = context;

  return (
    <Drawer
      onCancel={toggleRegistrationInfoModal}
      variation="noFooter"
      cartSpacing="cartSpacingSubTitle"
      noMargin
      noNavBar
    >
      <div className={styles.modalUpperTextWrap}>
        <Text className={styles.baseBlockText} content={applePay.emailRegInfoTitle} />
        <Text className={styles.applePayModalRedText} content={applePay.emailRegInfoSubTitle} />
        <ul>
          <li className={styles.smallBottomMargin}>
            <Text className="blockText" content={applePay.spamSetting} />
            <Text className={styles.applePayModalGreyText} content={applePay.specifyDomain} />
          </li>
          <li className={styles.smallBottomMargin}>
            <Text className="blockText" content={applePay.serverBusy} />
          </li>
          <li className={styles.smallBottomMargin}>
            <Text className="blockText" content={applePay.incorrectEmail} />
          </li>
          <li className={styles.smallBottomMargin}>
            <Text className="blockText" content={applePay.contactGuUniqlo} />
          </li>
        </ul>
      </div>
      <div className={styles.modalLowerTextWrap}>
        <Text className={styles.pleaseNote} content={applePay.pleaseNote} />
        <div className={styles.largeBottomMargin}>
          {multilineMessage(applePay.storeAddressUq)}
          <Text>
            {applePay.freeDial}
            <span className={styles.blackUnderline}>{applePay.mobileUq}</span>
          </Text>
          <Text className={styles.applePayModalGreyText} content={applePay.callMobile} />
          <Text content={applePay.mailAddress} className={styles.mailAddress} />
          <Text className={styles.blackUnderline} content={applePay.mailUq} />
        </div>
        <div className={styles.largeBottomMargin}>
          {multilineMessage(applePay.storeAddressGu)}
          <Text>
            {applePay.freeDial}
            <span className={styles.blackUnderline}>{applePay.mobileGu}</span>
          </Text>
          <Text className={styles.applePayModalGreyText} content={applePay.callMobile} />
          <Text content={applePay.mailAddress} className={styles.mailAddress} />
          <Text className={styles.blackUnderline} content={applePay.mailGu} />
        </div>
      </div>
    </Drawer>
  );
};

RegistrationInfoModal.propTypes = {
  toggleRegistrationInfoModal: func,
};

RegistrationInfoModal.contextTypes = {
  i18n: object,
};

export default RegistrationInfoModal;
