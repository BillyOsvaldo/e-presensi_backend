const assert = require('assert');
const app = require('../../src/app');

describe('\'info-organizations\' service', () => {
  it('registered the service', () => {
    const service = app.service('info-organizations');

    assert.ok(service, 'Registered the service');
  });
});
