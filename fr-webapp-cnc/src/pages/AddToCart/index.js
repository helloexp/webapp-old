import React, { PropTypes, Component } from 'react';
import logger from 'utils/logger';
import { connect } from 'react-redux';
import * as cartActions from 'redux/modules/cart';
import ApiClient from 'helpers/ApiClient';
import Link from 'components/uniqlo-ui/Link';
import { root } from 'utils/routing';
import { getByCriteria } from 'utils';
import Button from 'components/uniqlo-ui/Button';

const client = new ApiClient();

const { func, array, bool, arrayOf, string, number, object } = PropTypes;

function isProductMandatoryInseam(product) {
  return parseInt(product.alteration.type, 10) === 3;
}

function standardizeSKUAlterations(product) {
  let newSkus = product.SKUs.map(sku => ({ ...sku, maxLength: sku.maxLength }));

  if (isProductMandatoryInseam(product)) {
    newSkus = newSkus.map(sku => ({
      ...sku,
      maxLength: sku.maxLength / 10,
    }));
  }

  return newSkus;
}

function getInseamLength(product, length) {
  if (length) {
    if (length > 100) return length / 10;

    if (product.selected.inseam.mandatory && length < 100) return length * 10;

    return length;
  }

  return undefined;
}

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

function standardizeProducts(products = []) {
  const standardProducts = {};

  Object.keys(products).forEach((productKey) => {
    const product = products[productKey];
    const defaultSKU = typeof product.defaultSKU === 'object' ? product.defaultSKU : getByCriteria(product.SKUs, { id: product.defaultSKU });
    const nonStandardAlteration = product.alteration && product.alteration.type !== '2';

    let alterationInfo = product.alterationInfoList;

    if (alterationInfo && alterationInfo.length) {
      const alteration = [];

      alterationInfo.forEach((list) => {
        Object.keys(list).forEach((flag) => {
          alteration.push({ ...list[flag], alterationFlagKey: flag });
        });
      });
      alterationInfo = alteration;
    }

    if (alterationInfo && alterationInfo.length && alterationInfo[0][0]) {
      alterationInfo = alterationInfo[0];

      const alterations = [];

      Object.keys(alterationInfo).forEach((alterationKey) => {
        alterations.push(alterationInfo[alterationKey]);
      });

      alterationInfo = alterations;
    }

    product.alterationInfoList = alterationInfo;

    const optionalInseam = alterationInfo && alterationInfo.find(type => type.index === 1);

    product.SKUs = nonStandardAlteration ? standardizeSKUAlterations(product) : [...product.SKUs];
    product.defaultSKU = defaultSKU;

    const selectedInseam = optionalInseam ? {
      mandatory: false,
      length: null,
      type: 0,
    } : {
      mandatory: true,
      length: defaultSKU.maxLength,
      type: alterationInfo && alterationInfo[0].alterationFlagKey,
    };

    if (isProductMandatoryInseam(product)) {
      defaultSKU.maxLength /= 10;
    }

    product.alterationInfoList = standardizeAlteration(nonStandardAlteration, product);

    product.selected = {
      inseam: { ...selectedInseam },
    };

    standardProducts[product.onlineId || product.onlineID] = product;
  });

  return standardProducts;
}

function loadItem(id, brand) {
  return client.get(`/catalog/v3/${brand}/jp/item/detail?clientID=mobileweb&locale=ja&onlineID=${id}`, {
    host: 'https://test3-api.fastretailing.com',
  }).then(data => ({
    catalog: {
      detail: {
        items: data.items,
      },
    },
  }));
}

function fetchInventory(product) {
  return client.post('/inventory/v1/uq/jp/inventoryInquiry', {
    host: 'https://sprintuat-g4-api.fastretailing.com',
    headers: {
      area: '1',
      Timezone: 'JST',
      Message_ID: '1',
    },
    data: {
      inventoryInquiry: {
        summaryUnit: 'C',
        inventoryTypeList: [{ inventoryType: '4' }],
        inventoryStatusList: [{ inventoryStatus: 'ATP' }],
        itemCodeList: product.SKUs.map(sku => ({ itemCode: sku.id })),
      },
    },
  });
}

