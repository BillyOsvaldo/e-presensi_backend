const moment = require('moment-timezone')
const objectid = require('objectid')
const getTimeInTimeOut = require('../../helpers/get_time_in_time_out')

moment.tz.setDefault('Asia/Jakarta')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  /*
    @provide params.organization
    @request
      {
        organization: objectid
      }
  */
  async find (params) {
    const { timeIn, timeOut } = await getTimeInTimeOut(this)
    const configTimeIn = timeIn
    const configTimeOut = timeOut

    const Presences = this.app.service('presences').Model
    const Absences = this.app.service('absences').Model
    const AbsencesTypes = this.app.service('absencestypes').Model

    const getWhere = () => {
      var where
      if(params.query.organization)
        where = { 'user.organizationuser.organization._id': objectid(params.query.organization) }
      else
        where = {}

      return where
    }

    const getCountUsers = async () => {
      const MachinesUsers = this.app.service('machinesusers').Model
      const count = await MachinesUsers.count(getWhere())
      return count
    }

    const getCountTepatWaktu = async () => {
      const currentDate = moment().format('YYYY-MM-DD')
      const dateTimeStart = new Date(currentDate + ' 04:00')
      const dateTimeEnd = new Date(currentDate + ' ' + configTimeIn)

      var query = {
        ...getWhere(),
        mode: 1,
        status: true,
        time: {
          $gt: dateTimeStart,
          $lte: dateTimeEnd
        }
      }

      return await Presences.count(query)
    }

    const getCountTerlambat = async () => {
      const currentDate = moment().format('YYYY-MM-DD')
      const dateTimeStart = new Date(currentDate + ' ' + configTimeIn)
      const dateTimeEnd = new Date(currentDate + ' 23:59')

      const query = {
        ...getWhere(),
        mode: 1,
        status: true,
        time: {
          $gt: dateTimeStart,
          $lte: dateTimeEnd
        }
      }

      return await Presences.count(query)
    }

    const getKetidakhadiran = async () => {
      const absencestypes = this.app.service('absencestypes').Model

      const currentDate = moment().format('YYYY-MM-DD')
      const dateTimeStart = new Date(currentDate + ' 01:00')
      const dateTimeEnd = new Date(currentDate + ' 23:59')

      const docs = await absencestypes.find()
      const docs2 = JSON.parse(JSON.stringify(docs))
      for(let doc of docs2) {
        doc.slug = doc.name.toLowerCase().replace(' ', '_')
      }

      for(let doc of docs2) {
        let match = {
          absencestype: objectid(doc._id),
          $or: [
            {
              startDate: {
                $gt: dateTimeStart,
                $lte: dateTimeEnd
              }
            },
            {
              endDate: {
                $gt: dateTimeStart,
                $lte: dateTimeEnd
              }
            }
          ]
        }

        if(params.query.organization)
          match['user.organizationuser.organization._id'] = objectid(params.query.organization)

        let count = await Absences.count(match)
        doc.count = count
      }

      return docs2
    }

    const countUsers = await getCountUsers()
    const countTepatWaktu = await getCountTepatWaktu()
    const countTerlambat = await getCountTerlambat()

    const data = {
      _id: '5ae88e1f72f0bb58be83bdac',
      tepat_waktu: countTepatWaktu,
      terlambat: countTerlambat,
      total: countUsers
    }

    data.belum_datang = (data.total - countTepatWaktu - countTerlambat)

    for(let doc of await getKetidakhadiran()) {
      data[doc.slug] = doc.count
      data.belum_datang = data.belum_datang - doc.count
    }

    return {
      total: 1,
      limit: 1,
      skip: 0,
      data: [ data ]
    }
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
