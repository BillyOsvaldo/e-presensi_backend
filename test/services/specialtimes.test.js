const assert = require('assert');
const app = require('../../src/app');

describe('\'specialtimes\' service', () => {
  it('registered the service', () => {
    const service = app.service('specialtimes');

    assert.ok(service, 'Registered the service');
  });
});
