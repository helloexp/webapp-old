import React, { PropTypes } from 'react';
import cx from 'classnames';
import Text from 'components/uniqlo-ui/Text';
import TSLToolTip from 'components/TSLToolTip';
import Image from 'components/uniqlo-ui/Image';
import Container from 'components/uniqlo-ui/core/Container';
import Link from 'components/uniqlo-ui/Link';
import { formatPrice, maskCardNumber } from 'utils/format';
import ErrorMessageTile from './ErrorMessageTile';
import styles from './styles.scss';

const uniqloLogo = require('images/icn_uq-giftcard.gif');

const { array, bool, object, string, number } = PropTypes;

const GiftCardTile = (props, context) => {
  const { paymentMethod, common } = context.i18n;

  const errorMessage = (
    <ErrorMessageTile
      showError={!!props.errorMessage}
      message={props.errorMessage}
    />
  );

  const maskedCardNumberTextClass = cx('cardNumber', 'leftRightTextWrapper', styles.reviewTileText);
  const priceTextClass = cx('cardNumber', styles.reviewTileText);

  const GiftCard = ({ data, index }) => {
    const maskedCardNumber = maskCardNumber(String(data.number));

    return (
      <Container className={styles.tileContainer}>
        {index === 0 ? errorMessage : null}
        <div className={styles.lastGiftCard}>
          <Container className="z8">
            <Text className="tileHead">{paymentMethod.giftCard}</Text>
            <Link
              className={styles.editLink}
              label={common.edit}
              to={props.paymentLink}
            />
          </Container>
          <Image className="cardImage" source={uniqloLogo} />
          <Text className={maskedCardNumberTextClass}>
            {maskedCardNumber}
            <TSLToolTip />
          </Text>
          <Text className={priceTextClass}>
            {paymentMethod.amountDeducted}: {formatPrice(data.payment)}
          </Text>
        </div>
      </Container>
    );
  };

  GiftCard.propTypes = {
    data: object,
    index: number,
  };

  return (
    <div>
      { props.giftCards.map((giftCard, index) => <GiftCard data={giftCard} index={index} key={giftCard.requestNumber} />) }
    </div>
  );
};

GiftCardTile.contextTypes = {
  i18n: PropTypes.object,
};

GiftCardTile.propTypes = {
  errorMessage: string,
  giftCard: object,
  giftCards: array,
  isPaymentValid: bool,
  paymentLink: string,
};

export default GiftCardTile;
