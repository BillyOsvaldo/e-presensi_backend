// Initializes the `AbsencesTypes` service on path `/absences-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/absences-types.model');
const hooks = require('./absences-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'absencestypes',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/absencestypes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('absencestypes');

  service.hooks(hooks);
};
