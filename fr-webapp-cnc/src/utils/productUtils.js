import { imagesApi } from 'config/api';
import { getByCriteria } from 'utils';
import { getTranslation } from 'i18n';
import { COMING_SOON_FLAG, kingPromo } from 'config/site/default';
import getProperty from './getProperty';

/**
 * Returns selected dimension or defaultSKU code
 * @param {Object} product
 * @param {string} dimension
 * @return {string}
 */
export function getSelectedDimensionCode(product, dimension) {
  return getProperty(product, `selected.${dimension}.code`) || getProperty(product, `defaultSKU.${dimension}Code`);
}

/**
 * @param productImages - standardized product images to map from
 * @param alternates - alternate images (these will always be the same in the product images)
 * @param colorCode - color code
 *
 * First image in the product images is the main image
 * that pertains to the currently selected color, alternate images appended
 */
export function buildProductImages(productImages, alternates, colorCode) {
  const standardizedImage = productImages.urls.find(image => image.code === colorCode);

  return {
    ...alternates,
    urls: [standardizedImage, ...alternates.urls],
  };
}

function mapAlternateImages(urls) {
  return urls.map(alt => ({ code: undefined, url: alt }));
}

function mapImageTypeToSuffixAndExtension(imageType) {
  switch (imageType) {
    case 'small':
      return '_small.jpg';
    case 'swatch':
      return '.gif';
    case 'main':
      return '.jpg';
    case 'zoom':
      return '_large.jpg';
    case 'family':
      return '_middles.jpg';
    case 'familyProduct':
      return '_popup.jpg';
    default:
      return '.jpg';
  }
}

/**
 * @param product - standardized product details container
 * @param colors - default color code for the current product
 * @param imageType - type of image to be constructed
 * @returns {*}
 *
 * Builds out image URL and code objects for all said types of images
 * (PRODUCT and ALTERNATE images are special, treated separately)
 */
export function buildImages(product, colors, imageType) {
  if (!product || !product.images) {
    return {};
  }

  if (imageType === 'alternates') {
    // TODO CLEAR THIS WITH CATALOG / GQL - images skipping indexes and no rule to follow
    if (!product.alternateImages) {
      const { main } = product.images;

      return {
        main: {
          width: main.width,
          height: main.height,
          urls: [],
        },
        zoom: {
          width: main.width,
          height: main.height,
          urls: [],
        },
      };
    }

    const { main, zoom } = product.alternateImages;

    return {
      main: {
        width: main.width,
        height: main.height,
        urls: mapAlternateImages(main.urls),
      },
      zoom: {
        width: zoom.width,
        height: zoom.height,
        urls: mapAlternateImages(zoom.urls),
      },
    };
  }

  const { width, height } = product.images[imageType];
  const imageUrl = imagesApi.base.replace('%region', imagesApi.region).replace('%type', imagesApi.type);
  const staticUrl = `${imageUrl}${product.productID}/${imageType === 'swatch' ? 'chip' : 'item'}/`;

  return {
    width,
    height,
    urls: colors.map((color) => {
      const code = color.code || color.colorCode;

      return {
        code,
        url: `${staticUrl}${code}_${product.productID}${mapImageTypeToSuffixAndExtension(imageType)}`,
      };
    }),
  };
}

/**
 * @param product - standardized product details container
 * @param colors - sorted available colors for product
 * returns currently in-use image types built out in a standard way
 */
export function buildAllImageTypes(product, colors) {
  const colorCode = getSelectedDimensionCode(product, 'color') || product.defaultColor;
  const buildImagesForProduct = buildImages.bind(null, product, colors);
  const alternates = buildImagesForProduct('alternates');
  const mainImages = buildImagesForProduct('main');
  const zoomImages = buildImagesForProduct('zoom');
  const productImages = buildProductImages(mainImages, alternates.main, colorCode);
  const productZoomImages = buildProductImages(zoomImages, alternates.zoom, colorCode);

  return {
    mainAlternates: alternates.main,
    zoomAlternates: alternates.zoom,
    small: buildImagesForProduct('small'),
    swatch: buildImagesForProduct('swatch'),
    main: mainImages,
    zoom: zoomImages,
    product: productImages,
    productZoom: productZoomImages,
  };
}

