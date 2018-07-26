const usersformachinesusers = require('./usersformachinesusers.class');
const hooks = require('./usersformachinesusers.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/usersformachinesusers', new usersformachinesusers());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('usersformachinesusers');

  service.hooks(hooks);
}
