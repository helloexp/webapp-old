import React, { PropTypes, PureComponent } from 'react';
import Text from 'components/uniqlo-ui/Text';
import classNames from 'classnames';
import styles from './styles.scss';

const { array } = PropTypes;

const addressDetailsClass = classNames('blockText', styles.addressDetails);

export default class StoreAddressDetails extends PureComponent {
  static propTypes = {
    storeAddress: array,
  };

  render() {
    const { storeAddress } = this.props;

    const data = storeAddress && storeAddress.map((value, index) =>
      <Text className={addressDetailsClass} key={index}>
        {value}
      </Text>
    );

    return <div>{data}</div>;
  }
}
