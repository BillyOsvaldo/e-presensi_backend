const usersauthentication = require('./usersauthentication.class');
const hooks = require('./usersauthentication.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/usersauthentication', new usersauthentication());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('usersauthentication');

  service.hooks(hooks);
}
