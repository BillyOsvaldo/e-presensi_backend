// Initializes the `workdaysmanagement` service on path `/workdaysmanagement`
const createService = require('./workdaysmanagement.class.js');
const hooks = require('./workdaysmanagement.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workdaysmanagement', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('workdaysmanagement');

  service.hooks(hooks);
};
