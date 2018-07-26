const organizationsselect = require('./organizationsselect.class');
const hooks = require('./organizationsselect.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/organizationsselect', new organizationsselect());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('organizationsselect');

  service.hooks(hooks);
}
