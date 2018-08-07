const assert = require('assert');
const app = require('../../../src/app');

describe('\'find-users-by-organization\' service', () => {
  it('registered the service', () => {
    const service = app.service('findusersbyorganization');

    assert.ok(service, 'Registered the service');
  });
});
