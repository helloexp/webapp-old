import React, { PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import Helmet from 'react-helmet';
import styles from './styles.scss';

const RemoveCompleted = (props, context) => {
  const { creditCard } = context.i18n;

  return (
    <div className={styles.mainContainer}>
      <Helmet title={creditCard.removeHeading} />
      <Heading className={`mainHeaderHrule ${styles.heading}`} headingText={creditCard.removeHeading} type="h2" />
      <Container className={`z2 ${styles.content}`}>
        <Text className="blockText">{creditCard.removeCompleted}</Text>
      </Container>
      <Button
        className={`default medium ${styles.backButton}`}
        label={creditCard.backToCards}
        onTouchTap={props.onBackClick}
      />
    </div>
  );
};

RemoveCompleted.contextTypes = {
  i18n: PropTypes.object,
};

RemoveCompleted.propTypes = {
  onBackClick: PropTypes.func,
};

export default RemoveCompleted;
