import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { getAvailableItemsOnStock, isLowInventory, isOutOfStock } from 'redux/modules/cart/selectors';
import ProductCard from 'components/ProductCard';
import ErrorMessage from 'components/ErrorMessage';
import noop from 'utils/noop';
import constants from 'config/site/default';
import If from 'components/uniqlo-ui/If';
import classNames from 'classnames';
import { AddMoreMessage, NotQualifiedMessage } from './AdMessages';
import styles from './styles.scss';

const { oneOfType, string, number, func, object, bool, any, array } = PropTypes;

/**
 * Returns an array of product properties such as color, size, title and so on. This
 * function it's used internally on this file to create the required data for ProductCard.
 * @param {Object} Item The product's information
 * @param {Object} i18n The i18n object to get the cart and common translations
 * @param {Object} config A configuration object to get PDP inseam types
 **/
export function getItemProperties(item, { cart }, config) {
  const { mmTypeAlterationFlags } = constants;
  const { alteration = '0' } = item;
  const inseamType = config.PDP.inseamTypes[alteration];
  const alterationLabel = (alteration in config.PDP.alterationTypes)
    ? config.PDP.alterationTypes[alteration].alterationLabel
    : config.PDP.alterationTypes.default.alterationLabel;
  const cmUnit = config.inseamUnit;
  const properties = [];
  const gender = item && item.genderName || '';
  const colorCode = item && item.colorCode || '';

  properties.push({ key: 'title', value: item.title });

  if (item.sku) {
    properties.push({ key: 'sku', value: `${cart.itemNumber}: ${item.sku}` });
  }

  if (item.color || colorCode) {
    properties.push({ key: 'color', value: `${cart.color}: ${colorCode} ${item.color}` });
  }

  if (item.size || gender) {
    properties.push({ key: 'size', value: `${cart.size}: ${gender} ${item.size || ''}` });
  }

  if (item.length) {
    properties.push({ key: 'length', value: `${inseamType.lengthLabel}: ${item.length}` });
  }

  if (alteration !== '0') {
    // When alteration of this product it's equal to "Suit" (3), 7, B or D, we need to normalize the size.
    const normalizedModSize = mmTypeAlterationFlags.includes(alteration) ? item.modifySize / 10 : item.modifySize;

    properties.push({ key: 'inseam', value: `${alterationLabel}: ${normalizedModSize} ${cmUnit}` });
  }

  return properties;
}

/**
 * Returns an object containing the required data for the ProductCard component.
 * @param {Object} Item The product's information
 * @param {Object} i18n The i18n object to get the cart and common translations
 * @param {Object} config A configuration object to get PDP inseam types
 **/
export function getRequiredData({ item, normalFlags, specialFlags }, i18n, config) {
  const productCount = parseInt(item.count, 10);
  const { price } = item;
  const { notAppliedFlag, appliedFlag } = i18n.cart;
  const multiBuyFlag = item.isMultiBuy ? appliedFlag : notAppliedFlag;

  return {
    product: {
      productId: item.id,
      properties: getItemProperties(item, i18n, config),
      price: price === 0 ? i18n.cart.free : item.price,
      count: productCount,
      flags: item.flagItems,
      maxCount: productCount > 10 ? productCount : 10,
      SKUs: [item.SKUflags],
      category: '',
      specialFlags,
      normalFlags,
    },
    currencySymbol: price === 0 ? '' : i18n.common.currencySymbol,
    variationType: 'Single-Small-Cart',
    customImage: item.image,
    promoDtlFlg: item.promoDtlFlg,
    multiBuyFlag,
    multiBuyPrice: item.multiBuyPrice,
    currentSkuId: item.currentSkuId,
    itemCode: item.itemCode,
    count: productCount,
  };
}

@connect((state, props) => ({
  isLowInventory: isLowInventory(state, props),
  isOutOfStock: isOutOfStock(state, props),
  availableItemsOnStock: getAvailableItemsOnStock(state, props),
}))
export default class Item extends PureComponent {
  static propTypes = {
    // From selectors
    availableItemsOnStock: number,
    isLowInventory: bool,
    isOutOfStock: bool,

    // From parent
    alteration: oneOfType([string, number]),
    brand: string,
    onChange: func,
    params: object,
    item: object,
    onRemove: func,
    displayBanner: bool,
    multiBuyApplied: any,
    specialFlags: array,
    normalFlags: array,
    isFavorite: bool,
    onFavoriteClick: func,
    wishlistSku: string,
    seqNo: string,
    hideBottomBorder: bool,
    itemIndex: number,
    totalItems: number,
    errorMessage: string,
    isXYPatternMessage: bool,
    price: number,
    isXYPattern: bool,
  };

