import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import Container from 'components/uniqlo-ui/core/Container';
import Link from 'components/uniqlo-ui/Link';
import If from 'components/uniqlo-ui/If';
import { maskCardNumber } from 'utils/format';
import CardValidator from 'utils/CardValidator';
import CvvModal from 'components/CreditCardForm/CvvModal';
import visa from 'components/CreditCardForm/images/visa.png';
import jcb from 'components/CreditCardForm/images/jcb.png';
import master from 'components/CreditCardForm/images/master.png';
import amex from 'components/CreditCardForm/images/amex.png';
import diners from 'components/CreditCardForm/images/diners.png';
import TSLToolTip from 'components/TSLToolTip';
import cx from 'classnames';
import ErrorMessageTile from './ErrorMessageTile';
import CvvInput from './CvvInput';
import styles from './styles.scss';

const cardImages = {
  visa,
  jcb,
  'master-card': master,
  'american-express': amex,
  'diners-club': diners,
};
const cardNumberStyles = {
  fontSize: '13px',
};

const { object, string, bool, func } = PropTypes;

const classNames = {
  creditCardImage: cx('cardImage', styles.creditCardImage),
};

const InvalidCreditCardMsg = ({ paymentMethodMsgs }) =>
  <Text className="error">{paymentMethodMsgs.invalidCreditCard}</Text>;

InvalidCreditCardMsg.propTypes = {
  paymentMethodMsgs: object,
};

const CreditCardTile = (props, context) => {
  const { paymentMethod, common, payment } = context.i18n;
  const {
    errorMessage,
    creditCard,
    isApplied,
    paymentLink,
    billingAddress,
    applyCreditCard,
    editCvv,
    cvv,
    onComplete,
    isShowCvvToolTip,
    showErrorMessage,
    disableApplyCreditCard,
    creditCardValid,
    hideBilling,
    variation,
    className,
    onCvvInfoPress,
    isShowInfo,
  } = props;

  const cardNumber = creditCard.maskedCardNo || creditCard.ccLastFourDigits;
  const maskedCardNumber = cardNumber ? maskCardNumber(String(cardNumber)) : '---- ---- ---- ----';
  const isNotPaymentVariation = variation !== 'payment';
  const cardNumberText = isNotPaymentVariation ? <Text>{maskedCardNumber}</Text> : <span>{maskedCardNumber}</span>;

  const rootClass = cx(styles.tileContainer, {
    [styles[className]]: className && styles[className],
    [className]: className && !styles[className],
  });

  const card = cardNumber ? CardValidator.crediCardType(cardNumber) : null;
  const imageSrc = card && card.length ? cardImages[card[0].type] : cardImages.visa;

  return (
    <Container className={rootClass} >
      <ErrorMessageTile
        showError={showErrorMessage}
        message={errorMessage}
      />
      { isNotPaymentVariation
        ? (<Container className={`z8 ${styles.smallBottomPadding}`}>
            <Text className="tileHead" >{paymentMethod.creditCard}</Text>
            <If
              if={paymentLink}
              then={Link}
              className={styles.editLink}
              label={common.edit}
              to={paymentLink}
            />
          </Container>)
        : null
      }
      <If if={!creditCardValid} paymentMethodMsgs={paymentMethod} then={InvalidCreditCardMsg} />
      <div>
        <Image className={classNames.creditCardImage} source={imageSrc} />
        <If
          if={creditCard.dbKey}
          then={Text}
          content={payment.savedCreditCard}
          className={styles.savedCreditCard}
        />
      </div>
      <Text
        className={cx('cardNumber leftRightTextWrapper', {
          error: !creditCardValid,
          [styles.reviewTileText]: isNotPaymentVariation,
        })}
        style={cardNumberStyles}
      >
        {cardNumberText}
        <If
          if={isNotPaymentVariation}
          then={TSLToolTip}
        />
      </Text>
      <If
        if={!isApplied}
        then={CvvInput}
        billingAddress={billingAddress}
        applyCreditCard={applyCreditCard}
        editCvv={editCvv}
        cvv={cvv}
        isShowCvvToolTip={isShowCvvToolTip}
        onComplete={onComplete}
        disableApplyCreditCard={disableApplyCreditCard}
        hideBilling={hideBilling}
        onCvvInfoPress={onCvvInfoPress}
      />
      <If
        if={isShowInfo}
        then={CvvModal}
        onCancel={onCvvInfoPress}
      />
    </Container>
  );
};

CreditCardTile.propTypes = {
  creditCard: object,
  errorMessage: string,
  paymentLink: string,
  isApplied: bool,
  billingAddress: object,
  applyCreditCard: func,
  editCvv: func,
  cvv: string,
  isShowCvvToolTip: bool,
  disableApplyCreditCard: bool,
  creditCardValid: bool,
  hideBilling: bool,
  onComplete: func,
  hideTitle: func,
  className: string,
  showErrorMessage: bool,
  variation: string,
  onCvvInfoPress: func,
  isShowInfo: bool,
};

CreditCardTile.defaultProps = {
  cvv: '',
};

CreditCardTile.contextTypes = {
  i18n: PropTypes.object,
};

export default CreditCardTile;
