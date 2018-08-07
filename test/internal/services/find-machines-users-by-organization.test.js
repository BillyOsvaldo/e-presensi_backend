const assert = require('assert');
const app = require('../../../src/app');

describe('\'find-machines-users-by-organization\' service', () => {
  it('registered the service', () => {
    const service = app.service('findmachinesusersbyorganization');

    assert.ok(service, 'Registered the service');
  });
});
