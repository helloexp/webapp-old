import React, { PropTypes } from 'react';
import cx from 'classnames';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import { fixBreakLinesFromApi } from 'utils/format';
import styles from './styles.scss';

const { object, bool, string } = PropTypes;

const GiftMessagePreview = ({ title, message, description, review }, context) => {
  const { gifting } = context.i18n;
  const titleElement = title
    ? <Text className="blockText">{title}</Text>
    : null;
  const descriptionElement = description
    ? <Text className="blockText giftMessageContainer">{description}</Text>
    : null;

  return (
    <Container className={`messageContainer ${styles.messageBox}`}>
      <Heading
        headingText={gifting.giftMessage}
        type="h4"
      />
      <Container>
        {titleElement}
        <Text className={cx('blockText', styles.breakLines, { [styles.base1AMinus1]: review })}>{fixBreakLinesFromApi(message)}</Text>
        {descriptionElement}
      </Container>
    </Container>
  );
};

GiftMessagePreview.propTypes = {
  title: string,
  message: string,
  description: string,
  review: bool,
};

GiftMessagePreview.contextTypes = {
  i18n: object,
};

export default GiftMessagePreview;
