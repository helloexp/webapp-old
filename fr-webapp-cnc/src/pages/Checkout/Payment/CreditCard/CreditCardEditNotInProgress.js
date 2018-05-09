import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Button from 'components/uniqlo-ui/Button';

import styles from './styles.scss';

const { object, func, bool } = PropTypes;

const CreditCardEditNotInProgress = ({
  i18n,
  isCardSelected,
  applyCreditCard,
  editCreditCard,
}) => (
  <div>
    <Button
      className={classNames('medium', 'secondary', 'applyButton', styles.applyCreditCard)}
      disabled={!isCardSelected}
      label={i18n.useThisCard}
      labelClass={styles.useThisCardBtn}
      onTouchTap={applyCreditCard}
      preventMultipleClicks
    />
    <Button
      className={classNames('medium', 'overlayButton', styles.otherCardBtn)}
      label={i18n.differentCard}
      onTouchTap={editCreditCard}
      noLabelStyles
    />
  </div>
);

CreditCardEditNotInProgress.propTypes = {
  i18n: object,
  isCardSelected: bool,
  applyCreditCard: func,
  editCreditCard: func,
};

export default CreditCardEditNotInProgress;
