const assert = require('assert');
const app = require('../../src/app');

describe('\'presences-reports\' service', () => {
  it('registered the service', () => {
    const service = app.service('presencesreports');

    assert.ok(service, 'Registered the service');
  });
});
