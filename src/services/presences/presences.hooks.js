const { authenticate } = require('feathers-authentication').hooks
const resolvePresenceData = require('../../hooks/resolve_presence_data')
const checkIfExist = require('../../hooks/check_presences')
const emitEvent = require('../../hooks/emit_create_presence')

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt')
    ],
    get: [],
    create: [ resolvePresenceData, checkIfExist ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ emitEvent ],
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
