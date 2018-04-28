const usersselect = require('./usersselect.class');
const hooks = require('./usersselect.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/usersselect', new usersselect());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('usersselect');

  service.hooks(hooks);
}