export function isProductNotYetRelease(product) {
  return new Date(product.salesStart) > Date.now();
}

export function isProductMandatoryInseam(product) {
  return parseInt(product.alteration.type, 10) === 3;
}

export function standardizeSKUAlterations(product) {
  let newSkus = product.SKUs.map(sku => ({ ...sku, maxLength: sku.maxLength }));

  if (isProductMandatoryInseam(product)) {
    newSkus = newSkus.map(sku => ({
      ...sku,
      maxLength: sku.maxLength / 10,
    }));
  }

  return newSkus;
}

/**
 * GDS returns mm as unit and multiplies everything by 10, need to make it standard cm unit.
 */
function standardizeAlteration(isNonStandard, product) {
  if (isNonStandard && isProductMandatoryInseam(product)) {
    return product.alterationInfoList.map(info => ({
      ...info,
      alterationMinLength: info.alterationMinLength / 10,
      alterationUnit: info.alterationUnit / 10,
      alterationUnitName: 'cm',
    }));
  }

  return product.alterationInfoList;
}

/**
 * @param sku - sku object to extract information from that describes the product in general
 * not necessarily only one sku
 */
export function extractEssentialSkuInfo(sku = {}) {
  const arrFlags = sku.flags;
  const flags = {};

  if (arrFlags && arrFlags.length > 0) {
    arrFlags.forEach((flag) => {
      flags[flag] = true;
    });
  }

  return {
    isPreSales: !!flags.preSales,
    isNewColor: !!flags.newColor,
    isComingSoon: !!flags.comingSoon,
    isMemberOnly: !!flags.memberOnly,
    isOnlineOnly: sku.onlineOnly,
    isDailyLimited: !!flags.dailyLimited,
    isMultiBuy: !!flags.multiBuy,
    isNewPrice: !!flags.newPrice,
    isLimitedOffer: sku.limitedOffer,
    isDiscount: sku.discount,
    isExtraLargeStoreOnly: !!flags.extraLargeStoreOnly,
    isLargeStoreOnly: !!flags.largeStoreOnly,
    isLimitedStore: !!flags.limitedStore,
    isOnlineLimited: !!flags.onlineLimited,
  };
}
/**
 * Returns a standardized object that contains the product details, defaultSKU object,
 * standardized image objects, and all valid colors, sizes and lengths for a product, sorted
 * @param product - GQL result product to standardize
 * @param {Array<productItem.dimensionItem>} colors - pre-sorted available colors for product
 * @param {Array<productItem.dimensionItem>} sizes - pre-sorted available sizes for product
 * @param {Array<productItem.dimensionItem>} lengths - pre-sorted available lengths for product
 * @param {Object} emptyProduct - empty product object
 * @returns {*}
 */
