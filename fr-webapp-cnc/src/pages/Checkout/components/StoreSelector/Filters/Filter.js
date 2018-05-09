import React, { PureComponent, PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import noop from 'utils/noop';
import classNames from 'classnames/bind';
import styles from './styles.scss';

const { string, any, object } = PropTypes;
const cx = classNames.bind(styles);

class Filter extends PureComponent {
  static propTypes = {
    name: string,
    value: any,
    selections: object,
    label: string,
    trueValue: any,
    falseValue: any,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: noop,
  };

  onToggle = () => {
    const {
      name,
      trueValue,
      falseValue,
      value,
      onChange,
    } = this.props;
    const current = !this.isChecked();
    let filterValue = value || current;

    if (current && trueValue) {
      filterValue = trueValue;
    } else if (!current && falseValue) {
      filterValue = falseValue;
    }

    onChange(name, current, filterValue);
  }

  isChecked() {
    const { name, value, selections } = this.props;

    return selections && selections[name] && selections[name].includes(value);
  }

  render() {
    const { label } = this.props;
    const checked = this.isChecked();
    const filterButtonClass = cx('filter', 'default', 'small', {
      selected: checked,
    });
    const onclickFilterClass = cx('filterCt', { selected: checked });

    return (
      <div className={onclickFilterClass} onClick={this.onToggle}>
        <span className={styles.filterIcon} />
        <Button
          className={filterButtonClass}
          label={label}
          noLabelStyles
        />
      </div>
    );
  }
}

export default Filter;
