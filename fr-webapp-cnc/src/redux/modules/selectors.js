import { createSelector } from 'reselect';
import constants from 'config/site/default';

const { uq } = constants.brandName;

/**
 * Returns current location pathname
 * @param {Object} state - redux global state
 * @returns {string}
 */
export const getRoutingPathName = state => state.routing.locationBeforeTransitions.pathname;

/**
 * Returns current search
 * @param {Object} state - redux global state
 * @returns {String}
 */
export const getRoutingSearch = state => state.routing.locationBeforeTransitions.search;

/**
 * Returns current query params
 * @param {Object} state - redux global state
 * @returns {Object}
 */
export const getRoutingQuery = state => state.routing.locationBeforeTransitions.query;

/**
 * Get default brand, based on the URL query params
 * @param {Object} state - redux global state
 * @returns {String} brand - The current brand
 */
export const getBrandFromQuery = createSelector(
  [getRoutingQuery],
  query => query.brand || uq
);
