import { combineReducers } from 'redux';
import coreReducers from './modules';

/**
 * Combines code reducers and async loaded reducers into a single
 * reducer function that can be passed to createStore
 *
 * @export
 * @param {Object} [asyncReducers={}] - async loaded reducer
 * @returns {Function} - single reducer
 */
export default function createReducer(asyncReducers = {}) {
  return combineReducers({
    ...coreReducers,
    ...asyncReducers,
  });
}
