const assert = require('assert');
const url = require('url');
const app = require('../../src/app');

const port = 4031;
const getUrl = pathname => url.format({
  hostname: 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Feathers application tests', () => {
  before(function(done) {
    this.server = app.listen(port);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

});
