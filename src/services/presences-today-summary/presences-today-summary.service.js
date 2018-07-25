// Initializes the `presences-today-summary` service on path `/presencestodaysummary`
const createService = require('./presences-today-summary.class.js');
const hooks = require('./presences-today-summary.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'presences-today-summary',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/presencestodaysummary', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('presencestodaysummary');

  service.hooks(hooks);
};
