// JSON parsing - response
function parseJSON(res) {
  if (res.status !== 200) {
    throw new Error('Invalid request.');
  }

  return res.json();
}

export function getApiDetail(queryData, successCallback, failureCallback, method) {
  const {
    queryParameter,
    productUrl,
  } = queryData;
  const query = queryParameter || '';
  const opts = {
    method: method || 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  if (query) {
    opts.body = JSON.stringify({ query });
  }

  fetch(productUrl, opts).then(parseJSON).then(successCallback).catch(err => failureCallback(err.status));
}
