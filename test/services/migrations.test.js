const assert = require('assert');
const app = require('../../src/app');

describe('\'migrations\' service', () => {
  it('registered the service', () => {
    const service = app.service('migrations');

    assert.ok(service, 'Registered the service');
  });
});
