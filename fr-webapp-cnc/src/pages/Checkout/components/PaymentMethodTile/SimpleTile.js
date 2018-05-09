import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Link from 'components/uniqlo-ui/Link';
import If from 'components/uniqlo-ui/If';
import { multilineMessage } from 'utils/format';
import styles from './styles.scss';

const { object, string, bool } = PropTypes;

const PaymentLink = ({ paymentLink, editLabel }) => (
  <Link
    className={styles.editLink}
    editLink
    label={editLabel}
    to={paymentLink}
  />
);

PaymentLink.propTypes = {
  paymentLink: string,
  editLabel: string,
};

const SimpleTile = (props, context) => {
  const { i18n: { paymentMethod: paymentMethodTexts, common }, config: { payment: paymentMethods } } = context;
  const paymentMethodText = props.paymentType === paymentMethods.postPay
    ? multilineMessage(paymentMethodTexts.postPay, styles.postPayText)
    : paymentMethodTexts.cashOnDelivery;

  return (
    <Container className={`z8 ${styles.tileContainer}`} >
      <Text className={`tileHead ${styles.paymentTileText}`}>{paymentMethodText}</Text>
      <If
        editLabel={common.edit}
        if={props.editable}
        paymentLink={props.paymentLink}
        then={PaymentLink}
      />
    </Container>
  );
};

SimpleTile.propTypes = {
  paymentLink: string,
  paymentType: string,
  editable: bool,
};

SimpleTile.contextTypes = {
  i18n: object,
  config: object,
};

export default SimpleTile;
