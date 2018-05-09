import React, { PureComponent, PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import { maskCardNumber, expirationDate } from 'utils/format';
import styles from './styles.scss';

const { bool, string, object } = PropTypes;

function renderRow(label, value) {
  return (
    <div>
      <Text>{label} : </Text>
      <Text className={styles.valueField}>{value}</Text>
    </div>
  );
}

export default class CreditCardPanel extends PureComponent {
  static propTypes = {
    className: string,
    creditInfo: object,
    showCvv: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const {
      props: {
        className,
        creditInfo,
        showCvv,
      },
      context: {
        i18n: {
          creditCard,
        },
      },
    } = this;

    const cvvRow = showCvv
      ? renderRow(creditCard.cvv, '***')
      : null;

    return (
      <Container className={className}>
        {renderRow(creditCard.cardCompany, creditInfo.cardType)}
        {renderRow(creditCard.cardNumber, maskCardNumber(creditInfo.ccLastFourDigits || creditInfo.maskedCardNo))}
        {renderRow(creditCard.validityPeriod, expirationDate(creditInfo))}
        {cvvRow}
        {renderRow(creditCard.cardHolder, creditInfo.name || creditInfo.cardHolder)}
      </Container>
    );
  }
}
