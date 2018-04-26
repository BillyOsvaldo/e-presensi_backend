const rolesselect = require('./rolesselect.class');
const hooks = require('./rolesselect.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/rolesselect', new rolesselect());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('rolesselect');

  service.hooks(hooks);
}
