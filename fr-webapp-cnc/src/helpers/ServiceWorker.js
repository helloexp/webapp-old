import config from 'config';

const isClient = typeof window === 'object';
const hasNavigator = 'navigator' in window;
const supportsServiceWorker = isClient && hasNavigator && 'serviceWorker' in navigator;

if (supportsServiceWorker) {
  navigator.serviceWorker.register(`/${config.region}/sw.js`);
}
