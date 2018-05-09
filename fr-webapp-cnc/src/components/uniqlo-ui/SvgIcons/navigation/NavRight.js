import React, { PropTypes } from 'react';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import stylePropsParser from '../../helpers/utils/stylePropParser';
import styles from './NavRight.scss';

const NavRight = (props) => {
  const rootClasses = mergeClasses(styles.navRight, stylePropsParser(props.className, styles));

  return (
    <svg className={rootClasses} height="24" viewBox="0 0 24 24" width="24">
      <polyline className={styles.arrowPolyline} points="15.76,12 9.73,19 8.24,17.66 13.12,12 8.24,6.34 9.73,5" />
    </svg>
  );
};

NavRight.propTypes = {
  className: PropTypes.string,
};

export default NavRight;
