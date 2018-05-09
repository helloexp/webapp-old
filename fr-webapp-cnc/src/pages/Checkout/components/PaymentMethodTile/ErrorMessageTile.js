import React, { PropTypes } from 'react';
import If from 'components/uniqlo-ui/If';
import Text from 'components/uniqlo-ui/Text';
import styles from './styles.scss';

export default function ErrorMessageTile({ showError, message }) {
  return (
    <If
      if={showError}
      then={Text}
      content={message}
      className={showError ? styles.errorMessage : null}
    />
  );
}

const { bool, string } = PropTypes;

ErrorMessageTile.propTypes = {
  showError: bool,
  message: string,
};
