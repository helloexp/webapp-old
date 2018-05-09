import React, { PropTypes } from 'react';
import GoogleMap from 'google-map-react';
import noop from 'utils/noop';
import If from 'components/uniqlo-ui/If';
import Image from 'components/uniqlo-ui/Image';
import constants from 'config/site/default';
import styles from './styles.scss';

const locationIcon = require('theme/images/location-marker.png');
const uniqloIcon = require('theme/images/uniqlo-marker.png');
const guIcon = require('theme/images/gu-marker.png');

const mapMarker = {
  uq: uniqloIcon,
  gu: guIcon,
};
const mapAuthentication = {};

if (constants.GOOGLE_MAP_API_PROD) {
  mapAuthentication.client = constants.GOOGLE_MAP_API_CLIENT;
  mapAuthentication.channel = constants.GOOGLE_MAP_API_CHANNEL;
} else {
  mapAuthentication.key = constants.GOOGLE_MAP_API_KEY;
}

const Map = ({ zoom = 13, location = {}, markers = [], onMarkerClick = noop, center = {}, showLocation, brand }) => {
  const markersElements = markers.map((marker, index) =>
    <Image
      className={styles.uniqloMarker}
      key={index}
      lat={marker.lat}
      lng={marker.long}
      onClick={() => onMarkerClick(marker)}
      source={mapMarker[brand]}
      fireClickOnTouchEnd
      preventMultipleClicks
    />
  );

  return (
    <GoogleMap
      bootstrapURLKeys={{
        ...mapAuthentication,
        libraries: 'geometry,places,visualization',
        sensor: true,
        v: constants.GOOGLE_MAP_API_VERSION,
      }}
      options={{ fullscreenControl: false }}
      center={{ lat: center.lat, lng: center.long }}
      zoom={zoom}
    >
      <If
        if={showLocation}
        then={Image}
        className={styles.currentLocation}
        lat={location.lat}
        lng={location.long}
        source={locationIcon}
      />
      {markersElements}
    </GoogleMap>
  );
};

const { func, object, number, array, bool, string } = PropTypes;

Map.propTypes = {
  center: object,
  location: object,
  markers: array,
  onMapClick: func,
  onMarkerClick: func,
  zoom: number,
  showLocation: bool,
  brand: string,
};

export default Map;
