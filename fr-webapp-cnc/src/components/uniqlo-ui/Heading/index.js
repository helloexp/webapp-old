import React, { PropTypes } from 'react';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import { mergeClasses } from '../helpers/utils/stylePropable';
import styles from './Heading.scss';

const { string, func, oneOf, oneOfType, array, object, node } = PropTypes;

const Heading = ({
  className,
  children,
  headingText,
  type,
  id,
  onPress,
}) => {
  let compType = type || 'h1';

  const headingProps = {
    className: mergeClasses(styles.heading, stylePropsParser(className, styles),
      stylePropsParser(compType, styles)),
    onClick: onPress,
  };

  if (id) {
    headingProps.id = id;
  }

  compType = compType === 'h2Hrule' ? 'h2' : compType;

  return React.createElement(compType, headingProps, headingText, children);
};

Heading.propTypes = {
  className: string,
  headingText: oneOfType([string, node, object]),
  id: string,
  onPress: func,
  type: oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr1', 'hr2']),
  children: oneOfType([array, object, node]),
};

Heading.defaultProps = {
  onPress: () => null,
};

export default Heading;
