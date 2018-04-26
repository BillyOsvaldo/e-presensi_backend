const absencesmanagement = require('./absencesmanagement.class');
const hooks = require('./absencesmanagement.hooks');

module.exports = function () {
  const app = this;

  app.disable('etag');
  app.use('/absencesmanagement', new absencesmanagement());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('absencesmanagement');

  service.hooks(hooks);
}
