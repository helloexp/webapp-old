/**
* Function to serialize list of API calls which may
* or maynot need data from previious call
* @param {Array} arr - array of arguments to be passed to iterator
* @param {Promise} iterator - promise to be executed with each argument.
*/

export default function serializePromises(arr, iterator) {
  const resultsArr = [];

  return arr.reduce(
   (promises, item) => (
      promises
      .then((res) => {
        resultsArr.push(res);

        return iterator(item);
      })
   ),
    Promise.resolve()
  ).then((lastRes) => {
    resultsArr.shift();
    resultsArr.push(lastRes);

    return Promise.all(resultsArr);
  });
}
