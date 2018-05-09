import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import styles from './styles.scss';

function FilterSelectedIcon(props) {
  return (
    <div>
      <div className={styles.filterSelectedIcon}>
        <span className={styles.filterSelectedPath1} />
        <span className={styles.filterSelectedPath2} />
        <span className={styles.filterSelectedPath3} />
      </div>
      <Text className={styles.buttonLabeldefault}>{props.label}</Text>
    </div>
  );
}

FilterSelectedIcon.propTypes = {
  label: PropTypes.string,
};

export default FilterSelectedIcon;
