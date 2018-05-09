import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import Text from 'components/uniqlo-ui/Text';
import InfoToolTip from 'components/InfoToolTip';
import Link from 'components/uniqlo-ui/Link';
import If from 'components/uniqlo-ui/If';
import styles from '../styles.scss';

const { string, object, bool } = PropTypes;

export default class PickUpInfo extends PureComponent {
  static propTypes = {
    deliveryType: string,
    barcodeURL: string,
    pickUpStore: bool,
    convenienceStore: bool,
    isSevenEleven: bool,
    orderBrand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  getTooltipText() {
    const { deliveryType, isSevenEleven, orderBrand } = this.props;
    const { orderHistory } = this.context.i18n;

    if (isSevenEleven) {
      return orderHistory.CVSToolTipText[deliveryType].map((item, index) => {
        if (item.type === 'link') {
          return <a className={styles.tooltipItemLink} href={item.href[orderBrand]} key={index} rel="noopener noreferrer" target="_blank">{item.text}</a>;
        }

        return <Text className={styles.tooltipItemDot} key={index}>{item.text}</Text>;
      });
    }

    return <Text>{orderHistory.CVSToolTipText[deliveryType]}</Text>;
  }

  render() {
    const { deliveryType, pickUpStore, convenienceStore, barcodeURL, isSevenEleven } = this.props;
    const { orderHistory } = this.context.i18n;
    const cvsInfoTextStyle = classNames({ [styles.cvsInfoText3]: isSevenEleven, blockText: !isSevenEleven });

    if (convenienceStore) {
      return (
        <div className={styles.pickupInfoContainer}>
          <div className={styles.cvsInfoHeadView}>
            <Text className={styles.cvsInfoHeading}>{orderHistory.CVSInfoHeading[deliveryType]}</Text>
            <InfoToolTip>{ this.getTooltipText() }</InfoToolTip>
          </div>
          <Text className={styles.cvsInfoText}>{orderHistory.CVSInfoText1[deliveryType]}</Text>
          <If if={isSevenEleven && barcodeURL}>
            <div>
              <Link className={styles.sejInfoLink} to={barcodeURL}>{orderHistory.CVSInfoText2[deliveryType]}</Link>
              <Text className={cvsInfoTextStyle}>{orderHistory.CVSInfoText3[deliveryType]}</Text>
            </div>
          </If>
          <If if={!isSevenEleven}>
            <div>
              <Text className="blockText">{orderHistory.CVSInfoText2[deliveryType]}</Text>
              <Text className={cvsInfoTextStyle}>{orderHistory.CVSInfoText3[deliveryType]}</Text>
            </div>
          </If>
        </div>
      );
    } else if (pickUpStore) {
      return (
        <div className={styles.pickupInfoContainer}>
          <Text className="blockText">{orderHistory.UQStoreInfoText1}</Text>
          <Text className="blockText">{orderHistory.UQStoreInfoText2}</Text>
        </div>
      );
    }

    return null;
  }
}
