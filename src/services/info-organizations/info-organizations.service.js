// Initializes the `info-organizations` service on path `/info-organizations`
const createService = require('./info-organizations.class.js');
const hooks = require('./info-organizations.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/infoorganizations', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('infoorganizations');

  service.hooks(hooks);
};
