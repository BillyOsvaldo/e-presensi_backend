// Application hooks that run for every service
const logger = require('./hooks/logger');
const setClient = require('./hooks/client')
const removeUnusedHeaders = require('./hooks/remove_unused_headers')

module.exports = {
  before: {
    all: [
      setClient,
      removeUnusedHeaders
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [  ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [  ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
