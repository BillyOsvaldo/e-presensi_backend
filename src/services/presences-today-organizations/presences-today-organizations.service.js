// Initializes the `presences-today-organizations` service on path `/presences-today-organizations`
const createService = require('./presences-today-organizations.class.js');
const hooks = require('./presences-today-organizations.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/presencestodayorganizations', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('presencestodayorganizations');

  service.hooks(hooks);
};
