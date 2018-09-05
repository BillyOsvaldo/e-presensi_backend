// Application hooks that run for every service
const logger = require('./hooks/logger');
const setClient = require('./hooks/client')
const removeUnusedHeaders = require('./hooks/remove_unused_headers')
const noPaginateHandler = require('./hooks/no_paginate_handler')

module.exports = {
  before: {
    all: [
      setClient,
      removeUnusedHeaders
    ],
    find: [
      noPaginateHandler,
    ],
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
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
