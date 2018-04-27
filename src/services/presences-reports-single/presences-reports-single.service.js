// Initializes the `presences-reports-single` service on path `/presencesreportssingle`
const createService = require('./presences-reports-single.class.js');
const hooks = require('./presences-reports-single.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'presences-reports-single',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/presencesreportssingle', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('presencesreportssingle');

  service.hooks(hooks);
};
