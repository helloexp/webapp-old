import React, { PureComponent, PropTypes } from 'react';
import constants from 'config/site/default';

const { object } = PropTypes;

function getLengthName(transaction) {
  if (!transaction.alteration_flag) {
    return '';
  }

  if (!constants.hemming[transaction.alteration_flag]) {
    return constants.hemming.default.name;
  }

  return constants.hemming[transaction.alteration_flag].name;
}

export default class ItemText extends PureComponent {
  static propTypes = {
    transaction: object,
    mySizeLabels: object,
  };

  render() {
    const { mySizeLabels, transaction } = this.props;
    const purchasedLengths = [];
    const lengthName = getLengthName(transaction);

    if (lengthName) {
      Object.keys(transaction.alteration).forEach(alterationKey => purchasedLengths.push(`${transaction.alteration[alterationKey]} ${mySizeLabels.unitCm}`));
    }

    return (
      <div>
        <div>{`${mySizeLabels.productSize}: ${transaction.genderName} ${transaction.size}`}</div>
        {lengthName && <div>{`${lengthName}: ${purchasedLengths.join(', ')}`}</div>}
      </div>
    );
  }
}
