import React, { PropTypes } from 'react';
import noop from 'utils/noop';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import stylePropsParser from '../../helpers/utils/stylePropParser';
import styles from './Dropdown.scss';

const { oneOfType, node, string, func, number, bool } = PropTypes;

const onItemClick = (props) => {
  const { value, index, label } = props;
  const selectedValue = value || label;

  props.onClick({ value: selectedValue, index, label });
};

const DropdownItem = (props) => {
  const { children, className, selected, label, index } = props;
  let selectedClass = selected && index < 0 ? styles.selectedItem : styles.dropdownItem;

  selectedClass = selected && index >= 0 ? styles.selectedMenuItem : selectedClass;
  const itemClass = mergeClasses(selectedClass, stylePropsParser(className, styles));
  const clickHandler = onItemClick.bind(this, props);

  return (
    <div className={itemClass} onClick={clickHandler}>
      <div className={styles.childWrapper}>{children}</div>
      {label}
    </div>
  );
};

DropdownItem.propTypes = {
  children: node,
  className: string,
  onClick: func,
  label: string,
  index: number,
  selected: bool,
  value: oneOfType([string, number]),
};

DropdownItem.defaultProps = {
  onClick: noop,
};

export default DropdownItem;
