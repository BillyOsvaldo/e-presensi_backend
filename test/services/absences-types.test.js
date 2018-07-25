const assert = require('assert');
const app = require('../../src/app');

describe('\'AbsencesTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('absences-types');

    assert.ok(service, 'Registered the service');
  });
});
