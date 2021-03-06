const permissions = require('../../hooks/permissions')
const autoUpdateMachinesUsersStatus = require('../../hooks/auto_update_status_machines_users')

module.exports = {
  before: {
    all: [ permissions.apiOrJWT ],
    find: [],
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
    patch: [ autoUpdateMachinesUsersStatus ],
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
