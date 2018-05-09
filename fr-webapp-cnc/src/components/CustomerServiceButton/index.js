import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { getBrand } from 'redux/modules/cart/selectors';
import Link from 'components/uniqlo-ui/Link';
import styles from './styles.scss';

const { bool, object, string } = PropTypes;

@connect((state, props) => ({
  brand: getBrand(state, props),
}))
export default class CustomerServiceButton extends PureComponent {
  static propTypes = {
    brand: string,
    noMargin: bool,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  render() {
    const { brand, noMargin } = this.props;
    const { i18n: { customerService }, config: { customer: { guide } } } = this.context;
    const marginCls = noMargin ? '' : styles.horizontalMargin;

    return (
      <Link
        caret
        className={classNames(styles.linkWrapper, marginCls)}
        contentType="linkTab"
        target="_blank"
        label={customerService.needHelp}
        to={guide[brand]}
        analyticsOn="Button Click"
        analyticsLabel="Help click"
        analyticsCategory="Checkout Funnel"
      />
    );
  }
}
