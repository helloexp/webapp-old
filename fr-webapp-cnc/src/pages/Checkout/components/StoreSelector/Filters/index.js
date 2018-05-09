import React, { Component, PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Heading from 'components/uniqlo-ui/Heading';
import classNames from 'classnames/bind';
import { isFilterActive } from 'utils/deliveryUtils';
import config from 'config/site/default';
import Filter from './Filter';
import FilterSelectedIcon from './FilterSelectedIcon';

import styles from './styles.scss';

const { func, object, number, bool, string } = PropTypes;
const cx = classNames.bind(styles);
const filtersHeaderClass = classNames('subHeader', styles.numberOfResults, styles.filterHeader);
const filtersClass = classNames('blockText', styles.title);
const filtersBtnClass = classNames('secondary', 'medium', styles.filterBtn);

export default class Filters extends Component {
  static propTypes = {
    filters: object,
    total: number,
    resetFilter: bool,
    brand: string,
    isPaymentStore: bool,
    onFilter: func,
    onToggleFilter: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    expanded: false,
    filterSelection: null,
  };

  onToggle = () => {
    const { expanded, filterSelection } = this.state;

    this.setState({
      expanded: !expanded,
      filterSelection: !expanded ? this.props.filters : filterSelection,
    });
  };

  onFilter = () => {
    const { filterSelection: selections } = this.state;
    const filters = {};
    const expanded = false;

    if (selections) {
      Object.keys(selections).forEach((key) => {
        const userFilter = selections[key];

        if (userFilter.length) {
          // We are providing options to large/extra large store_type_code in filters
          // API accept only one value for store_type_code.
          // selection large & extra large -> Applied filter is large (includes extra large result)
          const isFilterLarge = key === 'store_type_code' && userFilter.length > 1;
          const value = isFilterLarge ? userFilter.reduce((prev, next) => prev && Math.min(prev, next) || next) : userFilter.join(',');

          filters[key] = value;
        }
      });
    }

    if (this.props.onFilter) {
      this.props.onFilter(filters);
      this.setState({ expanded });
    }

    this.props.onToggleFilter(selections);
  };

  setFilter = (name, checked, value) => {
    const selections = { ...this.state.filterSelection };

    const selection = selections[name];

    if (selection) {
      // If unchecked we need to remove value from array
      if (checked === false) {
        selections[name] = selection.filter(item => item !== value);
      } else {
        selections[name] = [...selection, value];
      }
    } else {
      selections[name] = [value];
    }

    this.setState({ filterSelection: selections });
  };

  render() {
    const { deliveryStore } = this.context.i18n;
    const { filterSelection, expanded } = this.state;
    const { filters } = this.props;
    const filterIconToggleClass = cx('default', {
      filtersIcon: true,
      expanded,
      applied: isFilterActive(filters),
    });
    const filterBodyClass = cx('default', {
      filtersBody: true,
      expanded: this.state.expanded,
    });
    const filterList = [];

    config.storePaymentFilter.forEach((criteria, index) => {
      if (criteria.brand.includes(this.props.brand)) {
        filterList.push(
          <Filter
            key={index}
            label={deliveryStore[criteria.label]}
            name={criteria.name}
            onChange={this.setFilter}
            selections={filterSelection}
            value={criteria.value}
          />
        );
      }
    });

    return (
      <div className={styles.filtersContainer}>
        <div className={styles.filtersHeader}>
          <Heading
            headingText={deliveryStore.results.replace('%d', this.props.total)}
            className={filtersHeaderClass}
            type="h6"
          />
          <div className={styles.filtersToggler}>
            <Button
              className={filterIconToggleClass}
              label={deliveryStore.narrowDown}
              labelClass={styles.buttonLabeldefault}
              noLabelStyles
              onTouchTap={this.onToggle}
            >
            { isFilterActive(filters) &&
              <FilterSelectedIcon
                label={deliveryStore.narrowDown}
              />
            }
            </Button>
          </div>
        </div>
        <div className={filterBodyClass}>
          <Text className={filtersClass}>{deliveryStore.searchConditions}</Text>
          {filterList}
          <Button className={filtersBtnClass} label={deliveryStore.search} onTouchTap={this.onFilter} preventMultipleClicks />
        </div>
      </div>
    );
  }
}
