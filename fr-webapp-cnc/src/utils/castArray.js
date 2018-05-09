/**
 * Make sure a refererence is an array
 * @param  {Any}  ref Any variable
 * @return {Array}    Reference as array
 */
export default function castArray(ref, filter) {
  const shouldFilter = filter !== undefined;

  if (ref === undefined || shouldFilter && castArray(filter).includes(ref)) {
    return [];
  }

  const cast = Array.isArray(ref) ? ref : [ref];

  return shouldFilter ? cast.filter(item => !filter.includes(item)) : cast;
}
