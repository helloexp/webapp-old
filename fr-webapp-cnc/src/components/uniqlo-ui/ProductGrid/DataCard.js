import React, { PureComponent, PropTypes } from 'react';
import { getSpecialFlagsForSku, titleDecode } from 'utils/productUtils';
import { getByCriteria } from 'utils';
import { formatNumberWithCommas as format } from 'utils/format';
import { MEMBER_ONLY_FLAG, DAILY_LIMITED_FLAG, ONLINE_LIMITED, kingPromo } from 'config/site/default';
import { CURRENCY_SYMBOL_REGX } from 'helpers/regex';
import Link from 'components/uniqlo-ui/Link';
import classnames from 'classnames';
import Select from 'components/Atoms/Select';
import Button from 'components/uniqlo-ui/Button';
import GridCell from '../core/GridCell';
import Text from '../Text';
import PriceComponent from './PriceComponent';
import styles from './DataCard.scss';
import If from '../If';

const { object, number, bool, string, array, func } = PropTypes;

function Flags({ flags, className, check, isSpecial, multiBuy, multiBuyFlag, variation, isCartItem }, context) {
  const {
    pdp: {
      priceSpecials: { isMultiBuy },
    },
  } = context.i18n;

  if (!flags.length || !check) {
    return null;
  }
  const priceClass = classnames({
    [styles.multiLine]: isSpecial,
    dotSep: !isSpecial,
    [styles.multiLineLarge]: isSpecial && variation === 'Single-Large-Minus',
    [styles.multiLineSmall]: isCartItem,
  });

  return (
    <div className={className}>
      {flags &&
        flags.map((msg, idx) => {
          const content = multiBuy && msg === isMultiBuy ? multiBuyFlag : msg;

          return (<Text className={priceClass} key={idx}>{content}</Text>);
        })
      }
    </div>
  );
}

Flags.propTypes = {
  flags: array,
  className: string,
  check: bool,
  isSpecial: bool,
  multiBuy: bool,
  multiBuyFlag: string,
  variation: string,
  isCartItem: bool,
};

Flags.contextTypes = {
  i18n: object,
};

const productPriceFlagClass = (allFlags, carousel) => {
  const {
    discount,
    limitedOffer,
    flags,
  } = allFlags;

  const priceSpecialsInFlags = flags.includes(MEMBER_ONLY_FLAG)
    || flags.includes(DAILY_LIMITED_FLAG)
    || flags.includes(ONLINE_LIMITED);

  if (priceSpecialsInFlags || limitedOffer || discount) {
    return carousel ? 'carouselLargeProductPriceLimited' : 'productOnOffer';
  }

  return carousel ? 'carouselLargeProductPrice' : '';
};

/**
 * Define FieldsComponent
 * */

const FieldsComponent = (props) => {
  const { properties, linkToPDP } = props;
  const fields = properties.map((obj, index) => {
    const fieldClass = classnames('blockText', styles.productProperties, styles.verySmallBottomSpacing, {
      [styles.productTitle]: obj.key === 'title',
      [styles.skuLabel]: obj.key === 'sku',
    });
    const key = `field-${index}`;

    if (obj.key === 'title') {
      return (
        <Link to={linkToPDP} key={key} noRouter className={fieldClass}>
          {obj.value}
        </Link>
      );
    }

    return (
      <Text className={fieldClass} key={key}>{obj.value}</Text>
    );
  });

  return <section>{fields}</section>;
};

FieldsComponent.propTypes = {
  properties: array,
  linkToPDP: string,
};

/**
 * End FieldsComponent definition
 * */

export default class DataCard extends PureComponent {
  static propTypes = {
    product: object,
    colorCode: string,
    sizeCode: string,
    colorFlag: bool,
    sizeFlag: bool,
    idFlag: bool,
    promoDtlFlg: string,
    multiBuyFlag: string,
    multiBuyPrice: bool,
    isCartItem: bool,
    onChange: func,
    maxCount: number,
    oddTwoColumnCell: bool,
    variation: string,
    pdpLink: string,
    titleFlag: bool,
    priceFlag: bool,
    genderSizeFlag: bool,
    flags: bool,
    productSize: string,
    linkToPDP: string,
    normalFlags: array,
    specialFlags: array,
    onRemovePress: func,
    meta: object,
  };

  static contextTypes = {
    i18n: object,
  };

