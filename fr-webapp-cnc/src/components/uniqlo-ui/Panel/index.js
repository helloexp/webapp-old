import React, { Children, PureComponent, PropTypes, cloneElement } from 'react';
import logger from 'utils/logger';
import { format } from '../helpers/utils/productService';
import { getApiDetail } from '../helpers/utils/http';

const { any } = PropTypes;

const styleData = ['狨 みゃご キマ', '祚姥ぎゅ', 'ル堨ウせご キマを', 'は榟 ほろ', 'ぬボ襊', 'HEATTECH', 'がぺけ', 'ちぢゅ', 'ル堨ウせご キマを', 'は榟 ほろ', 'ぬボ襊'];

// const priceData = ['‎¥499キマ', '‎¥500 - ‎¥999', '‎¥1000 - ‎¥1999', '‎¥2000 - ‎¥3999', '‎¥4000 - ‎¥5999', '‎¥6000 - ‎¥7999', '‎¥8000 - ‎¥9999', '‎¥10000マを'];
const prodGridViewTypes = [1, 2, 6];

function formatRange(data) {
  const formattedData = [];

  while (data.length > 0) {
    formattedData.push(data.splice(0, 2).join(' - '));
  }

  return formattedData;
}

function getViewType(type) {
  const cases = {
    1: 'Single-Large',
    2: 'Two-Column',
    3: 'Multi-Small',
    4: 'Multi-Large',
    5: 'Single-Small',
    6: 'Single-SmallPlus',
  };

  let viewType;

  if (cases[type]) {
    viewType = cases[type];
  } else {
    // default case
    viewType = cases[1];
  }

  return viewType;
}

class Panel extends PureComponent {

  static propTypes = {
    children: any,
  };

  state = {
    prodGridViewType: 'Single-Large',
    filterData: {},
    selectedFilters: {},
  };

  componentDidMount() {
    this.panelConfig = {
      fetchURL: '/filters',
      category: '321',
      currencySymbol: '¥',
      sortOptions: {
        recommended: 'reviewScore desc',
        latest: 'salesStart desc',
        cheap: 'price asc',
        descending: 'price desc',
        score: 'score desc',
      },
    };
    this.loadFilterOptions();
  }

  setFilterData(data) {
    const languageConfig = {
      recommended: 'おすすめ順',
      latest: '新作順',
      cheap: '安い順',
      descending: '高い順',
      score: '評価順',
      lessThan: '祚姥',
      greaterThan: '祚姥',
    };
    const {
     recommended,
     latest,
     cheap,
     descending,
     score,
     lessThan,
     greaterThan,
   } = languageConfig;

    const { currencySymbol, sortOptions: sortConfig } = this.panelConfig;
    const result = data.data.catalog.search.aggregations || {};
    const { sizes, colors, prices } = result;

    const sizeData = sizes && sizes.map(obj => obj.key);
    const colorsData = colors && colors.map(obj => obj.key);

    let priceData;
    const priceOptions = {};

    if (prices && prices.length > 0) {
      let praceRanges = prices && prices.map(obj => parseInt(obj.key, 10)).sort((first, second) => first - second) || [];
      const firstPrice = praceRanges.shift();
      const lastPrice = praceRanges[praceRanges.length - 1];
      const greater = lastPrice ? `${currencySymbol} ${format(lastPrice)} ${greaterThan}` : null;

      if (praceRanges.length === 1) {
        praceRanges.unshift(firstPrice);
      }

      priceData = praceRanges.map(obj => `${currencySymbol} ${format(obj)}`);
      priceData = [`${currencySymbol} ${format(firstPrice)} ${lessThan}`, ...formatRange(priceData), greater];
      praceRanges = [`0 - ${firstPrice}`, ...formatRange(praceRanges), lastPrice];
      praceRanges.forEach((value, index) => {
        priceOptions[priceData[index]] = value;
      });
    }

    const sortData = Object.keys(sortConfig).map(key => sortConfig[key]);
    const sortOptions = [recommended, latest, cheap, descending, score];
    const filteredCount = data.data.catalog.search.count || 0;
    let filterProps;

    if (filteredCount > 0) {
      filterProps = {
        styleOptions: styleData,
        sizes: sizeData,
        colors: colorsData,
        prices: priceData,
        priceOptions,
        sortOptions,
        sortData,
        filteredCount,
      };
    } else {
      filterProps = this.state.filterProps;
      filterProps.filteredCount = 0;
    }

    this.setState({ filterProps });
  }

