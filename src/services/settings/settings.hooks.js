const moment = require('moment-timezone')
const permissions = require('../../hooks/permissions')

moment.tz.setDefault('Asia/Jakarta')

const min7hours = (context) => {
  const name = context.data.name
  if(name != 'Jam Masuk' && name != 'Jam Keluar') return

  const val = context.data.value // e.g 07.30
  const dateMoment = moment().format('YYYY-MM-DD')
  const dateTimeMoment = moment(dateMoment + ' ' + val)
  dateTimeMoment.subtract({ hours: 7 })

  context.data.value = dateTimeMoment.format('HH:mm')
}

module.exports = {
  before: {
    all: [ permissions.apiOrJWT ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [ min7hours ],
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