  static defaultProps = {
    productSize: 'S-L',
    isCartItem: false,
  };

  state = {
    expanded: false,
  };

  componentWillMount() {
    const {
      product,
      product: {
        defaultSKU,
        meta,
      },
    } = this.props;
    const {
      pdp: {
        priceSpecials,
        dateFlags,
      },
    } = this.context.i18n;
    const promotion = meta && meta.promotion || {};

    this.sku = getByCriteria(product.SKUs, { id: defaultSKU });
    this.productSpecialFlags = getSpecialFlagsForSku(this.sku, priceSpecials, dateFlags, promotion);
    this.termLimitSalesMsg = this.sku && this.sku.limitedOffer && meta && meta.termLimitSalesMsg;
  }

  getQuantityValues = (count, maxCount) => {
    let maximumOption;

    if (maxCount) {
      maximumOption = count > maxCount ? count : maxCount;
    } else {
      maximumOption = count > 10 ? count : 10;
    }

    return [...Array(maximumOption)].map((x, i) => i + 1);
  };

  // The function breaks the promo price at the price symbol ￥|¥
  getKingPromoPrice = (promoPrice, priceStyle) => {
    if (promoPrice) {
      const currencyPostion = promoPrice.search(CURRENCY_SYMBOL_REGX);
      const promoMessage = promoPrice.substring(0, currencyPostion);
      const kingPrice = promoPrice.substring(currencyPostion);

      return (
        <div>
          <Text content={promoMessage} className={`${styles.promoMessage} ${priceStyle}`} />
          <Text content={kingPrice} className={priceStyle} />
       </div>
      );
    }

    return null;
  }

  handleQuantityChange = (event) => {
    this.props.onChange(event.target.value);
  };

