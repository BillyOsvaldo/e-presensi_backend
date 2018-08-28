const assert = require('assert');
const app = require('../../src/app');

describe('\'workdays\' service', () => {
  it('registered the service', () => {
    const service = app.service('workdays');

    assert.ok(service, 'Registered the service');
  });
});
