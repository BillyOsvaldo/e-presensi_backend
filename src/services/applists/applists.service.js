// Initializes the `applists` service on path `/applists`
const createService = require('./applists.class.js');
const hooks = require('./applists.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'applists',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/applists', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('applists');

  service.hooks(hooks);
};
