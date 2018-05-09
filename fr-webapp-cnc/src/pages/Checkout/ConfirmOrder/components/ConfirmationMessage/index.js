import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import constants from 'config/site/default';
import InfoToolTip from 'components/InfoToolTip';
import classNames from 'classnames';
import styles from './styles.scss';

const { bool, object, string } = PropTypes;

const MessageTexts = ({ orderConfirmationMsgs, showToolTip }) => {
  const confirmationMsgStyle = `confirmationMsg ${styles.confirmationMessage}`;

  return (
    <Container>
      <div className={styles.confirmHeader}>
        <Text className={classNames('confirmationMsg', styles.confirmationMessage)}>{orderConfirmationMsgs.confirmationMsg}</Text>
        <If if={showToolTip}>
          <InfoToolTip position="bottom">
            <div className={styles.toolTipText}>
              {orderConfirmationMsgs.toolTipText1.map((text, idx) => <div key={idx}>{text}</div>)}
            </div>
          </InfoToolTip>
        </If>
      </div>
      <Text className={confirmationMsgStyle}>{orderConfirmationMsgs.completionMsg}</Text>
    </Container>
  );
};

MessageTexts.propTypes = {
  orderConfirmationMsgs: object,
  showToolTip: bool,
};

const ConfirmationMessage = (props, context) => {
  const { orderConfirmation } = context.i18n;
  const { showToolTip } = props;

  return (
    <div className={styles.confirmationMsgWrap}>
      <Heading
        className={`confirmationSectionTitle ${styles.confirmationTitle}`}
        headingText={orderConfirmation.orderCompletion}
        type="h3"
      />
      <If
        if={props.paymentType !== constants.payment.uniqloStore}
        orderConfirmationMsgs={orderConfirmation}
        showToolTip={showToolTip}
        then={MessageTexts}
      />
    </div>
  );
};

ConfirmationMessage.contextTypes = {
  i18n: object,
};

ConfirmationMessage.propTypes = {
  paymentType: string,
  showToolTip: bool,
};

export default ConfirmationMessage;
