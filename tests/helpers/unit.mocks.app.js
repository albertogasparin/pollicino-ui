/* eslint-env mocha */

import td from 'testdouble';

/**
 * Global mocks
 */

function setGlobalMocks() {
  // define window
  global.window = {};
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
