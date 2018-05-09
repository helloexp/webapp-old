export const getSKUInfo = (product, sku) => product && product.SKUs && product.SKUs.find((skuObj, key) => skuObj || sku[key]);

export function format(prices) {
  let price = null;

  if (!(prices === null || prices === undefined || prices === '')) {
    price = parseInt(prices, 10).toLocaleString();

    if (price === prices.toString()) {
      //  For fixing number format issue in safari.
      price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  } else {
    price = '';
  }

  return price;
}

export function colorSort(input, length) {
  const { colorCode, code } = input[0];
  const fieldName = colorCode && 'colorCode' || code && 'code';

  if (!fieldName) return input;

  input.sort((firstItem, secondItem) => firstItem[fieldName] - secondItem[fieldName]);

  const outputLength = length || 8;

  if (input.length <= outputLength) return input;

  const output = [];
  const segments = {};
  const boundaries = [0, 10, 20, 33, 50, 60, 70, 80, 100];
  const pickingOrder = [6, 2, 4, 3, 5, 7, 1, 8];

  boundaries.forEach((boundary, index) =>
    (segments[index] = input.filter(item => item[fieldName] >= boundaries[index - 1]
      && item[fieldName] <= boundary - 1))
  );

  // Iteration #1
  let values;
  let pickIndex;

  Object.keys(segments).slice(1, 8).forEach((key) => {
    values = segments[key];
    if (values && values.length > 0) {
      output.push(values.shift());
    } else {
      pickIndex = pickingOrder.indexOf(parseInt(key, 10));
      if (pickIndex !== -1) {
        pickingOrder.splice(pickIndex, 1);
      }
    }
  });

  let finalValue;
  let totalItems = 8;

  if (segments[1].length > 0) {
    finalValue = segments[1].pop();
    totalItems--;
  }

  // Iteration #2
  let index = 0;
  const totalIteration = pickingOrder.length * totalItems;

  for (let iteration = 1; output.length < totalItems && iteration <= totalIteration; iteration++) {
    values = segments[pickingOrder[index]];
    if (values && values.length > 0) {
      output.push(values.pop());
    }

    index = index < pickingOrder.length ? index + 1 : 0;
  }

  // Final Step
  output.sort((firstItem, secondItem) => firstItem[fieldName] - secondItem[fieldName]);
  if (totalItems !== 8) {
    output.push(finalValue);
  }

  return output.slice(0, outputLength);
}
