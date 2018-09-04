const { authenticate } = require('feathers-authentication').hooks
const resolvePresenceData = require('../../hooks/resolve_presence_data')
const { setModeManual } = require('../../hooks/presences')
const emitCreatePresenceEvent = require('../../hooks/emit_create_presence_event')
const permissions = require('../../hooks/permissions')
const resolveUser = require('../../hooks/resolve_user')

module.exports = {
  before: {
    all: [ permissions.apiOrJWT ],
    find: [
      authenticate('jwt')
    ],
    get: [],
    create: [
      resolvePresenceData,
      setModeManual,
      resolveUser
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