const inlineStyles = {
  label: {
    display: 'block',
    width: '100%',
  },
  select: {
    display: 'block',
    width: '100%',
    border: '1px solid',
    padding: 10,
  },
  input: {
    display: 'block',
    width: '100%',
    border: '1px solid',
    padding: 10,
    boxSizing: 'border-box',
  },
  button: {
    display: 'block',
    width: '100%',
    border: '1px solid',
    padding: '10px 20px',
    background: 'transparent',
    boxSizing: 'border-box',
    color: 'inherit',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 1.5,
  },
};

const BrandSelect = ({ onRefChange, clearInventory }) => (
  <div>
    <label htmlFor="brandSelect" style={inlineStyles.label}> Brand </label>
    <select
      id="brandSelect"
      ref={onRefChange}
      onChange={clearInventory}
      style={inlineStyles.select}
    >
      <option value="uq" > UQ </option>
      <option value="gu" > GU </option>
    </select>
  </div>
);

BrandSelect.propTypes = {
  onRefChange: func,
  clearInventory: func,
};

const FillOnlineId = ({ isSelected, onRefChange, changeInputMethod }) => (
  <div>
    <label htmlFor="inputTypeFill" style={inlineStyles.label}>
      <input
        checked={isSelected}
        id="inputTypeFill"
        name="inputType"
        onChange={changeInputMethod}
        type="radio"
        value
      />
      Type product online id
    </label>
    <input
      disabled={!isSelected}
      id="enterProductId"
      placeholder="product online id"
      ref={onRefChange}
      style={inlineStyles.input}
      type="text"
    />
  </div>
);

FillOnlineId.propTypes = {
  isSelected: bool,
  onRefChange: func,
  changeInputMethod: func,
};

const SelectOnlineId = ({ isSelected, brand, onRefChange, changeInputMethod, onlineIds, clearInventory }) => (
  <div>
    <label htmlFor="inputTypeSelect" style={inlineStyles.label}>
      <input
        checked={isSelected}
        id="inputTypeSelect"
        name="inputType"
        onChange={changeInputMethod}
        type="radio"
        value={false}
      />
      Or select from list
    </label>
    <select
      disabled={!isSelected}
      id="selectProductId"
      onChange={clearInventory}
      ref={onRefChange}
      style={inlineStyles.select}
    >
      <option value=""> -- nothing selected -- </option>
      { onlineIds[brand].map(item =>
        <option
          key={brand === 'gu' ? item.onlineID : item}
          value={brand === 'gu' ? item.onlineID : item}
        >
          {brand === 'gu' ? item.onlineID : item}
        </option>
      )}
    </select>
  </div>
);

SelectOnlineId.propTypes = {
  isSelected: bool,
  onRefChange: func,
  changeInputMethod: func,
  brand: string,
  onlineIds: object,
  clearInventory: func,
};

const SelectQuantity = ({ onRefChange, quantityList }) => (
  <div>
    <label htmlFor="quantitySelect" style={inlineStyles.label}>
      Select quantity
    </label>
    <select
      id="quantitySelect"
      name="quantitySelect"
      ref={onRefChange}
      style={inlineStyles.select}
    >
      { quantityList.map(qt =>
        <option key={qt} value={qt}>{qt}</option>)
      }
    </select>
  </div>
);

SelectQuantity.propTypes = {
  onRefChange: func,
  quantityList: arrayOf(number),
};

