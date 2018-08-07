const assert = require('assert');
const app = require('../../../src/app');

describe('\'presences-today-summary\' service', () => {
  it('registered the service', () => {
    const service = app.service('presencestodaysummary');

    assert.ok(service, 'Registered the service');
  });
});
