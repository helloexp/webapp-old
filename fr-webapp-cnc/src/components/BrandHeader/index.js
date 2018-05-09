import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { getCart } from 'redux/modules/cart/selectors';
import cx from 'classnames';
import If from 'components/uniqlo-ui/If';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import Button from 'components/uniqlo-ui/Button';
import Grid from 'components/uniqlo-ui/core/Grid';
import GridCell from 'components/uniqlo-ui/core/GridCell';
import guLogo from 'images/gu-logo.svg';
import uqLogo from 'theme/images/icon-header.svg';
import styles from './styles.scss';

const { bool, number, func, string } = PropTypes;

@connect(
  (state, props) => {
    const cart = getCart(state, props);
    const { totalItems } = cart;

    return {
      totalItems,
    };
  },
)
export default class BrandHeader extends PureComponent {
  static propTypes = {
    brand: string,
    totalItems: number,
    goToCart: func,
    isButtonShown: bool,
    wrapperClass: string,
  };

  static defaultProps = {
    isButtonShown: false,
  };

  static contextTypes = {
    i18n: PropTypes.object,
  };

  render() {
    const { brand, totalItems, goToCart, isButtonShown, wrapperClass } = this.props;
    const { cart } = this.context.i18n;
    const isUniqlo = brand === 'uq';
    const gridSize = {
      logo: isUniqlo ? 3 : 2,
      totals: isUniqlo ? 5 : 6,
    };

    const logoContainerClass = cx(styles.logos, {
      [styles.uqLogo]: isUniqlo,
      [styles.guLogo]: !isUniqlo,
    });

    return (
      <Grid className={cx(styles.shoppingBagHeader, wrapperClass)} childrenWrapperClass={styles.shoppingBagItem}>
        <GridCell className={logoContainerClass} colSpan={gridSize.logo}>
          <Image source={isUniqlo ? uqLogo : guLogo} />
        </GridCell>
        <GridCell colSpan={gridSize.totals}>
          <Text className={cx(styles.bag, 'blockText')}>
            <strong>{cart.bag}</strong>{` | ${cart.totalOf} ${totalItems} ${cart.points}`}
          </Text>
        </GridCell>
        <GridCell colSpan={4}>
          <If
            if={isButtonShown}
            then={Button}
            className={cx(styles.goToCart, 'blockText')}
            onTouchTap={goToCart}
            label={cart.viewCart}
            labelClass={styles.goToCartLabel}
          />
        </GridCell>
      </Grid>
    );
  }
}
