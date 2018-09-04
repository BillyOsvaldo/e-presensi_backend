const machinesUsersFastJoin = require('../../hooks/fastjoin/machinesusers')

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
    find: [
      machinesUsersFastJoin.machine,
      machinesUsersFastJoin.fingersusers
    ],
    get: [
      machinesUsersFastJoin.machine,
      machinesUsersFastJoin.fingersusers
    ],
    create: [
      machinesUsersFastJoin.machine,
      machinesUsersFastJoin.fingersusers
    ],
    update: [],
    patch: [
      machinesUsersFastJoin.machine,
      machinesUsersFastJoin.fingersusers
    ],
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
