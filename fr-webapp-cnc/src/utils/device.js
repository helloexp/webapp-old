import isObject from './isObject';

// Device
//   Small - <= 320
//   Medium - 321 - 375
//   Large - > 375
let size = {
  small: 320,
  large: 375,
};

// Provide only small and large size for setting device size
function setDeviceSize(deviceSize) {
  if (isObject(deviceSize)) {
    size = { ...size, ...deviceSize };
  }
}

function getDeviceSize() {
  const width = window.innerWidth || screen.width;

  if (width <= size.small) {
    return 'small';
  } else if (width > size.large) {
    return 'large';
  }

  return 'medium';
}

const device = {
  getDeviceSize,
  setDeviceSize,
};

export default device;
