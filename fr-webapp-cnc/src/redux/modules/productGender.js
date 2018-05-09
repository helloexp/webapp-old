import { catalogApi } from 'config/api';
import { constantsGenerator } from 'utils';

const generateConstants = constantsGenerator('productGender');
const { GET_PRODUCT_GENDER, GET_PRODUCT_GENDER_SUCCESS, GET_PRODUCT_GENDER_FAIL } = generateConstants('GET_PRODUCT_GENDER');

function mapProductGender(productGenderList) {
  return productGenderList.reduce((acc, product) => {
    const promotion = product.meta.promotion || {};

    acc[product.onlineID] = {
      gender: product.genderName,
      promotionId: promotion.id || '',
      alterationUnit: product.alteration && product.alteration.unit,
    };

    return acc;
  }, {});
}

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case GET_PRODUCT_GENDER_SUCCESS: {
      const items = action.result.items || [];
      const productGender = action.brand
        ? { [action.brand]: mapProductGender(items) }
        : { ...mapProductGender(items) };

      return {
        ...state,
        ...productGender,
      };
    }

    default:
      return state;
  }
}

export function getProductGenderList(onlineIds, brand) {
  return {
    types: [GET_PRODUCT_GENDER, GET_PRODUCT_GENDER_SUCCESS, GET_PRODUCT_GENDER_FAIL],
    promise: client => client.get(catalogApi.productDetail, {
      host: `${catalogApi.base}/${catalogApi.version}/${brand}/${catalogApi.region}`,
      params: {
        clientID: catalogApi.client,
        locale: catalogApi.language,
        onlineID: onlineIds,
      },
    }),
    brand,
  };
}
