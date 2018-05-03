const moment = require('moment')
const objectid = require('objectid')

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
    const configTimeIn = this.app.get('time_in')
    const configTimeOut = this.app.get('time_out')

    const Presences = this.app.service('presences').Model
    const Absences = this.app.service('absences').Model
    const AbsencesTypes = this.app.service('absencestypes').Model

    const getDocsUsers = async () => {
      var params2 = {
        query: {
          organization: params.query.organization,
          $nopaginate: true,
          $select: ['_id']
        },
        headers: params.headers
      }

      const docsUsers = await params.client.service('users').find(params2)
      return docsUsers
    }

    const getCountTepatWaktu = async (docsIds) => {
      const currentDate = moment().format('YYYY-MM-DD')
      const dateTimeStart = new Date(currentDate + ' 04:00')
      const dateTimeEnd = new Date(currentDate + ' ' + configTimeIn)

      const query = {
        user: { $in: docsIds },
        time: {
          $gt: dateTimeStart,
          $lte: dateTimeEnd
        }
      }

      return Presences.count(query)
    }

    const getCountTerlambat = async (docsIds) => {
      const currentDate = moment().format('YYYY-MM-DD')
      const dateTimeStart = new Date(currentDate + ' ' + configTimeIn)
      const dateTimeEnd = new Date(currentDate + ' 23:59')

      const query = {
        user: { $in: docsIds },
        time: {
          $gt: dateTimeStart,
          $lte: dateTimeEnd
        }
      }

      return Presences.count(query)
    }

    const getKetidakhadiran = async (docsIds) => {
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
          user: docsIds,
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
    const docsIds = docsUsers.map(doc => objectid(doc._id))
    const countUsers = docsUsers.length
    const countTepatWaktu = await getCountTepatWaktu(docsIds)
    const countTerlambat = await getCountTerlambat(docsIds)

    const data = {
      _id: '5ae88e1f72f0bb58be83bdac',
      tepat_waktu: countTepatWaktu,
      terlambat: countTerlambat,
      total: countUsers
    }

    for(let doc of await getKetidakhadiran(docsIds)) {
      data[doc.slug] = doc.count
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
