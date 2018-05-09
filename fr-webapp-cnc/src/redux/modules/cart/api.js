import config from 'config';
import { cartApi, apiTypes } from 'config/api';

const { cookies } = config.app;
const errorHandler = { showMessage: true, enableReaction: true, apiType: apiTypes.GDS };
const promiseConfig = {
  host: cartApi.host,
  credentials: 'include',
  headers: {
    'Content-Type': 'text/plain',
  },
};

const updateConfig = {
  ...promiseConfig,
  host: cartApi.hostForUpdate,
};

const removeConfig = {
  ...promiseConfig,
  host: cartApi.hostForRemove,
};

export {
  cookies,
  errorHandler,
  promiseConfig,
  updateConfig,
  removeConfig,
};
