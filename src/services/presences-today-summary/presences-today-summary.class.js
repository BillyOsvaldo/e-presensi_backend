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

    const getDocsUsers = async () => {
      const MachinesUsers = this.app.service('machinesusers').Model
      const sort = { 'user.position.order': 1 }
      const where = { 'user.organizationuser.organization._id': objectid(params.query.organization) }
      const docsMachinesUsers = await MachinesUsers.find(where).sort(sort)
      const docsUsers = docsMachinesUsers.map(doc => doc.user)
      return docsUsers
    }

    const getCountTepatWaktu = async () => {
      const currentDate = moment().format('YYYY-MM-DD')
      const dateTimeStart = new Date(currentDate + ' 04:00')
      const dateTimeEnd = new Date(currentDate + ' ' + configTimeIn)

      const query = {
        'user.organizationuser.organization._id': objectid(params.query.organization),
        mode: 1,
        status: true,
        time: {
          $gt: dateTimeStart,
          $lte: dateTimeEnd
        }
      }

      return Presences.count(query)
    }

    const getCountTerlambat = async () => {
      const currentDate = moment().format('YYYY-MM-DD')
      const dateTimeStart = new Date(currentDate + ' ' + configTimeIn)
      const dateTimeEnd = new Date(currentDate + ' 23:59')

      const query = {
        'user.organizationuser.organization._id': objectid(params.query.organization),
        mode: 1,
        status: true,
        time: {
          $gt: dateTimeStart,
          $lte: dateTimeEnd
        }
      }

      return Presences.count(query)
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
          'user.organizationuser.organization._id': objectid(params.query.organization),
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

        let count = await Absences.count(match)
        doc.count = count
      }

      return docs2
    }

    const docsUsers = await getDocsUsers()
    const countUsers = docsUsers.length
    const countTepatWaktu = await getCountTepatWaktu()
    const countTerlambat = await getCountTerlambat()

    const data = {
      _id: '5ae88e1f72f0bb58be83bdac',
      tepat_waktu: countTepatWaktu,
      terlambat: countTerlambat,
      total: countUsers,
      percentage: {}
    }

    data.belumDatang = (data.total - countTepatWaktu - countTerlambat)

    for(let doc of await getKetidakhadiran()) {
      data[doc.slug] = doc.count
      data.belumDatang = data.belumDatang - doc.count
      data.percentage[doc.slug] = (doc.count / data.total * 100).toFixed(2) + '%'
    }

    data.percentage.tepat_waktu = (data.tepat_waktu / data.total * 100).toFixed(2) + '%'
    data.percentage.terlambat   = (data.terlambat / data.total * 100).toFixed(2) + '%'
    data.percentage.belumDatang = (data.belumDatang / data.total * 100).toFixed(2) + '%'

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
