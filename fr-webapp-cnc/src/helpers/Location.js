import constants from 'config/site/default';

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }, {
          timeout: constants.location.timeout,
        });
    } else {
      reject({ code: 'UNSUPPORTED', UNSUPPORTED: 'UNSUPPORTED' });
    }
  });
}
