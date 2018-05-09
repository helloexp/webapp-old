import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import If from 'components/uniqlo-ui/If';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import {
  getBalanceDue as getBalanceDueSelector,
  getBalanceAmount as getBalanceAmountSelector,
  getActiveCard as getActiveCardSelector,
  isAdditionalPaymentRequired as isAdditionalPaymentRequiredSelector,
  isLastAppliedCard as isLastAppliedCardSelector,
} from 'redux/modules/checkout/payment/giftCard/selectors';
import { setEditIndex as setEditIndexAction } from 'redux/modules/checkout/payment/giftCard/actions';
import { formatPrice } from 'utils/format';
import Instructions from './Instructions';
import styles from '../styles.scss';

const { number, object, bool, func } = PropTypes;

@connect(
  (state, props) => ({
    balanceDue: getBalanceDueSelector(state, props),
    balanceAmount: getBalanceAmountSelector(state, props),
    activeCard: getActiveCardSelector(state),
    isAdditionalPaymentRequired: isAdditionalPaymentRequiredSelector(state, props),
    isLastCard: isLastAppliedCardSelector(state, props),
  }), {
    setEditIndex: setEditIndexAction,
  })
export default class BalanceDueDetails extends PureComponent {
  static propTypes = {
    // From selectors
    balanceDue: number,
    balanceAmount: number,
    activeCard: object,
    isAdditionalPaymentRequired: bool,
    isLastCard: bool,

    // From parent components
    giftCard: object,

    // Actions
    setEditIndex: func,
  };

  static contextTypes = {
    i18n: object,
  };

  editHandler = () => {
    const { setEditIndex, giftCard } = this.props;

    setEditIndex(giftCard.index);
  };

  render() {
    const { balanceDue, balanceAmount, isLastCard, giftCard, activeCard, isAdditionalPaymentRequired } = this.props;
    const { payWithGiftCard, common } = this.context.i18n;

    return (
      <div className={styles.balanceDue}>
        <Container className="z8">
          <Text className={`${styles.label} ${styles.noSpacingLabel}`}>{payWithGiftCard.youSpent}</Text>
          <If
            if={activeCard.requestNumber !== giftCard.requestNumber}
            then={Button}
            className="editButton small"
            label={common.edit}
            onTouchTap={this.editHandler}
          />
        </Container>
        <Text className={styles.info}>{formatPrice(balanceAmount)}</Text>
        <If
          if={isAdditionalPaymentRequired && isLastCard}
          then={Instructions}
          balanceDue={balanceDue}
          balanceAmount={balanceAmount}
          index={giftCard.index}
        />
      </div>
    );
  }
}
