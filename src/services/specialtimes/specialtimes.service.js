// Initializes the `specialtimes` service on path `/specialtimes`
const createService = require('feathers-mongoose');
const createModel = require('../../models/specialtimes.model');
const hooks = require('./specialtimes.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/specialtimes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('specialtimes');

  service.hooks(hooks);
};
