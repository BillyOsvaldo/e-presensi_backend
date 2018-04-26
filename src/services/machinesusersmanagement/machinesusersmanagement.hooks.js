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
      machinesUsersFastJoin.fingersusers,
      machinesUsersFastJoin.user
    ],
    get: [
      machinesUsersFastJoin.machine,
      machinesUsersFastJoin.fingersusers,
      machinesUsersFastJoin.user
    ],
    create: [
      machinesUsersFastJoin.machine,
      machinesUsersFastJoin.fingersusers,
      machinesUsersFastJoin.user
    ],
    update: [],
    patch: [
      machinesUsersFastJoin.machine,
      machinesUsersFastJoin.fingersusers,
      machinesUsersFastJoin.user
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
