import React, { PureComponent, PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import styles from './styles.scss';

const { func, object } = PropTypes;

export default class SelectButton extends PureComponent {
  static propTypes = {
    onSelect: func,
    value: object,
  };

  static contextTypes = {
    i18n: object,
  };

  onSelectPress = () => {
    const { onSelect, value } = this.props;

    onSelect(value);
  }

  render() {
    const { deliveryStore } = this.context.i18n;

    return (
      <div className={styles.action}>
        <Button
          className={`${styles.selectBtn} default`}
          label={deliveryStore.select}
          labelClass={styles.btnClass}
          onTouchTap={this.onSelectPress}
          noLabelStyles
          preventMultipleClicks
        />
      </div>
    );
  }
}
