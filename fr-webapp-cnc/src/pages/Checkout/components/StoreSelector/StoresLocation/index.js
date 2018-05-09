import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'components/uniqlo-ui/Button';
import Autocomplete from 'components/Autocomplete';
import Map from 'components/Map';
import ResultList from 'components/ResultList';
import If from 'components/uniqlo-ui/If';
import classNames from 'classnames';
import { loadStoresByFilter, loadMoreStores, setLocationView } from 'redux/modules/checkout/delivery/store/actions';
import { getStorePickupDeliveryDate } from 'redux/modules/checkout/delivery/selectors';
import { getCurrentBrand } from 'utils/routing';
import { calculateZoomLevel } from 'utils/map';
import { storeMap } from 'config/site/default';
import * as deliveryStoreSelectors from 'redux/modules/checkout/delivery/store/selectors';
import Confirmation from '../Confirmation';
import Filters from '../Filters';
import styles from './styles.scss';

function getFloat(value) {
  return typeof value === 'string' ? parseFloat(value) : value;
}

function getMaxAndMinLatLong(arr) {
  const lat0 = getFloat(arr[0].lat);
  const long0 = getFloat(arr[0].long);

  let minLat = lat0;
  let maxLat = lat0;
  let minLong = long0;
  let maxLong = long0;

  for (let index = 1; index < arr.length; index++) {
    const curLat = getFloat(arr[index].lat);
    const curLong = getFloat(arr[index].long);

    if (curLat < minLat) {
      minLat = curLat;
    }

    if (curLong < minLong) {
      minLong = curLong;
    }

    if (curLat > maxLat) {
      maxLat = curLat;
    }

    if (curLong > maxLong) {
      maxLong = curLong;
    }
  }

  return { minLat, minLong, maxLat, maxLong };
}

const { array, func, object, string, bool, oneOfType, number } = PropTypes;

const SearchByPrefecture = ({ prefecture, onSetLocationView, prefectureAvaliable }) => (
  <div className={styles.prefecturesLink}>
    <Button
      className={classNames('default', 'medium', styles.searchByPrefecture, { [styles.empty]: !prefectureAvaliable })}
      label={prefecture}
      onTouchTap={onSetLocationView}
    />
  </div>
);

SearchByPrefecture.propTypes = {
  prefecture: string,
  onSetLocationView: func,
  prefectureAvaliable: oneOfType([bool, object]),
};

const AutoCompleteBox = ({ autocomplete, onSearch, hintText }) => (
  <div className={styles.searchBox}>
    <Autocomplete
      data={autocomplete}
      hintText={hintText}
      labelField="name"
      onChange={onSearch}
      className={styles.storeSearch}
    />
  </div>
);

AutoCompleteBox.propTypes = {
  autocomplete: array,
  onSearch: func,
  hintText: string,
};

@connect((state, props) => ({
  errorMessages: deliveryStoreSelectors.getStorePickupError(state),
  autocomplete: deliveryStoreSelectors.getAutoComplete(state),
  location: deliveryStoreSelectors.getLocation(state),
  stores: deliveryStoreSelectors.getUniqloStores(state),
  isPaymentStore: deliveryStoreSelectors.checkIfPaymentStore(state),
  total: deliveryStoreSelectors.getStoreCount(state),
  searchQuery: deliveryStoreSelectors.getSearchQuery(state),
  stateCode: deliveryStoreSelectors.getStateCode(state),
  plannedDateTime: getStorePickupDeliveryDate(state),
  markers: deliveryStoreSelectors.getStoreMarkers(state, props),
  prefectureAvaliable: deliveryStoreSelectors.getPrefectureAvaliable(state),
  prefecture: deliveryStoreSelectors.getPrefecture(state),
  gpsAvailable: deliveryStoreSelectors.isGpsAvailable(state),
  resetFilter: deliveryStoreSelectors.getResetStatus(state),
  brand: getCurrentBrand(state),
}),
  {
    onFilterStores: loadStoresByFilter,
    loadMoreStores,
    setLocationView,
  }
)

export default class StoresLocation extends Component {
  static propTypes = {
    autocomplete: array,
    errorMessages: object,
    onFilterStores: func,
    loadMoreStores: func,
    location: object,
    onSearch: func,
    setLocationView: func,
    selectStore: func,
    stores: array,
    total: number,
    selectedStore: object,
    setPickupStore: func,
    stateCode: string,
    isPaymentStore: bool,
    plannedDateTime: string,
    prefectureAvaliable: oneOfType([bool, object]),
    prefecture: string,
    searchQuery: string,
    markers: array,
    gpsAvailable: bool,
    resetFilter: bool,
    brand: string,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    /**
     * Keep track of the current filter selection
     **/
    filters: null,
  };

