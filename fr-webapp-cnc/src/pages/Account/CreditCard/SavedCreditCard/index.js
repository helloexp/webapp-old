import React, { PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Grid from 'components/uniqlo-ui/core/Grid';
import GridCell from 'components/uniqlo-ui/core/GridCell';
import Icon from 'components/uniqlo-ui/core/Icon';
import CreditCardPanel from '../CreditCardPanel';
import styles from './styles.scss';

const { object, func } = PropTypes;

const SavedCreditCard = ({ creditInfo, onRemove, onAdd, onEdit }, context) => {
  const { creditCard } = context.i18n;
  const content = Object.getOwnPropertyNames(creditInfo).length > 0
    ? (<div className={styles.creditCardDetails}>
      <CreditCardPanel className={styles.creditCardPanel} creditInfo={creditInfo} />
      <Grid className={styles.editCreditCardContainer}>
        <GridCell className={styles.editCreditCardCell}>
          <Button
            className={`default small ${styles.footerEdit}`}
            label={creditCard.edit}
            noLabelStyles
            labelClass={styles.footerEdit}
            onTouchTap={onEdit}
          />
        </GridCell>
        <GridCell className={styles.removeCreditCardCell}>
          <Button
            className="default small"
            noLabelStyles
            labelClass={styles.footerDelete}
            onTouchTap={onRemove}
          >
            <Icon className="iconClose" styleClass={styles.footerDelete} />
          </Button>
        </GridCell>
      </Grid>
    </div>)
    : <Text className={`blockText ${styles.emptyMessage}`}>{creditCard.emptyCardMessage}</Text>;

  return (
    <div>
      {content}
      <Button
        noLabelStyles
        className={`medium ${styles.addButton}`}
        label={creditCard.registerNewCard}
        onTouchTap={onAdd}
        analyticsOn="Click"
        analyticsLabel="Register credit card"
        analyticsCategory="Member Info"
      />
      <Text className={styles.disclaimer}>{creditCard.disclaimer}</Text>
    </div>
  );
};

SavedCreditCard.propTypes = {
  creditInfo: object,
  onAdd: func,
  onEdit: func,
  onRemove: func,
};

SavedCreditCard.contextTypes = {
  i18n: object,
};

SavedCreditCard.defaultProps = {
  creditInfo: {},
};

export default SavedCreditCard;
