const assert = require('assert');
const app = require('../../src/app');

describe('\'machines-users\' service', () => {
  it('registered the service', () => {
    const service = app.service('machines-users');

    assert.ok(service, 'Registered the service');
  });
});
