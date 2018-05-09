import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import If from 'components/uniqlo-ui/If';
import Container from 'components/uniqlo-ui/core/Container';
import * as wishlistActions from 'redux/modules/wishlist/actions';
import { getFlagsForSKU } from 'redux/modules/cart/selectors';
import * as cartActions from 'redux/modules/cart';
import { getBrandedWishlists } from 'redux/modules/wishlist/selectors';
import { generateWishlistSku } from 'utils/wishlistUtils';
import constants from 'config/site/default';
import CartItem from '../Item';
import styles from '../Cart.scss';

const { array, func, object, string } = PropTypes;

@connect(
  (state, props) => ({
    flags: getFlagsForSKU(state, props),
    wishlist: getBrandedWishlists(state, props),
  }),
  {
    ...cartActions,
    toggleWishlist: wishlistActions.toggleWishlist,
  }
)
export default class Products extends PureComponent {
  static propTypes = {
    // from parent
    brand: string,
    load: func,
    params: object,
    setCountAndLoad: func,
    cartItemErrors: object,

    // from parent
    item: array,

    // form Content/index
    onRemoveCartItem: func,

    // from selectors
    flags: object,

    // from state using @connect
    wishlist: array,
    toggleWishlist: func,
  };

  static contextTypes = {
    i18n: object,
  };

  toggleWishlist = id => this.props.toggleWishlist('products', id, this.props.brand);

  render() {
    const { cart: { kingPromo }, pdp: { priceSpecials } } = this.context.i18n;
    const {
      brand,
      load,
      params,
      setCountAndLoad,
      item,
      onRemoveCartItem,
      flags,
      wishlist,
      cartItemErrors,
    } = this.props;

    const { specialFlags, normalFlags } = flags;
    const { cart: { multiBuy } } = constants;

    return (
      <div className={item.isMultiBuyCart ? styles.multiBuy : ''}>
        {
        item.map((product, productIndex) => {
          const {
            promoId: multiBuyApplied,
            promoDtlFlg,
            secondItem,
            currentSkuId,
            l2Code,
            is999Rule,
            colorCode,
            id,
          } = product;

          const wishlistSku = generateWishlistSku(id, colorCode);
          const isFavorite = !!wishlist.find(sku => sku.includes(wishlistSku));
          const displayBanner = !(secondItem || is999Rule);
          const totalItems = item.length;

          // TO ADD A CUSTOM BORDER FOR THE SAME PRODUCT MULTI-BUY CONDITION AND THE 999 RULE
          let isDisplayBorder = false;

          if (productIndex < item.length - 1) {
            const nextItem = item[productIndex + 1];

            isDisplayBorder = (nextItem.is999Rule || nextItem.secondItem);
          }

          if (product.applyType === multiBuy.patternX || product.applyType === multiBuy.patternY) {
            const index = specialFlags && specialFlags[currentSkuId] && specialFlags[currentSkuId].indexOf(priceSpecials.isMultiBuy);

            if (index !== undefined && index !== -1) {
              specialFlags[currentSkuId][index] = kingPromo;
            }
          }

          return (
            <div key={productIndex}>
              <CartItem
                itemIndex={productIndex}
                {...{ totalItems, brand, currentSkuId, secondItem, displayBanner, multiBuyApplied, params, promoDtlFlg, isFavorite, wishlistSku }}
                hideBottomBorder={isDisplayBorder}
                item={product}
                loadCart={load}
                normalFlags={normalFlags[currentSkuId]}
                onChange={setCountAndLoad}
                onRemove={onRemoveCartItem}
                specialFlags={specialFlags[currentSkuId]}
                onFavoriteClick={this.toggleWishlist}
                errorMessage={cartItemErrors[l2Code]}
              />
              <If
                if={isDisplayBorder}
                then={Container}
                className={styles.multiBuyBorder}
              />
            </div>
          );
        })
      }
      </div>
    );
  }
}
