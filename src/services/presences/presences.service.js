// Initializes the `presences` service on path `/presences`
const createService = require('feathers-mongoose');
const createModel = require('../../models/presences.model');
const hooks = require('./presences.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const client = require('../../hooks/client').getClient(app)
  const organizations = client.service('organizations')
  const params = { query: { $select: ['_id'], $nopaginate: true } }
  //const docs = ['59d82e333c526cb500b7bc1e', '5a9a06110a190f540b59c786', '5ab08b206611c4688fa3c1cb' ]//await organizations.find(params)
  //const eventsName = docs.map(doc => 'organization_' + doc._id.toString())
  // FIXME TODO
  const eventsName = ['organization_59d82e333c526cb500b7bc1e', 'organization_5a9a06110a190f540b59c786', 'organization_5ab08b206611c4688fa3c1cb' ]

  const options = {
    name: 'presences',
    Model,
    paginate,
    events: eventsName
  };

  // Initialize our service with any options it requires
  app.use('/presences', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('presences');

  service.hooks(hooks);
};