const InventorySection = ({ inventory, product, addToCart, onRefChange, inseamLengthOnRefChange, inseamTypeOnRefChange }) => {
  if (!product) return null;
  const inseamLengthOptions = [];
  let ln = product.alteration.minLength;

  while (product.defaultSKU && ln < product.defaultSKU.maxLength) {
    inseamLengthOptions.push((
      <option key={ln} value={ln}>{ln}</option>
    ));

    ln++;
  }

  return (inventory.length
    ?
    <div>
      <hr />
      <label htmlFor="inventory">Inventory</label>
      <select id="inventory" name="" ref={onRefChange} style={inlineStyles.select}>
        { inventory.map(
          item => <option key={item} value={item}>{item}</option>)
        }
      </select>
      <hr />
      <label htmlFor="inseam_type">Inseam Type</label>
      <select id="inseam_type" name="" ref={inseamTypeOnRefChange} style={inlineStyles.select}>
        { product.alterationInfoList.map(
          item => <option key={item.index} value={item.alterationFlagKey}>{item.shortName || item.shortname}</option>)
        }
      </select>
      <label htmlFor="inseam_length">Inseam Length</label>
      <select id="inseam_length" name="" ref={inseamLengthOnRefChange} style={inlineStyles.select}>
        {inseamLengthOptions}
      </select>
      <br />
      <Button onTouchTap={addToCart} style={inlineStyles.button}>Add item to cart</Button>
    </div>

    : <div>Nothing in stock :(</div>);
};

InventorySection.propTypes = {
  inventory: array,
  onRefChange: func,
  addToCart: func,
  product: object,
  inseamTypeOnRefChange: func,
  inseamLengthOnRefChange: func,
};

@connect(null, { ...cartActions })
export default class AddToCart extends Component {
  static propTypes = {
    addToCart: func,
  };

  state = {
    onlineIds: {
      uq: [],
      gu: [],
    },
    products: {},
    quantityList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    inventory: null,
    loading: false,
    isFillInputType: true,
  };

  componentDidMount() {
    client.get('/catalog/v3/uq/jp/review/search?clientID=mobileweb&locale=ja&q=star%20wars', {
      host: 'https://test3-api.fastretailing.com',
    })
      .then(res =>
        this.setState({
          onlineIds: {
            ...this.state.onlineIds,
            uq: res.items.concat([{
              productID: '169118',
            }]).map(item => item.productID)
              .filter((item, idx, self) => self.indexOf(item) === idx),
          },
        }));

    client.get('/catalog/v3/gu/jp/item/search?clientID=add-to-cart&onlineCategory=002&inStock=true', {
      host: 'https://test3-api.fastretailing.com',
    })
      .then(res =>
        this.setState({
          onlineIds: {
            ...this.state.onlineIds,
            gu: res.items
              .filter((item, idx, self) => self.indexOf(item) === idx),
          },
        })).catch(logger.log);
  }

  getProduct = () => {
    const onlineId = this.getSelectedOnlineId();
    const brand = this.selectBrand.value;

    if (onlineId) {
      this.setState({
        loading: true,
      });
      loadItem(onlineId, brand)
        .then((itemData) => {
          if (!brand || brand === 'gu') {
            const products = this.state.onlineIds.gu.reduce((acc, item) =>
              ({ ...acc, [item.onlineID]: item }), {});

            this.setState(
              prevState => ({ products: { ...prevState.products, ...standardizeProducts(products) }, loading: false }),
              () => this.updateInventory(onlineId, true),
            );
          }

          const products = itemData.catalog.detail.items.reduce((acc, item) =>
            ({ ...acc, [item.onlineID]: item }), {});

          this.setState(
            prevState => ({ products: { ...prevState.products, ...standardizeProducts(products) }, loading: false }),
            () => Object.keys(products).forEach(key => this.updateInventory(key)),
          );
        })
        .catch(() => this.setState({ loading: false }));
    }
  };

  getSelectedOnlineId = () => (this.state.isFillInputType ? this.input.value : this.select.value);

  input;
  select;
  selectQuantity;
  selectSKU;
  selectBrand;

  inputRefChange = (node) => {
    this.input = node;
  };

  selectRefChange = (node) => {
    this.select = node;
  };

  selectQuantityRefChange = (node) => {
    this.selectQuantity = node;
  };

  selectInseamTypeRefChange = (node) => {
    this.selectInseamType = node;
  };

  selectInseamLengthRefChange = (node) => {
    this.selectInseamLength = node;
  };

  selectBrandRefChange = (node) => {
    this.selectBrand = node;
  };

  // for gu items we will have pre-loaded inventory
  updateInventory = (id, inventoryLoaded) => {
    const product = this.state.products[id];

    if (product) {
      if (!inventoryLoaded) {
        fetchInventory(product).then((inventoryData) => {
          const inventory = inventoryData.inventoryInquiry.data.locationList[0].itemList.reduce((acc, item) => {
            if (item.inventoryList && item.inventoryList.some(inventoryItem => inventoryItem.qty > 0)) {
              return acc.concat(item.itemCode);
            }

            return acc;
          }, []);

          this.setState({
            inventory: inventory.sort(),
          });
        });
      } else {
        this.setState({
          inventory: product.SKUs.map(sku => sku.onlineStock > 0 && sku.id).filter(Boolean).sort(),
        });
      }
    } else {
      logger.log('product wasn\'t load');
    }
  };

  addToCart = () => {
    const onlineId = this.getSelectedOnlineId();

    if (!onlineId) {
      logger.log('product online id wasn\'t introduced.');

      return;
    }

    const product = this.state.products[onlineId];
    const sku = product.SKUs.find(skuItem => skuItem.id === this.selectSKU.value);

    if (!sku) {
      logger.log('sku not found');

      return;
    }

    this.props.addToCart({
      l1Code: onlineId,
      l2Code: sku.l2Code,
      quantity: this.selectQuantity.value,
      inseamType: this.selectInseamType.value && parseInt(this.selectInseamType.value, 10) !== 0 ? parseInt(this.selectInseamType.value, 10) : null,
      inseamLength: getInseamLength(product, this.selectInseamLength.value) || null,
    }, this.selectBrand.value && this.selectBrand.value || 'uq')
      .then(() => logger.log('added to cart'))
      .catch(() => logger.log('not added to cart'));
  };

  changeInputMethod = (event) => {
    const isFillInputType = event.currentTarget.value === 'true';

    this.setState({
      isFillInputType,
      inventory: null,
    });

    if (isFillInputType) {
      this.select.value = '';
    } else {
      this.input.value = '';
    }
  };

  clearInventory = () => {
    this.setState({
      inventory: null,
    });
  };

  selectSKURefChange = (node) => {
    this.selectSKU = node;
  };

  render() {
    const { onlineIds, isFillInputType, quantityList, loading, inventory } = this.state;

    let onlineId;
    let product;

    if (this.state.products && Object.keys(this.state.products).length) {
      onlineId = this.getSelectedOnlineId();
      product = this.state.products[onlineId];
    }

    return (
      <div style={{ padding: 10 }}>
        <h1>Add to cart</h1>
        <BrandSelect
          clearInventory={this.clearInventory}
          onRefChange={this.selectBrandRefChange}
        />
        <FillOnlineId
          changeInputMethod={this.changeInputMethod}
          isSelected={isFillInputType}
          onRefChange={this.inputRefChange}
        />
        { onlineIds.gu.length || onlineIds.uq.length
          ?
            <div>
              <hr />
              <SelectOnlineId
                brand={this.selectBrand.value || 'uq'}
                changeInputMethod={this.changeInputMethod}
                clearInventory={this.clearInventory}
                isSelected={!isFillInputType}
                onlineIds={onlineIds}
                onRefChange={this.selectRefChange}
              />
            </div>

          : null
        }
        <hr />
        <SelectQuantity
          onRefChange={this.selectQuantityRefChange}
          quantityList={quantityList}
        />
        <hr />
        <Button onTouchTap={this.getProduct} style={inlineStyles.button}>Fetch inventory SKUs</Button>
        { loading ? 'loading...' : '' }
        { Array.isArray(inventory)
            ? <InventorySection
              addToCart={this.addToCart}
              inventory={inventory}
              product={product}
              onRefChange={this.selectSKURefChange}
              inseamTypeOnRefChange={this.selectInseamTypeRefChange}
              inseamLengthOnRefChange={this.selectInseamLengthRefChange}
            />
            : null
         }
        <br />
        <Link style={inlineStyles.button} to={`${root}/cart?brand=${this.selectBrand && this.selectBrand.value || 'uq'}`}>Go to cart page</Link>
      </div>
    );
  }
}
