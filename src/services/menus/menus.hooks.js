const { authenticate } = require('@feathersjs/authentication').hooks
const menusHook = require('../../hooks/menus_service')

module.exports = {
  before: {
    all: [],
    find: [ menusHook.paginationBefore ],
    get: [],
    create: [ menusHook.generateOrder ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ menusHook.paginationAfter ],
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
