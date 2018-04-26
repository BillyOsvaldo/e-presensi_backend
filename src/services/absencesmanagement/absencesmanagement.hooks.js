const absencesFastJoin = require('../../hooks/fastjoin/absences')

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
      absencesFastJoin.user,
      absencesFastJoin.absencestype
    ],
    get: [
      absencesFastJoin.user,
      absencesFastJoin.absencestype
    ],
    create: [
      absencesFastJoin.user,
      absencesFastJoin.absencestype
    ],
    update: [],
    patch: [
      absencesFastJoin.user,
      absencesFastJoin.absencestype
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
