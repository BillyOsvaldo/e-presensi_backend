const assert = require('assert');
const app = require('../../src/app');

describe('\'fingers-users\' service', () => {
  it('registered the service', () => {
    const service = app.service('fingersusers');

    assert.ok(service, 'Registered the service');
  });
});
