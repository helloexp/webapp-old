import { paymentApi } from 'config/api';

/**
 *  This middleware creates a form on the dom and then
 *  automatically submit it to bluegate server.
 **/

function createHiddenField(name, value) {
  const field = document.createElement('input');

  field.type = 'hidden';
  field.name = name;
  field.value = value;

  return field;
}

export function blueGateMiddleware(client) {
  return ({ dispatch, getState }) => next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const request = client.getRequest();
    const { bluegate } = action;

    // This middleware should never be executed on server side
    // only on clientside.
    if (request || !bluegate) {
      return next(action);
    }

    if (document) {
      const parent = document.body;
      const blueGateForm = document.createElement('form');

      blueGateForm.method = 'POST';
      blueGateForm.action = paymentApi.blueGateEndpoint;

      Object.keys(bluegate).forEach((field) => {
        const input = createHiddenField(field, bluegate[field]);

        blueGateForm.appendChild(input);
      });
      parent.appendChild(blueGateForm);

      blueGateForm.submit();
      parent.removeChild(blueGateForm);
    }

    return next(action);
  };
}
