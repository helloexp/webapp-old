export default function variationToCss(styles, variation) {
  switch (variation) {
    case 'Two-Column':
      return styles.twoCol;
    case 'Two-ColumnPlus':
      return styles.twoColPl;
    case 'Single-Small':
      return styles.singleSm;
    case 'Single-SmallPlus':
      return styles.singleSmPl;
    case 'Multi-Small':
      return styles.multiSm;
    case 'Multi-Large':
      return styles.multiLg;
    case 'Single-Large':
      return styles.singleLg;
    case 'Single-LargePlus':
      return styles.singleLgPl;
    case 'Single-Small-Outfit':
      return styles.singleSmOutfit;
    case 'Single-Small-Cart':
      return styles.singleSmCart;
    case 'largeProduct':
      return styles.lgProduct;
    case 'largeProductRectangle1E1':
      return styles.lgProduct1e1;
    case 'largeProductRectangle3E4':
      return styles.lgProduct3e4;
    default:
      return '';
  }
}