  loadFilterOptions(filterData) {
    const promise = new Promise((resolve, reject) => {
      this.fetchFilterables(resolve, reject, filterData);
    });

    promise.then((result) => {
      this.setFilterData(result);
    }, (err) => {
      logger.error('Filter data API Error :', err);
    });
  }

  fetchFilterables(successCallback, failureCallback, filterData) {
    const config = this.panelConfig;
    let queryFields;

    for (const key in filterData) {
      if (key === 'sort') {
        const sortQuery = filterData[key].split(' ');

        queryFields = [`${key}: ${sortQuery[0]}, order: ${sortQuery[1]} `, queryFields].join();
      } else if (filterData.hasOwnProperty(key) && filterData[key]) {
        queryFields = [`${key}: "${filterData[key]}"`, queryFields].join();
      }
    }

    queryFields = [`category: "${config.category}"`, queryFields].join();
    const queryParameter = `
      query{
        catalog {
          search(${queryFields})  {
            count
            aggregations {
              sizes {
                key total
              }
              colors {
               key total
              }
              prices {
                key total
              }
            }
          }
        }
      }`;
    const queryData = { queryParameter, productUrl: config.fetchURL };

    getApiDetail(queryData, successCallback, failureCallback, 'POST');
  }

  changeView = (event, viewType) => {
    this.setState({
      prodGridViewType: getViewType(viewType),
    });
  };

  processSelectedData = (filteredData) => {
    const {
      selectedColors,
      selectedSizes,
      selectedPrices,
      selectedSortList,
    } = filteredData;
    const filterData = {};

    if (selectedSizes.length > 0) {
      filterData.size = selectedSizes;
    }

    if (selectedColors.length > 0) {
      filterData.color = selectedColors;
    }

    if (selectedPrices.length > 0) {
      filterData.priceRange = selectedPrices.map(value => this.state.filterProps.priceOptions[value]);
    }

    if (selectedSortList >= 0) {
      filterData.sort = this.state.filterProps.sortData[selectedSortList];
    }

    return filterData;
  };

  clearFilter = () => {
    this.loadFilterOptions();
    this.setState({ selectedFilters: {} });
  };

  handleFilter = (selectedData) => {
    const filterData = this.processSelectedData(selectedData);

    this.setState({ filterData });
  };

  updateFilter = (...slectedData) => {
    const filterData = this.processSelectedData(slectedData[0]);

    this.loadFilterOptions(filterData);
    this.setState({ selectedFilters: slectedData[0] });
  };

  parseChildren(children) {
    const parsedChildren = Children.map(children, (child) => {
      const displayName = child.props._type || child.type.componentName;
      const {
        prodGridViewType: currViewType,
        filterData,
        filterProps,
        selectedFilters,
      } = this.state;

      let parsedChild;

      if (displayName === 'Toolbar') {
        parsedChild = cloneElement(child, {
          onViewChange: this.changeView,
          onFilter: this.handleFilter,
          onUpdateFilter: this.updateFilter,
          onClearFilter: this.clearFilter,
          filterProps,
          selectedFilters,
          viewTypes: prodGridViewTypes,
        });
      } else if (displayName === 'ProductGrid') {
        parsedChild = cloneElement(child, {
          variationType: currViewType,
          filterData,
        });
      } else {
        parsedChild = child;
      }

      return parsedChild;
    });

    return parsedChildren;
  }

  render() {
    const children = this.parseChildren(this.props.children);

    return (
      <div>
        {children}
      </div>
    );
  }
}

export default Panel;
