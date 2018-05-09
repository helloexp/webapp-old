const specContext = require.context('../src', true, /(.spec|-test).js$/);
specContext.keys().forEach(specContext);
