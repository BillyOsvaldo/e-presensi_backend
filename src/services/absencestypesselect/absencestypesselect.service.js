// Initializes the `find-machines-users-by-organization` service on path `/findmachinesusersbyorganization`
const createService = require('./absencestypesselect.class.js');
const hooks = require('./absencestypesselect.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'absencestypesselect',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/absencestypesselect', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('absencestypesselect');

  service.hooks(hooks);
};
