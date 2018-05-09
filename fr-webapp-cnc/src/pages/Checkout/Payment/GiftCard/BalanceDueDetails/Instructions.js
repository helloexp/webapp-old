import React, { PropTypes } from 'react';
import { formatPrice } from 'utils/format';
import Text from 'components/uniqlo-ui/Text';
import styles from '../styles.scss';

const balanceDueReg = /\{balanceDue\}/;
const balanceAmountReg = /\{balanceAmount\}/;

export default function Instructions({ balanceAmount, balanceDue, index }, context) {
  const { payWithGiftCard: { selectAdditionalCreditCardPayMethod, selectAdditionalPayMethod } } = context.i18n;

  // Here we are just checking if this gift-card is the third card.
  // If it's the third card then no more cards can be applied.
  // Hence message has to be changed in that scenario.
  const payInstructions = index === 2 ? selectAdditionalCreditCardPayMethod : selectAdditionalPayMethod;
  const instructions = payInstructions
    .replace(balanceDueReg, formatPrice(balanceDue))
    .replace(balanceAmountReg, formatPrice(balanceAmount));

  return (
    <Text className={styles.instructions}>{instructions}</Text>
  );
}

const { number, object } = PropTypes;

Instructions.propTypes = {
  balanceAmount: number,
  balanceDue: number,
  index: number,
};

Instructions.contextTypes = {
  i18n: object,
};
