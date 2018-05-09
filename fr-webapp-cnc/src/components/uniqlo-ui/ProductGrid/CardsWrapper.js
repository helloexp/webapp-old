import React, { PropTypes } from 'react';
import Grid from '../core/Grid';
import ProductCard from './ProductCard';

const { object, array, string } = PropTypes;

const getColSpan = (variation) => {
  switch (variation) {
    case 'Single-Large':
    case 'Single-LargePlus':
    case 'Single-Small':
    case 'Single-Small-Outfit':
    case 'Single-SmallPlus':
    case 'Two-ColumnPlus':
      return 12;
    case 'Two-Column':
      return 6;
    case 'Multi-Small':
      return 3;
    case 'Multi-Large':
      return 4;
    default:
      return 3;
  }
};

const CardsWrapper = (props) => {
  const {
    productItems,
    className,
    ...other
  } = props;
  const variation = other.variation || other.variationType;
  const cols = getColSpan(variation);
  let keyCell;
  let index = 0;
  const productCards = [...productItems.map((product, idx) => {
    if (!product) return null;

    index++;
    keyCell = `-${idx}`;

    return (
      <ProductCard
        {...other}
        colSpan={cols}
        isGridItem
        key={keyCell}
        oddTwoColumnCell={index % 2 === 1 && variation === 'Two-Column'}
        product={product}
      />
    );
  })];

  return <Grid className={className}>{productCards}</Grid>;
};

CardsWrapper.propTypes = {
  productItems: array,
  colorCodes: array,
  className: string,
  other: object,
};
export default CardsWrapper;
