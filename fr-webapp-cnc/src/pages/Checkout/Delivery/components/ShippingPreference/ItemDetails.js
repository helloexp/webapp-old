import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { getItems } from 'redux/modules/checkout/delivery/selectors';
import { getItemProperties } from 'pages/Cart/Item/index.js';
import styles from './styles.scss';

const { object, string, array } = PropTypes;

@connect((state, props) => ({
  items: getItems(state, props),
}))
export default class ItemDetails extends PureComponent {
  static propTypes = {
    splitNo: string,
    items: array,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  render() {
    const { i18n, config } = this.context;
    const elements = this.props.items.map((item, idx) => {
      const properties = getItemProperties(item, i18n, config);

      if (item.count) {
        properties.push({ key: 'count', value: `${i18n.cart.quantity}: ${item.count}` });
      }

      const fields = properties.map((obj, index) => {
        const fieldClass = classnames(styles.productProperties, {
          [styles.productTitle]: obj.key === 'title',
        });

        return (
          <div className={fieldClass} key={`field-${index}`}>{obj.value}</div>
        );
      });

      return <div className={styles.productTile} key={idx}>{fields}</div>;
    });

    return <div>{elements}</div>;
  }
}