export function standardizeProduct(product, colors, sizes, lengths, emptyProduct) {
  if (!product || !product.SKUs) {
    return {};
  }

  const defaultSKU = getByCriteria(product.SKUs, { id: product.defaultSKU });
  const nonStandardAlteration = product.alteration && product.alteration.type !== '2';

  if (product.alterationInfoList && product.alterationInfoList.length) {
    const alteration = [];

    product.alterationInfoList.forEach((list) => {
      Object.keys(list).forEach((flag) => {
        alteration.push({ ...list[flag], alterationFlagKey: flag });
      });
    });
    product.alterationInfoList = alteration;
  }

  const optionalInseam = product.alterationInfoList && product.alterationInfoList.find(type => type.index === 1);
  const selectedInseam = optionalInseam ? {
    mandatory: false,
    ...emptyProduct.inseam,
  } : {
    mandatory: true,
    length: defaultSKU.maxLength,
    type: product.alterationInfoList && product.alterationInfoList[0].alterationFlagKey,
  };

  if (isProductMandatoryInseam(product)) {
    defaultSKU.maxLength /= 10;
  }

  return {
    ...emptyProduct,
    ...product,
    defaultSKU,
    selected: {
      ...emptyProduct.selected,
      ...product.selected,
      sku: defaultSKU,
      inseam: { ...selectedInseam },
      indexes: {
        ...emptyProduct.selected.indexes,
        image: 0,
      },
    },
    images: { ...buildAllImageTypes(product, colors) },
    SKUs: nonStandardAlteration ? standardizeSKUAlterations(product) : [...product.SKUs],
    alterationInfoList: standardizeAlteration(nonStandardAlteration, product),
    availableColors: colors,
    availableSizes: sizes,
    availableLengths: lengths,
    comingSoon: isProductNotYetRelease(product),
    ...extractEssentialSkuInfo(defaultSKU),
    categoryName: product.genderName || '',
  };
}

export function getSortedProductList(prodList, ids) {
  const sortedIds = ids.split(',');
  const sortedItems = [];

  sortedIds.forEach((id) => {
    prodList.items.forEach((item) => {
      if (item.onlineID === id) sortedItems.push(item);
    });
  });

  return sortedItems;
}

export function mapCertonaToCatalog(item) {
  const {
    imageURL,
    defaultSKU,
    currentPrice,
    discount,
    onlineOnly,
    onlineStock,
    multiBuy,
    salesStart,
    title,
    id,
    onlineCategory,
  } = item;

  // TODO actual conversion of online category to category to be done
  const category = onlineCategory.replace('0', '');
  const mainImageUrl = imageURL.replace('_reco', '');

  return {
    SKUs: [
      {
        id: defaultSKU,
        currentPrice,
        discount,
        onlineOnly,
        onlineStock,
        multiBuy,
        salesStart,
      },
    ],
    images: {
      main: {
        urls: [
          {
            url: mainImageUrl,
          },
        ],
      },
      swatch: {
        urls: [{}],
      },
    },
    originalPrice: currentPrice,
    title,
    productID: id,
    defaultSKU,
    category,
  };
}

export function getProductList(prodListArray, recommendations) {
  return prodListArray && prodListArray.map((item) => {
    let itemVal;

    if (!recommendations) {
      itemVal = { ...item };

      const colors = [...item.images.swatch.urls];
      const mainImageUrls = [...item.images.main.urls];

      itemVal.images.swatch = { ...buildImages(item, colors, 'swatch') };
      itemVal.images.main = { ...buildImages(item, mainImageUrls, 'main') };
    } else {
      itemVal = { ...mapCertonaToCatalog(item) };
    }

    return itemVal;
  }) || [];
}

export function getProductImage(productID, colorCode) {
  const imageUrl = imagesApi.base.replace('%region', imagesApi.region).replace('%type', imagesApi.type);

  return `${imageUrl}${productID}/item/${colorCode}_${productID}_middles.jpg`;
}

export function arrayHasObj(array, obj, field) {
  return !!array.find(item => item[field] === obj[field]);
}

export function getSkuId(...args) {
  return args.reduce((prev, cur) => (cur ? `${prev}-${cur}` : prev));
}

function getComingSoonFlag(sku, dateTextObj = {}) {
  const dateMessage = getTranslation().pdp.dateFlags;
  const dateFlagsObj = Object.keys(dateTextObj).length === 0 ? dateMessage : dateTextObj;

  const comingSoon = sku && sku.flags && sku.flags.includes(COMING_SOON_FLAG);

  if (comingSoon) {
    const startTime = new Date(parseInt(sku.salesStart, 10));
    const date = startTime.getDate();
    let datePeriod = dateFlagsObj.thirdDatePeriod;

    if (date < 10) {
      datePeriod = dateFlagsObj.firstDatePeriod;
    } else if (date > 20) {
      datePeriod = dateFlagsObj.secondDatePeriod;
    }

    const month = startTime.getMonth() + 1;
    const paddedMonth = (`0${month}`).slice(-2);

    return `${paddedMonth}${dateFlagsObj.month}${datePeriod}${dateFlagsObj.season}`;
  }

  return null;
}

