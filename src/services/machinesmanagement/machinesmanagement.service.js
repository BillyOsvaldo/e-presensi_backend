const machinesmanagement = require('./machinesmanagement.class');
const hooks = require('./machinesmanagement.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/machinesmanagement', new machinesmanagement());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('machinesmanagement');

  service.hooks(hooks);
}
