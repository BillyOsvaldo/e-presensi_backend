const feathers = require('@feathersjs/feathers')
const rest = require('@feathersjs/rest-client')
const fetch = require('node-fetch')

module.exports = (context) => {
  var client = feathers()
  const eakunConfig = context.app.get('eakun')
  const restUrl = 'http://' + eakunConfig.host + ':' + eakunConfig.port
  const restClient = rest(restUrl)
  client.configure(restClient.fetch(fetch))
  context.params.client = client
}

module.exports.getClient = (app) => {
  var client = feathers()
  const eakunConfig = app.get('eakun')
  const restUrl = 'http://' + eakunConfig.host + ':' + eakunConfig.port
  const restClient = rest(restUrl)
  client.configure(restClient.fetch(fetch))
  return client
}
