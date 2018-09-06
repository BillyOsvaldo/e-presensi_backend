// Initializes the `presences` service on path `/presences`
const createService = require('feathers-mongoose');
const createModel = require('../../models/presences.model');
const hooks = require('./presences.hooks');
const request = require('sync-request')
const config = require('../../../config/default')

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const getDocsOrganizations = () => {
    const docsOrganizationsStr = request('GET',
      config.eakun.host + '/organizations?$select[]=$_id&$nopaginate=true',
      { headers: { 'x-api-key': config.api_key } }
    )
    const docs = JSON.parse(docsOrganizationsStr.body.toString())
    return docs
  }

  const getEvents = (docsOrganizations) => {
    const eventsNamePresences = docsOrganizations.data.map(doc => 'organization_' + doc._id.toString())
    const eventsNameTepatWaktu = docsOrganizations.data.map(doc => 'organization_' + doc._id.toString() + '_tepat_waktu')
    const eventsNameTerlambat = docsOrganizations.data.map(doc => 'organization_' + doc._id.toString() + '_terlambat')
    return [ ...eventsNamePresences, ...eventsNameTepatWaktu, ...eventsNameTerlambat, 'tepat_waktu', 'terlambat' ]
  }

  const docsOrganizations = getDocsOrganizations()
  const events = getEvents(docsOrganizations)

  const options = {
    name: 'presences',
    Model,
    paginate,
    events: events
  };

  // Initialize our service with any options it requires
  app.use('/presences', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('presences');

  service.hooks(hooks);
};
