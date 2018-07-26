// Initializes the `timesmanagement` service on path `/timesmanagement`
const createService = require('feathers-mongoose');
const createModel = require('../../models/timesmanagement.model');
const hooks = require('./timesmanagement.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'timesmanagement',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/timesmanagement', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('timesmanagement');

  service.hooks(hooks);
};
