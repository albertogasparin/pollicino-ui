/* eslint-env mocha */

import td from 'testdouble';

/**
 * Global mocks
 */

function setGlobalMocks () {
  // define window
  global.window = {};
  // define document
  global.document = global.window.document = {
    addEventListener: td.func('addEventListener'),
    removeEventListener: td.func('removeEventListener'),
  };
}

/**
 * Global reset/restore
 */

setGlobalMocks();

beforeEach(() => {
  setGlobalMocks();
});

afterEach(() => {
  td.reset();
});
