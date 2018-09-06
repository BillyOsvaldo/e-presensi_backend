const assert = require('assert');
const app = require('../../src/app');

describe('\'presences-today-organizations\' service', () => {
  it('registered the service', () => {
    const service = app.service('presences-today-organizations');

    assert.ok(service, 'Registered the service');
  });
});
