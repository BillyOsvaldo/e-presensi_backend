const workDaysHook = require('../../hooks/workdays_service')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      workDaysHook.fillEndDate
      // TODO: add validate organization. throw error if organization is not found
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
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
