const machinesUsersManagement = require('./machinesusersmanagement.class');
const hooks = require('./machinesusersmanagement.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/machinesusersmanagement', new machinesUsersManagement());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('machinesusersmanagement');

  service.hooks(hooks);
}
