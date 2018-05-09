import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import OrderSummary from 'components/OrderSummary';
import ShoppingBagSummary from 'components/ShoppingBagSummary';
import Button from 'components/uniqlo-ui/Button';
import Container from 'components/uniqlo-ui/core/Container';
import styles from './styles.scss';

const { func, object } = PropTypes;

export default class MiniBag extends PureComponent {
  static propTypes = {
    closeAction: func,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { common } = this.context.i18n;
    const { closeAction } = this.props;
    const containerCss = classNames('miniBag', styles.miniBagContainer, styles.miniBagWrapper);

    return (
      <Container className={containerCss}>
        <Container className={styles.summary}>
          <OrderSummary
            headerStyle={styles.titleStyle}
            bottomTileClassName={styles.bottomTile}
            fromCheckout
            fromMinibag
          />
          <ShoppingBagSummary />
          <Button
            className={styles.miniBagClose}
            label={common.close}
            onTouchTap={closeAction}
            labelClass={styles.closeText}
          />
        </Container>
      </Container>
    );
  }
}
