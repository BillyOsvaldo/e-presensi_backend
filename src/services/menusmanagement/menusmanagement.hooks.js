const menusFastJoin = require('../../hooks/fastjoin/menus')

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
    find: [ menusFastJoin.permissions, menusFastJoin.roles ],
    get: [ menusFastJoin.permissions, menusFastJoin.roles ],
    create: [ menusFastJoin.permissions, menusFastJoin.roles ],
    update: [],
    patch: [ menusFastJoin.permissions, menusFastJoin.roles ],
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
