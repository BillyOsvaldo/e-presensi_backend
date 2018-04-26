const assert = require('assert');
const app = require('../../src/app');

describe('\'Absences\' service', () => {
  it('registered the service', () => {
    const service = app.service('absences');

    assert.ok(service, 'Registered the service');
  });
});
