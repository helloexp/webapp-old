import React, { PropTypes, Component } from 'react';
import Button from 'components/uniqlo-ui/Button';
import styles from './styles.scss';

const { func, object } = PropTypes;

export default class CouponButton extends Component {

  static propTypes = {
    item: object,
    onAddPress: func,
    onRemovePress: func,
  };

  static contextTypes = {
    i18n: object,
  };

  onRemove = () => this.props.onRemovePress(this.props.item);

  onAdd = () => this.props.onAddPress(this.props.item);

  render() {
    const { item } = this.props;
    const { common } = this.context.i18n;
    const buttonProps = item.selected
      ? { onTouchTap: this.onRemove, label: common.deselect }
      : { onTouchTap: this.onAdd, label: common.select, disabled: !(item.valid && !item.isUsed) };

    const analyticsProps = {
      analyticsOn: 'Button Click',
      analyticsCategory: 'Checkout Funnel',
      analyticsLabel: item.selected ? 'Couponout' : 'Couponon',
    };

    return (
      <Button
        className={styles.addBtn}
        labelClass={styles.buttonSpan}
        {...buttonProps}
        {...analyticsProps}
        preventMultipleClicks
      />
    );
  }

}
