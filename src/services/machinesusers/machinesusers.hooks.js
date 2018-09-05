const addTransactionAdd = require('../../hooks/add_transaction_add')
const addTransactionRemove = require('../../hooks/add_transaction_remove')
const autoAddMachineField = require('../../hooks/auto_add_machine_field')
const permissions = require('../../hooks/permissions')
const resolveUser = require('../../hooks/resolve_user')
const machinesUsers = require('../../hooks/machines_users')

module.exports = {
  before: {
    all: [ permissions.apiOrJWT ],
    find: [],
    get: [],
    create: [
      autoAddMachineField.create,
      resolveUser,
      machinesUsers.ignoreIfExistWhenAdd
    ],
    update: [],
    patch: [],
    remove: [
      autoAddMachineField.remove
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ addTransactionAdd ],
    update: [],
    patch: [],
    remove: [ addTransactionRemove ]
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
