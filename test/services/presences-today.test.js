const assert = require('assert');
const app = require('../../src/app');

describe('\'presences-today\' service', () => {
  it('registered the service', () => {
    const service = app.service('presencestoday');

    assert.ok(service, 'Registered the service');
  });
});
