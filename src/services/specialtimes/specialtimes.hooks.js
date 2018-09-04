const permissions = require('../../hooks/permissions')
const specialTimesHook = require('../../hooks/specialtimes_service')
const resolveUser = require('../../hooks/resolve_user')

module.exports = {
  before: {
    all: [ permissions.apiOrJWT ],
    find: [],
    get: [],
    create: [ specialTimesHook.fillEndDate, resolveUser ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
