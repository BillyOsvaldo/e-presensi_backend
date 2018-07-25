// Initializes the `find-machines-users-by-organization` service on path `/findmachinesusersbyorganization`
const createService = require('./find-machines-users-by-organization.class.js');
const hooks = require('./find-machines-users-by-organization.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'find-machines-users-by-organization',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/findmachinesusersbyorganization', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('findmachinesusersbyorganization');

  service.hooks(hooks);
};
