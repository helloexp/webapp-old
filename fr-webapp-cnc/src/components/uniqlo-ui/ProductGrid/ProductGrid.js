import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import Container from '../core/Container';
import Icon from '../core/Icon';
import Text from '../Text';
import stylePropsParser from '../helpers/utils/stylePropParser';
import styles from './ProductGrid.scss';
import If from '../If';
import variationToCss from './variationToCss';
import CardsWrapper from './CardsWrapper';

const defaultVariationType = 'Single-Small';
const { object, func, string, bool, any, number } = PropTypes;

export default class ProductGrid extends PureComponent {
  static propTypes = {
    loadProductGridItems: func,
    variation: string,
    items: object,

    alternateText: string,
    catelogPath: string,
    cellHeight: string,
    children: any,
    content: string,
    className: string,
    dePrioritized: string,
    loadNextSet: func,
    paginationOffset: number,
    page: object,
    pageNo: string,
    prioritized: string,
    variationType: string,
    filterData: object,
    tags: string,
    pdpBaseUrl: string,

    colorChipFlag: bool,
    genderSizeFlag: bool,
    titleFlag: bool,
    priceFlag: bool,
    flags: bool,
    colorFlag: bool,
    sizeFlag: bool,
    idFlag: bool,
    pagination: bool,

    // cart props
    count: number,
    onChange: func,
    maxCount: number,
    promoDtlFlg: number,
    multiBuyFlag: string,
    isCartCard: bool,

    data: object,
  };

  static defaultProps = {
    tileSize: 'large',
    data: {
      items: [],
      total: 0,
    },
    colorChipFlag: true,
    genderSizeFlag: true,
    titleFlag: true,
    priceFlag: true,
    flags: true,
    pagination: true,
  };

  render() {
    const { className, data, page, pagination, ...other } = this.props;
    const productItems = data && data.items || [];
    const total = data && data.total || 0;
    const classNames = className ? stylePropsParser(className, styles).join(' ') : '';
    const variation = other.variation || other.variationType || defaultVariationType;
    const classes = classnames(styles.productGrid, variationToCss(styles, variation), classNames);
    const thereAreProducts = productItems.length > 0;
    const thereIsMore = thereAreProducts && total > productItems.length;
    const cardsWrapperProps = { productItems, variation, ...other };

    return (
      <div className="productGird">
        <If
          className={classes}
          if={thereAreProducts}
          then={CardsWrapper}
          {...cardsWrapperProps}
        />
        <If
          className={styles.viewMore}
          if={thereIsMore && pagination}
          onClick={this.props.loadNextSet}
          then={Container}
        >
          <Text className={styles.viewMoreText}>{page.tabs.keyword.search.viewmore}</Text>
          <Icon className={styles.viewMoreIcon} name="NavigationChevronDown" />
        </If>
      </div>
    );
  }
}
