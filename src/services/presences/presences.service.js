// Initializes the `presences` service on path `/presences`
const createService = require('feathers-mongoose');
const createModel = require('../../models/presences.model');
const hooks = require('./presences.hooks');
const request = require('sync-request')
const config = require('../../../config/default')

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const client = require('../../hooks/client').getClient(app)
  const organizations = client.service('organizations')
  const params = { query: { $select: ['_id'], $nopaginate: true } }
  const docsOrganizatonsStr = request('GET', 'http://' + config.eakun.host + ':' + config.eakun.port + '/organizations?$select[]=$_id&$nopaginate=true')
  const docs = JSON.parse(docsOrganizatonsStr.body.toString())

  var eventsNamePresences = docs.map(doc => 'organization_' + doc._id.toString())
  var eventsNameTepatWaktu = docs.map(doc => 'organization_' + doc._id.toString() + '_tepat_waktu')
  var eventsNameTerlambat = docs.map(doc => 'organization_' + doc._id.toString() + '_terlambat')

  const options = {
    name: 'presences',
    Model,
    paginate,
    events: [ ...eventsNamePresences, ...eventsNameTepatWaktu, ...eventsNameTerlambat ]
  };

  // Initialize our service with any options it requires
  app.use('/presences', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('presences');

  service.hooks(hooks);
};
