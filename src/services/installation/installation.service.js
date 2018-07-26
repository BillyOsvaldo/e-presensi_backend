// Initializes the `installation` service on path `/installation`
const createService = require('./installation.class.js');
const hooks = require('./installation.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/installation', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('installation');

  service.hooks(hooks);
};
