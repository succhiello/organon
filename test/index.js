jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

var testsContext = require.context('.', true, /_test$/);
testsContext.keys().forEach(testsContext);