  static defaultProps = {
    onChange: noop,
    onRemove: noop,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  onCountChange = (quantity) => {
    const { onChange, brand, item: { seqNo } } = this.props;

    onChange(seqNo, quantity, brand);
  };

  onRemovePress = () => {
    const { onRemove, brand, item: { seqNo } } = this.props;

    onRemove(seqNo, brand);
  };

  getItemErrorMessage() {
    const { i18n: { cart } } = this.context;
    const { errorMessage, availableItemsOnStock, item: { isMultiBuy } } = this.props;

    if (errorMessage) {
      return errorMessage;
    }

    if (isMultiBuy) {
      return availableItemsOnStock === 0
        ? cart.stockIsNotAvailable
        : cart.multiBuyLowStock.replace('%d', availableItemsOnStock);
    }

    if (this.props.isLowInventory) {
      return cart.stockIsLow.replace('%d', availableItemsOnStock);
    }

    if (this.props.isOutOfStock) {
      return cart.stockIsNotAvailable;
    }

    return '';
  }

  render() {
    const { i18n: { cart } } = this.context;
    const {
      displayBanner,
      multiBuyApplied,
      params,
      item: {
        isMultiBuy,
        promoApplyCnt,
        promoApplyDiscountAmt,
        promoNm,
        promoDtlFlg,
        promotionId,
        secondItem,
        isMultipleSkuBuy,
        is999Rule,
        seqNo,
        isXYPatternMessage,
        price,
        isXYPattern,
      },
      itemIndex,
      totalItems,
      hideBottomBorder,
      onFavoriteClick,
      wishlistSku,
      isFavorite,
      brand,
    } = this.props;
    const showInventoryError = this.props.isOutOfStock || this.props.isLowInventory || this.props.errorMessage;
    const { cart: { multiBuy } } = constants;
    const requiredData = getRequiredData(this.props, this.context.i18n, this.context.config);
    const multiBuyDisplayRule = is999Rule || isMultipleSkuBuy || secondItem;
    const multiBuyReduceMarginRule = isMultiBuy && itemIndex && itemIndex < totalItems && !secondItem && !is999Rule;
    const messageAmount = isXYPattern ? price : promoApplyDiscountAmt;
    const mainClasses = classNames(
      styles.cartItem,
      {
        [styles.multiBuyCartItem]: multiBuyApplied,
        [styles.multiSkuBuyBottom]: secondItem || is999Rule,
        [styles.multibuyFirstItem]: isMultipleSkuBuy && !multiBuyReduceMarginRule,
        [styles.multiSkuBuyTop]: multiBuyDisplayRule,

        // TO REMOVE BORDER FOR THE SAME PRODUCT MULTI-BUY CONDITION AND THE 999 RULE
        [styles.multiSkuBuyBorderLess]: hideBottomBorder,
        [styles.firstCartItem]: seqNo === '1' && !multiBuyApplied,
        [styles.multiBuyReduceMargin]: multiBuyReduceMarginRule,
      }
    );

    return (
      <div className={mainClasses}>
        <If
          if={showInventoryError}
          then={ErrorMessage}
          message={this.getItemErrorMessage()}
          rootClassName="cartItemError"
          type="error"
        />
        <If
          cart={cart}
          if={isMultiBuy && promoNm && displayBanner}
          multipleSku={isMultipleSkuBuy}
          count={promoApplyCnt}
          amount={messageAmount}
          promoNm={promoNm}
          then={AddMoreMessage}
          isXYPattern={isXYPattern}
        />
        <If
          i18n={cart}
          if={promoDtlFlg === multiBuy.notQualified && promoNm && displayBanner}
          promoNm={promoNm}
          promotionId={promotionId}
          then={NotQualifiedMessage}
          isXYPatternMessage={isXYPatternMessage}
          isXYPattern={isXYPattern}
        />
        <ProductCard
          {...requiredData}
          genderSizeFlag={false}
          isCartItem
          onChange={this.onCountChange}
          priceFlag
          ratingFlags={false}
          onRemovePress={this.onRemovePress}
          {...{ params, onFavoriteClick, isFavorite, wishlistSku, brand }}
        />
        </div>
    );
  }
}
