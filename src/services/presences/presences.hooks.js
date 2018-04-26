const { authenticate } = require('feathers-authentication').hooks
const resolveUser = require('../../hooks/resolve_user')

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt'),
      resolveUser()
    ],
    get: [],
    create: [],
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
