const { authenticate } = require('feathers-authentication').hooks
const resolvePresenceData = require('../../hooks/resolve_presence_data')
const { setMode } = require('../../hooks/presences')
const emitCreatePresenceEvent = require('../../hooks/emit_create_presence_event')
const permissions = require('../../hooks/permissions')

module.exports = {
  before: {
    all: [ permissions.apiOrJWT ],
    find: [
      authenticate('jwt')
    ],
    get: [],
    create: [
      resolvePresenceData,
      setMode
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ emitCreatePresenceEvent ],
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
