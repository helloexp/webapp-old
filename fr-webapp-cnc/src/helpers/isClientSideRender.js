/* https://github.com/facebook/fbjs/blob/master/src/core/ExecutionEnvironment.js
 * The reference points to an undocumented feature and could go away at the worst moment */
export default !!(typeof window !== 'undefined' && window.document && window.document.createElement);
