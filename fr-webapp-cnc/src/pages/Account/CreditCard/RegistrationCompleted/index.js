import React, { PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import { root } from 'utils/routing';
import Helmet from 'react-helmet';
import styles from './styles.scss';

const RegistrationCompleted = (props, context) => {
  const { creditCard } = context.i18n;

  return (
    <div className={styles.mainContainer}>
      <Helmet title={creditCard.registrationHeading} />
      <Heading className={`${styles.heading}`} headingText={creditCard.registrationHeading} type="h2" />
      <Container className={`z2 ${styles.content}`}>
        <Text className={`blockText ${styles.completed}`}>{creditCard.registrationCompleted}</Text>
        <Text className="blockText">{creditCard.cardReplaced}</Text>
      </Container>
      <div className={styles.backButton}>
        <Button
          className={`default medium ${styles.backButton}`}
          label={creditCard.backToCards}
          link={`${root}/account/creditcards`}
          analyticsOn="Click"
          analyticsLabel="Back to cardinfo"
          analyticsCategory="Member Info"
        />
      </div>
    </div>
  );
};

RegistrationCompleted.contextTypes = {
  i18n: PropTypes.object,
};

export default RegistrationCompleted;
