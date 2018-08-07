const assert = require('assert');
const app = require('../../../src/app');

describe('\'timesmanagement\' service', () => {
  it('registered the service', () => {
    const service = app.service('timesmanagement');

    assert.ok(service, 'Registered the service');
  });
});
