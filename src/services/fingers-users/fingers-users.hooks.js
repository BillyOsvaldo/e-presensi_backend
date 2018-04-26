const addTransactionGetUserInfo = require('../../hooks/add_transaction_get_user_info')
const { updateIfExist } = require('../../hooks/fingers_users.service')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
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
