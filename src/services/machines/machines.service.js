// Initializes the `machines` service on path `/machines`
const createService = require('feathers-mongoose');
const createModel = require('../../models/machines.model');
const hooks = require('./machines.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'machines',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/machines', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('machines');

  service.hooks(hooks);
};
