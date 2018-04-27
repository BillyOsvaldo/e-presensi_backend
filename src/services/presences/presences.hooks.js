const { authenticate } = require('feathers-authentication').hooks
const resolveUser = require('../../hooks/resolve_user')
const resolvePresenceData = require('../../hooks/resolve_presence_data')

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt'),
      resolveUser()
    ],
    get: [],
    create: [ resolvePresenceData ],
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
