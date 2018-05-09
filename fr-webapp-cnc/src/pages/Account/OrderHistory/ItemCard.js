import React, { PureComponent, PropTypes } from 'react';
import Link from 'components/uniqlo-ui/Link';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import Container from 'components/uniqlo-ui/core/Container';
import { formatNumberWithCommas } from 'utils/format';
import { getProductImage } from 'utils/productUtils';
import { prependRoot } from 'utils/routing';
import cx from 'classnames';
import { mmTypeAlterationFlags, brandName } from 'config/site/default';
import styles from './itemCard.scss';

const { string, object, bool } = PropTypes;

export default class ItemCard extends PureComponent {
  static propTypes = {
    productName: string,
    colorCode: string,
    colorName: string,
    isMultiBuy: bool,
    isMultipleSkuBuy: bool,
    sizeCode: string,
    sizeName: string,
    productNumber: string,
    promoId: string,
    quantity: string,
    price: string,
    gender: string,
    secondItem: bool,
    is999Rule: bool,
    alteration: string,
    alterationFlag: string,
    orderBrand: string,
    promoDtlFlg: string,
    isXYPattern: bool,
    itemCode: string,
  };

  static contextTypes = {
    config: object,
    i18n: object,
  };

  getAlterationText() {
    const { alterationFlag, alteration } = this.props;
    const { i18n: { orderHistory } } = this.context;

    let alterationLength;
    let alterationText;

    if (alterationFlag !== '0' && alteration && alteration !== '0') {
      // When alteration is in millimeter, convert it to centimeter.
      alterationLength = mmTypeAlterationFlags.includes(alterationFlag) ? alteration / 10 : alteration;
      alterationText = `${orderHistory.alteration}: ${orderHistory.corrections} ${alterationLength}${orderHistory.centimeter}`;
    }

    return alterationText;
  }

  render() {
    const {
      productName,
      colorCode,
      colorName,
      isMultiBuy,
      isMultipleSkuBuy,
      sizeName,
      productNumber,
      itemCode,
      promoId,
      quantity,
      price,
      gender,
      secondItem,
      is999Rule,
      orderBrand,
      isXYPattern,
      promoDtlFlg,
    } = this.props;

    const { config, i18n: { orderHistory, cart, pdp: { priceSpecials } } } = this.context;
    const { qualified, applied } = config.kingPromo;
    const genderName = gender && `${gender} ` || '';
    const multiBuyMessage = isMultiBuy ? cart.appliedFlag : cart.notAppliedFlag;
    const details = [
      { value: `${orderHistory.color}: ${colorCode} ${colorName}` },
      { value: `${orderHistory.size}: ${genderName}${sizeName || ''}` },
      { value: this.getAlterationText() },
      { value: `${orderHistory.itemNumber}: ${productNumber}` },
      { value: `${orderHistory.quantity}: ${quantity}`, count: true },
      { value: formatNumberWithCommas(price), price: true },
    ];
    const brandPdpUrl = orderBrand === brandName.gu ? config.productGrid.productBaseGuUrl : config.productGrid.productBaseUrl;
    const productId = orderBrand === brandName.uq && itemCode || productNumber;
    const pdpLink = prependRoot(brandPdpUrl.replace('%onlineId%', productId));
    const imageUrl = getProductImage(productNumber, colorCode);
    const itemWrapper = cx(styles.itemCard, {
      [styles.multiBuyWrapper]: promoId,
      [styles.multipleSkuMultiBuy]: secondItem || is999Rule,
      [styles.multiBuyFirstItem]: isMultipleSkuBuy,
      [styles.topItem]: isMultipleSkuBuy || secondItem,
    });

    if (isXYPattern && [qualified, applied].includes(promoDtlFlg)) {
      details.push({ value: priceSpecials.isKingPromo, isPromoProduct: true });
    } else if (promoId) {
      details.push({ value: multiBuyMessage, isPromoProduct: true });
    }

    return (
      <Container className={itemWrapper}>
        <Container className={styles.imageContaner}>
          <Link to={pdpLink} noRouter>
            <Image className={styles.itemImage} source={imageUrl} />
          </Link>
        </Container>
        <Container className={styles.detailsContainer}>
          <Link to={pdpLink} noRouter>
            <Text className={cx('blockText', styles.boldData)}>{productName}</Text>
          </Link>
          {
            details.map((obj, index) => {
              const textClass = cx('blockText',
                {
                  [styles.itemDatas]: !obj.name,
                  [styles.itemPrice]: obj.price,
                  [styles.multiBuyFlag]: obj.isPromoProduct,
                  [styles.multiBuyPrice]: obj.price && isMultiBuy,
                  [styles.itemCount]: obj.count,
                });

              return <Text key={index} className={textClass}>{obj.value}</Text>;
            }
          )
          }
        </Container>
      </Container>
    );
  }
}
