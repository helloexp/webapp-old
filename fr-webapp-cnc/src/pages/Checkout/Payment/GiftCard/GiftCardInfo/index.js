import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { redirect, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import { setCheckoutStatus } from 'redux/modules/checkout';
import { maskCardNumber, formatPrice } from 'utils/format';
import { formateLastUpdateDate } from 'utils/formatDate';
import cx from 'classnames';
import BalanceDueDetails from '../BalanceDueDetails';
import PaymentOptions from '../PaymentOptions';
import styles from '../styles.scss';

const { bool, object, func, string } = PropTypes;

function AvailableBalanceInfo({ giftCard, i18n }) {
  const expiry = giftCard.expires || giftCard.expDate;
  const expDate = expiry ? formateLastUpdateDate(expiry).split('T')[0].replace(/-/g, '/') : '';

  return (
    <div className={styles.infoContainer}>
      <Text className={styles.label}> {i18n.fundsAvailable}</Text>
      <Text className={styles.info}> {formatPrice(giftCard.balance)}</Text>
      <Text className={styles.label}> {i18n.expDate}</Text>
      <Text className={styles.info}> {expDate}</Text>
    </div>
  );
}

AvailableBalanceInfo.propTypes = {
  giftCard: object,
  i18n: object,
  expDate: string,
};

const DebitedAmountInfo = ({ giftCard, i18n }) => (
  <div className={styles.infoContainer}>
    <Text className={styles.label}> {i18n.fundsAvailable}</Text>
    <Text className={styles.info}> {formatPrice(giftCard.balance)}</Text>
  </div>
);

DebitedAmountInfo.propTypes = {
  giftCard: object,
  i18n: object,
};

@connect(null, { setCheckoutStatus })
export default class GiftCardInfo extends PureComponent {
  static propTypes = {
    brand: string,
    giftCard: object,
    isEditingGiftCard: bool,
    onChangeHandler: func,
    onRemove: func,
    setCheckoutStatus: func,
    shouldShowContinueButton: bool,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  deleteHandler = () => {
    const { giftCard, onRemove } = this.props;

    onRemove(giftCard.index);
  };

  reviewHandler = () => {
    const { brand } = this.props;
    const { config: { pages: { PAYMENT } } } = this.context;

    this.props.setCheckoutStatus(PAYMENT);
    redirect(getUrlWithQueryData(routes.reviewOrder, { brand }));
  };

  render() {
    const { giftCard, isEditingGiftCard, onChangeHandler, shouldShowContinueButton } = this.props;
    const { payWithGiftCard, common } = this.context.i18n;
    const maskedCardNumber = maskCardNumber(String(giftCard.number));
    const payment = parseFloat(giftCard.payment);

    return (
      <div className={styles.giftCardDetails}>
        <Text className={cx(styles.label, styles.cardHead)}>
          {payWithGiftCard.giftCardNumber}
          <If
            if={giftCard.requestNumber}
            then={Button}
            className="editButton small"
            label={common.deleteText}
            onTouchTap={this.deleteHandler}
          />
        </Text>
        <Text className={styles.info}>{maskedCardNumber}</Text>
        <If
          if={payment > 0}
          then={DebitedAmountInfo}
          else={AvailableBalanceInfo}
          giftCard={giftCard}
          i18n={payWithGiftCard}
        />
        <If
          if={isEditingGiftCard}
          then={PaymentOptions}
          else={BalanceDueDetails}
          giftCard={giftCard}
          onChangeHandler={onChangeHandler}
        />
        <If
          if={shouldShowContinueButton}
          then={Button}
          className="medium secondary"
          label={common.continueText}
          onTouchTap={this.reviewHandler}
        />
      </div>
    );
  }
}