  componentWillReceiveProps({ resetFilter: nextReset }) {
    const { resetFilter } = this.props;

    if (nextReset !== resetFilter && nextReset) {
      this.setState({ filters: {} });
    }
  }

  onToggleFilter = filters =>
    this.setState({ filters });

  onLoadMoreStores = () => {
    const { stateCode } = this.props;
    const { filters } = this.state;

    this.props.loadMoreStores({
      code: stateCode,
      filters,
    });
  };

  onSetLocationView = () => {
    this.props.setLocationView('states');
  };

  getMapCenter = () => {
    const { prefectureAvaliable, markers, location, selectedStore, searchQuery } = this.props;
    const filters = this.state.filters || {};

    let mapCenter;

    if ((prefectureAvaliable || Object.keys(filters).length || searchQuery) && markers.length && !selectedStore) {
      const { minLat, maxLat, minLong, maxLong } = getMaxAndMinLatLong(markers);
      const avgLat = (maxLat + minLat) / 2;
      const avgLong = (maxLong + minLong) / 2;

      mapCenter = { lat: avgLat, long: avgLong };
    } else if (selectedStore && markers.length) {
      mapCenter = { lat: getFloat(markers[0].lat), long: getFloat(markers[0].long) };
    } else if (location && location.lat && location.long) {
      if (markers.length) {
        const nearestStore = markers.sort((store1, store2) => store1.distance - store2.distance)[0];

        mapCenter = { lat: getFloat(nearestStore.lat), long: getFloat(nearestStore.long) };
      } else {
        mapCenter = location;
      }
    }

    return mapCenter;
  }

  setZoomLevel = () => {
    const { prefectureAvaliable, markers, selectedStore, searchQuery } = this.props;
    const filters = this.state.filters || {};
    let zoomLevel;

    if ((prefectureAvaliable || Object.keys(filters).length || searchQuery) && markers.length && !selectedStore) {
      const { minLat, maxLat, minLong, maxLong } = getMaxAndMinLatLong(markers);

      zoomLevel = calculateZoomLevel(maxLat, minLat, maxLong, minLong);
    } else {
      zoomLevel = storeMap.defaultZoom;
    }

    return zoomLevel;
  }

  selectStoreFromList = (state) => {
    this.props.selectStore(state);
  }

  updateStore = (state) => {
    const selectedStoreId = this.props.selectedStore ? this.props.selectedStore.id : '';

    if (state.id !== selectedStoreId) {
      this.selectStoreFromList(state);
    }
  }

  render() {
    const {
      autocomplete,
      errorMessages,
      total,
      onFilterStores,
      onSearch,
      plannedDateTime,
      selectStore,
      selectedStore,
      setPickupStore,
      stores,
      markers,
      prefecture,
      prefectureAvaliable,
      location,
      gpsAvailable,
      isPaymentStore,
      resetFilter,
      brand,
    } = this.props;
    const { deliveryStore } = this.context.i18n;
    const userLocation = location || {};
    const mapMarkers = markers || [];

    return (
      <div className={styles.storesLocation}>
        <If
          if={!selectedStore}
          then={SearchByPrefecture}
          onSetLocationView={this.onSetLocationView}
          prefecture={prefecture}
          prefectureAvaliable={prefectureAvaliable}
        />
        <div className={styles.mapContainer}>
          <If
            if={!selectedStore}
            then={AutoCompleteBox}
            autocomplete={autocomplete}
            hintText={deliveryStore.searchHint}
            onSearch={onSearch}
          />
          <If
            if={Object.keys(userLocation).length}
            then={Map}
            location={userLocation}
            markers={mapMarkers}
            center={this.getMapCenter()}
            brand={brand}
            zoom={this.setZoomLevel()}
            showLocation={gpsAvailable}
            onMarkerClick={this.updateStore}
          />
        </div>
        <If
          if={!selectedStore}
          then={Filters}
          filters={this.state.filters}
          onFilter={onFilterStores}
          onToggleFilter={this.onToggleFilter}
          {...{ total, brand, isPaymentStore, resetFilter }}
        />
        <If
          if={!selectedStore}
          then={ResultList}
          items={stores}
          onLoadMore={this.onLoadMoreStores}
          onSelect={this.selectStoreFromList}
          total={total}
          variation="storeLocator"
        />
        <If
          if={selectedStore}
          then={Confirmation}
          {...{ errorMessages, plannedDateTime, selectStore, setPickupStore, brand }}
          isPaymentPage={isPaymentStore}
          store={selectedStore}
        />
      </div>
    );
  }
}
