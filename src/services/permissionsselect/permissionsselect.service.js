const permissionsselect = require('./permissionsselect.class');
const hooks = require('./permissionsselect.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/permissionsselect', new permissionsselect());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('permissionsselect');

  service.hooks(hooks);
}
