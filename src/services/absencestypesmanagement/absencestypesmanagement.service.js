const absencestypesmanagement = require('./absencestypesmanagement.class');
const hooks = require('./absencestypesmanagement.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/absencestypesmanagement', new absencestypesmanagement());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('absencestypesmanagement');

  service.hooks(hooks);
}
