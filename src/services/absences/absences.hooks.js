const permissions = require('../../hooks/permissions')
const { authenticate } = require('@feathersjs/authentication').hooks;
const absencesFastJoin = require('../../hooks/fastjoin/absences')
const resolveUser = require('../../hooks/resolve_user')

module.exports = {
  before: {
    all: [ permissions.apiOrJWT ],
    find: [],
    get: [],
    create: [ resolveUser ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ absencesFastJoin.absencestype ],
    get: [ absencesFastJoin.absencestype ],
    create: [ absencesFastJoin.absencestype ],
    update: [],
    patch: [ absencesFastJoin.absencestype ],
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
