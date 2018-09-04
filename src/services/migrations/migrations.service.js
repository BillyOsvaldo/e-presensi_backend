// Initializes the `migrations` service on path `/migrations`
const createService = require('./migrations.class.js');
const hooks = require('./migrations.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/migrations', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('migrations');

  service.hooks(hooks);
};
