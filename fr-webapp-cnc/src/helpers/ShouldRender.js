import React, { Component } from 'react';

/**
 * This is the default state
 * All other state config will be merged with this one
 * @type {Object}
 */
const initialState = {
  Header: true,
  Ticker: true,
  Hamburger: true,
};

/**
 * Shorthand rules for disabling header
 * @type {Object}
 */
const noHeader = {
  Header: false,
};

/**
 * Shorthand rules for disabling ticker
 * @type {Object}
 */
const noTicker = {
  Ticker: false,
};

/**
 * Shorthand rules for disabling all but header
 * @type {Object}
 */
const justHeader = {
  Ticker: false,
  Hamburger: false,
};

/**
 * Shorthand rules for disabling all but header and ticker
 * @type {Object}
 */
const headerAndTicker = {
  Hamburger: false,
};

/**
 * Shorthand rules for disabling all
 * @type {Object}
 */
const disableAll = {
  Header: false,
  Ticker: false,
  Hamburger: false,
};

// Bad practice, but works
export let currentState = {}; // eslint-disable-line import/no-mutable-exports
const updateRenderPreference = [];

/**
 * Route-based routes.
 * Each item is an object with two properties
 *   match: regexp to match against
 *   state: state to merge with the initial state
 * Only difference in state is needed. By defauly all Components should be true
 * so the state in this config only makes sense if it's false.
 * Used in @getRoutingRules.
 * @type {Object[]}
 */
const routingRules = [
  // Catalog PDP (should come above normal PDP rule)
  {
    match: /\/store\/goods\/[^/]+$/,
    queryMatch: /layout=/,
    state: disableAll,
  },
  // temp catalog PDP rule. This can be removed after PDP URL confirms to biz user specifications.
  {
    match: /\/store\/goods\/[^/]+$/,
    queryMatch: /variation=/,
    state: disableAll,
  },
  // L4:Product Page (and reviews)
  {
    match: /\/store\/goods\//,
    state: noHeader,
  },
  // L4:Find in store
  {
    match: /\/products\/findinstore\//,
    state: noHeader,
  },
  // Login page
  {
    match: /\/login$/,
    state: justHeader,
  },
  // Order confirmation. Needs to come before other checkout pages so it returns sooner
  {
    match: /\/order\/confirm$/,
    state: initialState,
  },
  // delivery
  {
    match: /\/checkout\/delivery\/?/,
    state: headerAndTicker,
  },
  // gifting
  {
    match: /\/checkout\/gifting\/?/,
    state: headerAndTicker,
  },
  // payment
  {
    match: /\/checkout\/payment\/?/,
    state: headerAndTicker,
  },
  // order review
  {
    match: /\/checkout\/order\/review\/?/,
    state: headerAndTicker,
  },
  // Most other checkout pages
  {
    match: /\/checkout/,
    state: justHeader,
  },
  // Coupon Wallet
  {
    match: /\/account\/coupon\/?/,
    state: headerAndTicker,
  },
  // Addressbook
  {
    match: /\/accounts\/address$/,
    state: noTicker,
  },
  // My size
  {
    match: /\/mysize\//,
    state: noTicker,
  },
  // Outfit view
  {
    match: /\/outfit\//,
    state: noHeader,
  },
];

/**
 * Merge all state objects together, starting from the initialState
 * and return the merged version
 * The outter currentState reference is updated.
 */
export function setState(append) {
  const args = [...arguments]; // eslint-disable-line prefer-rest-params
  const allState = append === true ?
    [{ ...currentState }, ...args.slice(1)] :
    [{ ...initialState }, ...args];

  currentState = Object.assign(...allState);

  return currentState;
}

/**
 * Regular expression to be used in @getQueryRules
 * camelCase string that starts with `no` will be matched
 * @type {RegExp}
 */
const noComponentRegex = /^no(\S.*)/;

/**
 * Calculate rules based on an object
 * The object with keys that start with `no` and continue with CamelCase will be parsed
 * e.g. noHeader means Header: false.
 * @param  {Object} query Object with keys
 * @return {Object}       State to merge with initial state
 */
function getQueryRules(query) {
  return Object.keys(query).reduce((state, param) => {
    const match = param.match(noComponentRegex);

    if (match) {
      const allow = [0, false, '0', 'false'].indexOf(query[param]) > -1;

      state[match[1]] = allow;
    }

    return state;
  }, {});
}

/**
 * Parse properties from the CMS and set rules accordingly
 * Triggers state change on shouldRender higher order to reflect preference changes.
 * Properties are same as queries so the functionality is reused
 * e.g. { noHeader: true }  will disable Header component
 * @param {[type]} properties [description]
 */
export function setPublicationRenderRules(properties) {
  setState(true, getQueryRules(properties));
  updateRenderPreference.forEach(callback => callback(currentState));
}

/**
 * Figure out routing rules based on route path
 * Cycle through routingRules and find the first avaialable match
 * @param  {String} route Route string
 * @param  {String} search Query string
 * @return {String}       State object based on the first available match
 */
function getRouteRules(route, search) {
  // either match only the route or match both route and query if item need a queryMatch as well
  const match = routingRules.find(item => route.match(item.match) && (!item.queryMatch || search.match(item.queryMatch)));

  return match ? match.state : {};
}

/**
 * Callback for the router that checks rules based on path and query params
 * and sets state accordingly
 * @param  {Object} nextState Next routing state from future Redux state tree
 */
export function parseRouteRenderRules(nextState) {
  const { query, pathname, search } = nextState.location || nextState.locationBeforeTransitions;
  const routeRules = getRouteRules(pathname, search);
  const queryRules = getQueryRules(query);

  setState(routeRules, queryRules);
}

/**
 * Should component render based on computed state rules?
 * Return true to render
 * If rules is explicitely false, it will send false.
 * @param  {String|Object} cmp Component instance of component name
 * @return {Boolean}             Return false if component shouldn’t render
 */
export function shouldRender(name) {
  return currentState[name] !== false;
}

/**
 * Render component if state allows
 * @param  {String}    cmpName   Name of component that matches state property
 * @param  {Component} Cmp       Component name or reference
 * @param  {Object}    props     props to pass
 * @return {Element}             React element
 */
export function maybeRender(cmpName, Cmp, props) {
  return shouldRender(cmpName) ? React.createElement(Cmp, props) : null;
}

/**
 * Decorator for components that should show/hide automatically
 * To handle cases where the state of components should change half way through page render,
 * each instance of this component adds a state update callback function to global "updateRenderPreference"
 * @param  {String} name Name of the component that matches state props
 * @return {Component}   HoC
 */
export default name =>
  OriginalComponent =>
    class withShouldRender extends Component {
      static displayName = OriginalComponent.displayName || OriginalComponent.name;

      componentWillMount() {
        this.callbackIndex = updateRenderPreference.length;
        updateRenderPreference.push((newState) => {
          this.setState({
            [name]: newState[name],
          });
        });
      }

      componentWillUnmount() {
        updateRenderPreference[this.callbackIndex] = () => {};
      }

      render() {
        return maybeRender(name, OriginalComponent, this.props);
      }
    };
