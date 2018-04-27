// Initializes the `presences-reports` service on path `/presencesreports`
const createService = require('./presences-reports.class.js');
const hooks = require('./presences-reports.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'presences-reports',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/presencesreports', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('presencesreports');

  service.hooks(hooks);
};
