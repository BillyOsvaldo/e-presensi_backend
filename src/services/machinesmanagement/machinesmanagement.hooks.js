const machinesFastJoin = require('../../hooks/fastjoin/machines')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ machinesFastJoin.organization ],
    get: [ machinesFastJoin.organization ],
    create: [ machinesFastJoin.organization ],
    update: [],
    patch: [ machinesFastJoin.organization ],
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
