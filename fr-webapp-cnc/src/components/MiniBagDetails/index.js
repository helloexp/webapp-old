import React, { PropTypes } from 'react';
import Container from 'components/uniqlo-ui/core/Container';
import MiniBag from 'components/MiniBag';
import styles from './styles.scss';

const { func } = PropTypes;

const MiniBagDetails = ({ onToggle }) => (
  <div>
    <Container className={styles.overlay} onClick={onToggle} />
    <MiniBag closeAction={onToggle} />
  </div>
);

MiniBagDetails.propTypes = {
  onToggle: func,
};

export default MiniBagDetails;
