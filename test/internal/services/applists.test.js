const assert = require('assert');
const app = require('../../../src/app');

describe('\'applists\' service', () => {
  it('registered the service', () => {
    const service = app.service('applists');

    assert.ok(service, 'Registered the service');
  });
});
