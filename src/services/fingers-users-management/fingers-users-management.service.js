// Initializes the `fingers-users-management` service on path `/fingersusersmanagement`
const createService = require('./fingers-users-management.class.js');
const hooks = require('./fingers-users-management.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'fingers-users-management',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/fingersusersmanagement', new createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('fingersusersmanagement');

  service.hooks(hooks);
};
