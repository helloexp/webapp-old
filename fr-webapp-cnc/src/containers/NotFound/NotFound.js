import React, { PureComponent, PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Heading from 'components/uniqlo-ui/Heading';
import { connect } from 'react-redux';
import { goHome } from 'utils/routing';
import { getBrand } from 'redux/modules/cart/selectors';
import styles from './styles.scss';

const { object, string } = PropTypes;

@connect(
  (state, props) => ({
    brand: getBrand(state, props),
  })
)
export default class NotFound extends PureComponent {

  static propTypes = {
    // current brand 'uq' or 'gu'
    brand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { common } = this.context.i18n;

    return (
      <div>
        <div className={styles.notFoundWrapper}>
          <Heading
            className={`${styles.notFoundTitle}`}
            headingText={common.notFound}
            type="h3"
          />
        </div>
        <div className={`${styles.notFoundWrapper} ${styles.notFoundBg}`}>
          <Heading
            className={`${styles.notFoundsubTitle}`}
            headingText={common.notFound404}
            type="h4"
          />
          <Text className={styles.notFoundText}>{common.notFoundMessage}</Text>
          <Button
            className={`default medium continueShopping ${styles.goHome}`}
            label={common.topUniqlo}
            onTouchTap={() => goHome(this.props.brand)}
          />
        </div>
      </div>
    );
  }
}
