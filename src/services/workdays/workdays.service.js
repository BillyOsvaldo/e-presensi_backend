// Initializes the `workdays` service on path `/workdays`
const createService = require('feathers-mongoose');
const createModel = require('../../models/workdays.model');
const hooks = require('./workdays.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workdays', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('workdays');

  service.hooks(hooks);
};
