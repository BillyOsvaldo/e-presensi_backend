const menusmanagement = require('./menusmanagement.class');
const hooks = require('./menusmanagement.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/menusmanagement', new menusmanagement());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('menusmanagement');

  service.hooks(hooks);
}
