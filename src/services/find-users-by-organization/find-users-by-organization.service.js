// Initializes the `find-users-by-organization` service on path `/findusersbyorganization`
const createService = require('./find-users-by-organization.class.js');
const hooks = require('./find-users-by-organization.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'find-users-by-organization',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/findusersbyorganization', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('findusersbyorganization');

  service.hooks(hooks);
};
