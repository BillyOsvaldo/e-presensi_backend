// Initializes the `presences-today` service on path `/presencestoday`
const createService = require('./presences-today.class.js');
const hooks = require('./presences-today.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'presences-today',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/presencestoday', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('presencestoday');

  service.hooks(hooks);
};
