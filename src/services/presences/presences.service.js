// Initializes the `presences` service on path `/presences`
const createService = require('feathers-mongoose');
const createModel = require('../../models/presences.model');
const hooks = require('./presences.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'presences',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/presences', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('presences');

  service.hooks(hooks);
};
