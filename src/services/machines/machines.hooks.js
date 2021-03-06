const permissions = require('../../hooks/permissions')
const updateMachineIsMatch = require('../../hooks/update_machine_is_match')

module.exports = {
  before: {
    all: [ permissions.apiOrJWT ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [ updateMachineIsMatch ],
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