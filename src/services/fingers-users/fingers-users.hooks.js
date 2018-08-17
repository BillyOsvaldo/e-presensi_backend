const permissions = require('../../hooks/permissions')
const addTransactionGetUserInfo = require('../../hooks/add_transaction_get_user_info')
const { updateIfExist } = require('../../hooks/fingers_users.service')
const replaceOnMachineIfIsAdmin = require('../../hooks/replace_on_machine_if_is_admin')

module.exports = {
  before: {
    all: [ permissions.apiOrJWT ],
    find: [],
    get: [],
    create: [
      replaceOnMachineIfIsAdmin,
      updateIfExist
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      //addTransactionGetUserInfo
    ],
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
