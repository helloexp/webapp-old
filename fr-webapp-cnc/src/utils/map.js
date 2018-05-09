import { storeMap } from 'config/site/default';

const { mapHeight, meanRadius, minZoom, zoomFactor } = storeMap;

/**
  * Calculate the great-circle distance (the shortest distance over the earth’s surface) between two points using Haversine formula
  * Haversine formula:
      a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
      c = 2 ⋅ atan2( √a, √(1−a) )
      d = R ⋅ c
    where	φ is latitude,
          λ is longitude,
          R is the mean radius of Earth (6371),
          a is the square of half the chord length between the points
          c is the angular distance in radians
  **/
function calculateHaversineDistance(lat1, lat2, lng1, lng2) {
  // Math functions
  const { PI, atan2, sin, cos, sqrt, pow } = Math;
  // convert degree to radian
  const [rlat1, rlat2, rlng1, rlng2] = [lat1, lat2, lng1, lng2].map(x => x / 180 * PI);

  const dLat = rlat1 - rlat2;
  const dLng = rlng1 - rlng2;

  const a = pow(sin(dLat / 2), 2) + pow(sin(dLng / 2), 2) * cos(lat1) * cos(lat2);
  const c = 2 * atan2(sqrt(a), sqrt(1 - a));

  return meanRadius * c;
}

/**
  * Calculate zoom level based on Haversine distance between two points
  * Formula:
      zoom = 7 - Math.log(1.6446 * dist / Math.sqrt(2 * (mapDimension * mapDimension))) / Math.log (2)
    where dist is the Haversine distance between the points
          1.6446 is the zoom factor
          mapDimension is the minimum of width and height of the map
  **/
export function calculateZoomLevel(maxLat, minLat, maxLng, minLng) {
  // Math functions
  const { floor, log, min, sqrt, pow } = Math;

  const mapWidth = window.innerWidth;
  const minMapDimension = min(mapWidth, mapHeight);
  const haversineDistance = calculateHaversineDistance(maxLat, minLat, maxLng, minLng);

  const zoomLevel = haversineDistance > 15
    ? floor(7 - log(zoomFactor * haversineDistance / sqrt(2 * pow(minMapDimension, 2))) / log(2))
    : minZoom;

  return zoomLevel;
}
