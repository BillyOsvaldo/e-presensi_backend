// Initializes the `Absences` service on path `/absences`
const createService = require('feathers-mongoose');
const createModel = require('../../models/absences.model');
const hooks = require('./absences.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'absences',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/absences', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('absences');

  service.hooks(hooks);
};
