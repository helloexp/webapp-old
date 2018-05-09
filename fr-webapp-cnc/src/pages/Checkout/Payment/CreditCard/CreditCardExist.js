import React, { PropTypes } from 'react';
import If from 'components/uniqlo-ui/If';
import MessageBox from 'components/MessageBox';
import CreditCardEditor from './CreditCardEditor';
import CreditCardEditNotInProgress from './CreditCardEditNotInProgress';
import CreditCardPreview from './CreditCardPreview';

import styles from './styles.scss';

export default function CreditCardExist(props) {
  const {
    i18n,
    confirmDelete,
    temporalCreditCard,
    savedCreditCard,
    isCardSelected,
    isEditInProgress,
    isDeletePopup,
    selectCard,
    handleDelete,
    editCreditCard,
    applyCreditCard,
  } = props;

  return (
    <div className={styles.creditPayment}>
      <If
        if={savedCreditCard.dbKey}
        then={CreditCardPreview}
        creditCard={savedCreditCard}
        selectCard={selectCard}
        confirmDelete={confirmDelete}
      />
      <If
        if={!isEditInProgress && temporalCreditCard.ccLastFourDigits && temporalCreditCard.cardCvv}
        then={CreditCardPreview}
        creditCard={temporalCreditCard}
        selectCard={selectCard}
        confirmDelete={confirmDelete}
      />
      <If
        if={isEditInProgress}
        then={CreditCardEditor}
        else={CreditCardEditNotInProgress}
        i18n={i18n}
        isCardSelected={isCardSelected}
        editCreditCard={editCreditCard}
        applyCreditCard={applyCreditCard}
      />
      <If
        if={isDeletePopup}
        then={MessageBox}
        confirmLabel={i18n.deleteCardOk}
        message={i18n.deleteCardConfirmText}
        onAction={handleDelete}
        rejectLabel={i18n.deleteCardCancel}
        stickyBox
        title=""
        variation="confirm"
      />
    </div>
  );
}

const { object, func, bool } = PropTypes;

CreditCardExist.propTypes = {
  i18n: object,
  temporalCreditCard: object,
  savedCreditCard: object,
  isCardSelected: bool,
  isEditInProgress: bool,
  isDeletePopup: bool,
  selectCard: func,
  confirmDelete: func,
  handleDelete: func,
  editCreditCard: func,
  applyCreditCard: func,
};
