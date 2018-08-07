const assert = require('assert');
const app = require('../../../src/app');

describe('\'fingers-users-management\' service', () => {
  it('registered the service', () => {
    const service = app.service('fingersusersmanagement');

    assert.ok(service, 'Registered the service');
  });
});
