/**
 * Function execution buffering
 * @param  {Function} fn      Function to buffer
 * @param  {Number}   delay   Delay. Defaults to 250ms
 * @param  {Object}   context Context to run the function in
 * @return {Function}         Function to call instead of the original one
 */
export default function debounce(fn, delay, context) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(context, args), delay || 250);
  };
}