const SALESPERIOD = 14;

function isSaleStart(sku) {
  const salesStartTime = new Date(parseInt(sku.salesStart, 10));
  const salesEndTime = new Date(salesStartTime.setDate(salesStartTime.getDate() + SALESPERIOD));
  const today = new Date();

  // If salesEndTime is not passed.
  return !!(salesEndTime.getTime() >= today.getTime());
}

const availableSpecialFlags = [
  'isMemberOnly',
  'isDailyLimited',
  'isMultiBuy',
  'isKingPromo',
  'isNewPrice',
  'isLimitedOffer',
  'isDiscount',
  'isPartialDiscount',
  'isNewSKU',
  'isOnlineLimited',
];

const availableNormalFlags = [
  'isPreSales',
  'isSalesStart',
  'isNewColor',
  'isComingSoon',
  'isOnlineOnly',
  'isExtraLargeStoreOnly',
  'isLargeStoreOnly',
  'isLimitedStore',
];

const availableSpecialPriceFlags = [
  'isMemberOnly',
  'isOnlineLimited',
  'isDailyLimited',
  'isDiscount',
  'isLimitedOffer',
];

/**
 *
 * @param sku - product sku
 * @param promotion - product promotion
 * @param priceSpecials - i18n.pdp.priceSpecials, from context
 * @param dateTextObj - i18n.pdp.dateFlags, from context
 * @returns {{normal: Array, special: Array}}
 */
export function getSpecialFlagsForSku(sku = {}, priceSpecials, dateTextObj = {}, promotion = {}) {
  const specialEntity = extractEssentialSkuInfo(sku);

  priceSpecials.isComingSoon = getComingSoonFlag(sku, dateTextObj);
  specialEntity.isKingPromo = !!promotion && promotion.kingPromoFlg === kingPromo.qualified;
  specialEntity.isSalesStart = isSaleStart(sku);

  const slightlySpecial = availableNormalFlags.reduce((specials, special) =>
    (specialEntity[special] ? [...specials, priceSpecials[special]] : specials), []);
  const verySpecial = availableSpecialFlags.reduce((specials, special) =>
    (specialEntity[special] ? [...specials, priceSpecials[special]] : specials), []);

  return {
    normal: slightlySpecial,
    special: verySpecial,
  };
}

/**
 *
 * @param specialFlags - Array of special flags
 * @returns boolean
 */
export function isSpecialPrice(specialFlags) {
  const priceFlags = getTranslation().pdp.priceSpecials;

  return specialFlags &&
    availableSpecialPriceFlags.map(item => priceFlags[item]).some(elem => specialFlags.includes(elem));
}

export function titleDecode(input) {
  const e = document.createElement('div');

  e.innerHTML = input;

  return e.childNodes[0].nodeValue;
}

/**
 *
 * @param sizes - Array of product sizes
 * @param SKUs - Array of product SKUs
 * @returns product size range
 */
export function getProductSize(sizes, SKUs) {
  //  Removes SKUs that are not in stock and returns sizes from available SKUs
  const availableSKUsSizes = SKUs && SKUs.filter(sku => sku.onlineStock > 0).map(obj => obj.size);
  const availableSizeArray = sizes && Object.keys(sizes).map(key => sizes[key].name);
  // Removes unavailable sizes from product sizes
  const availableSizes = availableSizeArray && availableSizeArray.filter(size => availableSKUsSizes.includes(size));
  const sizeCount = availableSizes && availableSizes.length;
  const startSize = sizeCount ? availableSizes[0] : '';
  const sizeEnd = sizeCount > 1 ? `-${availableSizes[sizeCount - 1]}` : '';

  return `${startSize}${sizeEnd}`;
}
