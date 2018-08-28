const assert = require('assert');
const app = require('../../src/app');

describe('\'workdaysmanagement\' service', () => {
  it('registered the service', () => {
    const service = app.service('workdaysmanagement');

    assert.ok(service, 'Registered the service');
  });
});
