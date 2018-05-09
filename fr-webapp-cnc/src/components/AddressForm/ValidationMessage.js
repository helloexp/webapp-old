import React, { PropTypes } from 'react';
import styles from './styles.scss';

const { func } = PropTypes;

const ValidationMessage = (props, context) => {
  const errors = context.getErrorMessages();
  const errorDisplay = errors.map((value, index) => (value ? <li key={index}>{value}</li> : null));

  return errors && errors.length ? <ul className={styles.error}>{errorDisplay}</ul> : null;
};

ValidationMessage.contextTypes = {
  getErrorMessages: func,
};

export default ValidationMessage;
