import React, { PureComponent, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import logger from 'utils/logger';
import cloneObject from 'utils/cloneObject';

const { string } = PropTypes;

const defaultState = {
  toEval: [],
  toDownload: [],
};

/**
 * Get all scripts from a HTML string.
 * Separates src and inner content.
 * Src (e.g. address of jQuery) should be downloaded and executed as a script tag
 * Inner scripts should be evaluated and executed (e.g. <script>alert('foo');</script>)
 * @param  {String} html Raw HTML string
 * @return {Object}      JS to evaluate and JS to download and execute
 */
export function stripScripts(html) {
  const div = document.createElement('div');

  div.innerHTML = html;

  const scripts = div.getElementsByTagName('script');
  let idx = scripts.length;
  const result = cloneObject(defaultState);

  while (idx--) {
    const script = scripts[idx];

    if (script.src) {
      result.toDownload.push(script.src);
    } else {
      result.toEval.push(script.innerHTML);
    }
  }

  return result;
}

/**
 * Simply evaluate JS code
 * @param  {String} code JS code
 */
function evaluateInlineScript(code) {
  try {
    new Function(code)(); // eslint-disable-line no-new-func
  } catch (err) {
    logger.error('Failed evaluating code in HtmlComponent', code);
  }
}

/**
 * Keep a reference to a script tag that will be cloned for repeated
 * script tags. This will improve performance.
 */
let scriptTag;

/**
 * Keep track of loaded scripts.
 * Don't attempt additional loading of existing scirpts
 * @type {String[]}
 */
const loadedScripts = [];

/**
 * Load JS fromexternal URL
 * @param  {String}     src      URL
 * @param  {DomElement} targetEl Where to append the script tag
 */
function loadJavascript(src, targetEl) {
  if (loadedScripts.indexOf(src) > -1) {
    // script already loaded, skip
    return false;
  }

  if (!scriptTag) {
    scriptTag = document.createElement('script');
  }

  // cloning dom nodes is much faster than recreating.
  const newTag = scriptTag.cloneNode();

  newTag.src = src;

  targetEl.appendChild(newTag);

  return loadedScripts.push(src);
}

/**
 * Html component takes two properties:
 *   javascript - a string representing JS to evaluate after the component is mounted
 *   html - html code
 *
 * If script tags are found in HTML code, they will be extracted and excuted after
 * component is mounted
 */
export default class Html extends PureComponent {
  static propTypes = {
    javascript: string,
    html: string,
  };

  state = cloneObject(defaultState);

  componentWillMount() {
    const { html } = this.props;

    this.setState(stripScripts(html));
  }

  componentDidMount() {
    const { javascript } = this.props;
    const { toEval, toDownload } = this.state;
    const el = ReactDOM.findDOMNode(this);

    // evaluate JS
    evaluateInlineScript(javascript);

    // evaluate inline scripts
    toEval.forEach(evaluateInlineScript);

    // load external scripts
    toDownload.forEach(src => loadJavascript(src, el));
  }

  render() {
    const { html } = this.props;

    return <article className="htmlcmp" dangerouslySetInnerHTML={{ __html: html }} />; // eslint-disable-line react/no-danger
  }
}
