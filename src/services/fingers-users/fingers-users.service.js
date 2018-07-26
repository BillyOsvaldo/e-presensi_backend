// Initializes the `fingers-users` service on path `/fingersusers`
const createService = require('feathers-mongoose');
const createModel = require('../../models/fingers-users.model');
const hooks = require('./fingers-users.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'fingersusers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/fingersusers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('fingersusers');

  service.hooks(hooks);
};
