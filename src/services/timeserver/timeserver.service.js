// Initializes the `timeserver` service on path `/timeserver`
const createService = require('./timeserver.class.js');
const hooks = require('./timeserver.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'timeserver',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/timeserver', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('timeserver');

  service.hooks(hooks);
};
