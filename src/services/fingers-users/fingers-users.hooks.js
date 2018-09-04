const permissions = require('../../hooks/permissions')
const { updateIfExist } = require('../../hooks/fingers_users.service')
const replaceOnMachineIfIsAdmin = require('../../hooks/replace_on_machine_if_is_admin')
const resolveUser = require('../../hooks/resolve_user')

module.exports = {
  before: {
    all: [ permissions.apiOrJWT ],
    find: [],
    get: [],
    create: [
      replaceOnMachineIfIsAdmin,
      updateIfExist,
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
