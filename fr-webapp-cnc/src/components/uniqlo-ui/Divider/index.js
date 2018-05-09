import React, { PropTypes } from 'react';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import styles from './Divider.scss';

const { string } = PropTypes;

const propTypes = { className: string };

const Divider = ({ className }) => {
  const dividerClass = mergeClasses(stylePropsParser(className, styles), styles.divider);

  return (
    <hr className={dividerClass} />
  );
};

Divider.propTypes = propTypes;

export default Divider;
