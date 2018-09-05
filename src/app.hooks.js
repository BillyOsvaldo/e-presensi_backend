// Application hooks that run for every service
const logger = require('./hooks/logger');
const setClient = require('./hooks/client')
const removeUnusedHeaders = require('./hooks/remove_unused_headers')
const noPaginateHandler = require('./hooks/no_paginate_handler')
const { disablePagination } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [
      setClient,
      removeUnusedHeaders
    ],
    find: [
      noPaginateHandler,
      disablePagination()
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