  render() {
    const {
      product: {
        title,
        genderName,
        onlineId,
        properties,
        price,
        count,
        normalFlags,
        specialFlags,
        meta,
      },
      titleFlag,
      priceFlag,
      genderSizeFlag,
      flags,
      productSize,
      colorFlag,
      sizeFlag,
      idFlag,
      promoDtlFlg,
      multiBuyFlag,
      multiBuyPrice,
      isCartItem,
      maxCount,
      oddTwoColumnCell,
      variation,
      linkToPDP,
      onRemovePress,
    } = this.props;
    const {
      common: {
        currencySymbol,
      },
      pdp: {
        itemCode,
      },
      cart,
    } = this.context.i18n;

    const { sku, productSpecialFlags, termLimitSalesMsg } = this;
    const { kingPromoFlg, kingPromoPrice } = meta && meta.promotion || {};
    const isKingPromoAvailable = kingPromoFlg === kingPromo.qualified;

    const multiBuy = promoDtlFlg && parseInt(promoDtlFlg, 10) > 0;
    const specialFlagvaraitions = ['threeColumnList', 'largeProduct', 'largeProductRectangle1E1', 'largeProductRectangle3E4'];
    const gridCellStyle = classnames(styles.dataCard, {
      [styles.oddTwoColumnCell]: oddTwoColumnCell,
      [styles.cartData]: isCartItem,
      [styles.noHzSpazing]: variation === 'threeColumnList' || variation === 'Single-Large-Minus',
    });
    const specialPrice = !isCartItem && sku ? productPriceFlagClass(sku) : '';
    const priceStyle = classnames(styles.price, {
      [styles.twoColPrice]: variation === 'Two-Column' || variation === 'Single-Small',
      [styles.singleLargePrice]: variation === 'Single-Large',
      [styles.priceSmallMargin]: variation === 'Single-Large-Minus',
      [styles[specialPrice]]: specialPrice,
      [styles.kingPromoPrice]: isKingPromoAvailable,
    });

    const formattedKingPromoPrice = isKingPromoAvailable ? this.getKingPromoPrice(kingPromoPrice, priceStyle) : null;
    const priceFlags = classnames(styles.priceFlags, {
      [styles.inCart]: isCartItem || variation === 'Single-Large-Minus',
      [styles.specialMargin]: specialFlagvaraitions.indexOf(variation) > -1,
    });
    const flagStyle = classnames(styles.flags, {
      [styles.topPadding]: isCartItem,
      [styles.flagsSmallMargin]: variation === 'Single-Large-Minus',
    });
    const specialFlagStle = classnames(styles.flags, { [styles.flagsSmallMargin]: variation === 'Single-Large-Minus' });
    const outerStyle = variation === 'Two-Column' ? styles.fullFlex : '';
    const wrapperStyle = classnames('', {
      [styles.fullHeight]: variation === 'Two-Column',
    });
    const specialGenderVariations = ['largeProduct', 'largeProductRectangle1E1', 'largeProductRectangle3E4'];
    const genderStyle = classnames(styles.genderSize, {
      [styles.mediumBottom]: specialGenderVariations.indexOf(variation) > -1,
    });
    const productTitleStyle = classnames(styles.prodName, {
      [styles.prodNameLarge]: variation === 'Single-Large-Minus',
    });
    const limitedOfferStyles = classnames(styles.limitedOffer, 'productCardText', {
      [styles.noMarginLimitedOffer]: variation === 'Single-Large-Minus',
    });
    const priceProps = {
      price,
      currencySymbol,
      multiBuyPrice,
    };

    const productPrice = sku && sku.currentPrice;
    const productTitle = titleDecode(title);

    return (
      <div className={outerStyle}>
        <div className={wrapperStyle}>
          <GridCell className={gridCellStyle}>
            <If className={genderStyle} if={!(['Single-Small', 'Single-Large-Minus', 'Single-Large'].includes(variation)) && genderSizeFlag}>
              <Text>{genderName}</Text>
              <Text>{productSize}</Text>
            </If>
            <If className={productTitleStyle} if={titleFlag && !isCartItem}>{productTitle}</If>
            <If
              if={isCartItem && properties}
              properties={properties}
              linkToPDP={linkToPDP}
              then={FieldsComponent}
            />
            <If if={!isCartItem && colorFlag}>{cart.color}: {sku && sku.colorCode} {sku && sku.color}</If>
            <If if={!isCartItem && sizeFlag}>{cart.size}: {genderName} {sku && sku.size}</If>
            <If className={styles.productOnlineId} if={!isCartItem && idFlag}>{itemCode}: {onlineId}</If>
            <If
              check={flags}
              className={flagStyle}
              flags={productSpecialFlags.normal}
              if={flags && !isCartItem && productSpecialFlags.normal}
              then={Flags}
            />
            <If
              check={flags}
              className={flagStyle}
              flags={normalFlags}
              if={isCartItem && normalFlags}
              isCartItem={isCartItem}
              then={Flags}
            />
            <If
              if={isCartItem}
              then={PriceComponent}
              specialFlags={specialFlags}
              {...priceProps}
            />
            <If className={priceStyle} content={`${currencySymbol}${format(productPrice)}`} if={productPrice && !isKingPromoAvailable} then={Text} />
            {formattedKingPromoPrice}
            <If
              check={priceFlag}
              className={priceFlags}
              flags={specialFlags}
              if={isCartItem && specialFlags}
              then={Flags}
              isCartItem={isCartItem}
              isSpecial
              multiBuy={multiBuy}
              multiBuyFlag={multiBuyFlag}
            />
            <If
              check={priceFlag}
              className={priceFlags}
              flags={productSpecialFlags.special}
              if={!isCartItem && priceFlag && productSpecialFlags.special && productSpecialFlags.special.length}
              then={Flags}
              isSpecial
              variation={variation}
            />
          <div className={styles.selectWithButton}>
            <If
              if={isCartItem}
              then={Select}
              value={`${count}`}
              values={this.getQuantityValues(count, maxCount)}
              onChange={this.handleQuantityChange}
              className={styles.select}
              analyticsOn="Item Quantity Change"
              analyticsCategory="Checkout Funnel"
            />
            <If
              if={isCartItem}
              then={Button}
              className={styles.deleteButton}
              onTouchTap={onRemovePress}
              analyticsOn="Button Click"
              analyticsCategory="Checkout Funnel"
              analyticsLabel="Delete Item"
              labelClass={styles.removeButtonText}
              label={cart.removeItem}
            />
          </div>
            <If
              className={specialFlagStle}
              flags={productSpecialFlags.normal}
              if={isCartItem && productSpecialFlags.normal}
              then={Flags}
              isCartItem={isCartItem}
            />
            <If className={limitedOfferStyles} if={flags && termLimitSalesMsg} then={Text} >{termLimitSalesMsg}</If>
          </GridCell>
        </div>
      </div>
    );
  }
}
