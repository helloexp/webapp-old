import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import Radio from 'components/Atoms/Radio';
import cx from 'classnames';
import styles from './styles.scss';

const { string, bool, func, node, any } = PropTypes;

export default class Selector extends PureComponent {
  static propTypes = {
    label: string,
    description: node,
    name: string,
    value: any,
    checked: bool,
    price: string,
    onChange: func,
    children: node,
    variation: string,
    labelStyle: string,
    enabled: bool,
    editButton: node,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    enabled: true,
    onChange: noop,
  };

  setValue = (event) => {
    const {
      onChange,
    } = this.props;

    onChange(event.target.value);
  };

  render() {
    const {
      label,
      description,
      name,
      value,
      checked,
      price,
      children,
      enabled,
      labelStyle,
      editButton,

      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;
    const priceElement = price
      ? <span className={styles.price}>{price}</span>
      : null;
    const descriptionElement = description
      ? <div className={styles.descriptionLabel}>{ description }</div>
      : null;
    const editButtonUI = editButton
      ? <span className={styles.editButton}>{ editButton }</span>
      : null;

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-category': analyticsCategory,
    };

    return (
      <div className={cx({ [styles.disabledSelector]: !enabled })}>
        <label className={cx(styles.header, labelStyle)}>
          <Radio
            checked={checked}
            name={name}
            onChange={this.setValue}
            value={value}
            className={styles.radio}
            {...analyticsAttrs}
          />
          <div className={styles.title}>
            <div className={styles.labelPriceWrap}>
            <span className={styles.labelEdit}>
              { label } { priceElement }
            </span>
              { editButtonUI }
            </div>
            { descriptionElement }
          </div>
        </label>
        <div className={cx({ [styles.hidden]: !checked })}>
          { children }
        </div>
      </div>
    );
  }
}
