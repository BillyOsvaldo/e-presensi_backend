const feathers = require('@feathersjs/feathers')
const rest = require('@feathersjs/rest-client')
const fetch = require('node-fetch')

const getClientPresensi = function() {
  var client = feathers()
  const restUrl = 'http://localhost:3031'
  const restClient = rest(restUrl)
  client.configure(restClient.fetch(fetch))
  return client
}

const getClientEakun = function() {
  var client = feathers()
  const restUrl = 'http://localhost:3030'
  const restClient = rest(restUrl)
  client.configure(restClient.fetch(fetch))
  return client
}

module.exports.clientPresensi = getClientPresensi()
module.exports.clientEakun = getClientEakun()
