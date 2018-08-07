const assert = require('assert');
const app = require('../../../src/app');

describe('\'machines\' service', () => {
  it('registered the service', () => {
    const service = app.service('machines');

    assert.ok(service, 'Registered the service');
  });
});
