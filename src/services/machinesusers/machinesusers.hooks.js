const addTransactionAdd = require('../../hooks/add_transaction_add')
const addTransactionRemove = require('../../hooks/add_transaction_remove')
const autoAddMachineField = require('../../hooks/auto_add_machine_field')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ autoAddMachineField.create ],
    update: [],
    patch: [],
    remove: [ autoAddMachineField.remove ]
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
