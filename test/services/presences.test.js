const assert = require('assert');
const app = require('../../src/app');

describe('\'presences\' service', () => {
  it('registered the service', () => {
    const service = app.service('presences');

    assert.ok(service, 'Registered the service');
  });
});
