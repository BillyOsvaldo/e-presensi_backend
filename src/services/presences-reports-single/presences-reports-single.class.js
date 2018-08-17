const { headers } = require('../../helpers/headers')
const objectid = require('objectid')
const moment = require('moment-timezone')

moment.tz.setDefault('Asia/Jakarta')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {}
  }

  

  // @provide params.user
  /*
    {
      user: objectid,
      month: int,
      year: int
    }
  */
  async find (params) {
    const getPresences = async () => {
      const Presences = this.app.service('presences').Model

      const aggregateData = [
        {
          $project: {
            user: 1,
            time: 1,
            mode: 1,
            month: { $month: '$time'},
            year: { $year: '$time'},
            status: 1
          }
        },
        {
          $match: {
            $and: [
              { user: objectid(params.query.user) },
              { month: parseInt(params.query.month) },
              { year: parseInt(params.query.year) },
              { status: true }
            ]
          }
        }
      ]

      const docsPresences = await Presences.aggregate(aggregateData)
      const res = docsPresences.map(doc => {
        var resSingle = {}
        const momentDate = moment(doc.time)
        resSingle.id = doc._id
        resSingle.title = momentDate.format('HH:mm')
        resSingle.start = momentDate.format('YYYY-MM-DD')
        resSingle.className = (doc.mode == 1 ? 'mode-in' : 'mode-out')

        return resSingle
      })
      return res
    }

    const getAbsences = async () => {
      const Absences = this.app.service('absences').Model

      const aggregateData = [
        {
          $project: {
            user: 1,
            absencestype: 1,
            startDate: 1,
            endDate: 1,
            status: 1,
            month: { $month: '$startDate'},
            year: { $year: '$startDate'}
          }
        },
        {
          $match: {
            $and: [
              { user: objectid(params.query.user) },
              { month: parseInt(params.query.month) },
              { year: parseInt(params.query.year) },
              { status: true }
            ]
          }
        },
        { $lookup: { from: 'absencestypes', localField: 'absencestype', foreignField: '_id', as: 'absence_type_text'} },
        { $unwind: { path: '$absence_type_text', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            user: 1,
            absencestype: 1,
            absence_type_text: 1,
            startDate: 1,
            endDate: 1,
            month: { $month: '$startDate'},
            year: { $year: '$startDate'}
          }
        }
      ]

      const docs = await Absences.aggregate(aggregateData)
      const res = docs.map(doc => {
        const momentStartDate = moment(doc.startDate)
        const momentEndDate = moment(doc.endDate)

        var resSingle = {}
        resSingle.id = doc._id
        resSingle.title = doc.absence_type_text.name
        resSingle.start = momentStartDate.format('YYYY-MM-DD')
        resSingle.end = momentEndDate.format('YYYY-MM-DD')
        resSingle.className = 'absence ' + resSingle.title.toLowerCase().replace(' ', '-')

        return resSingle
      })
      return res
    }

    const resPresences = await getPresences()
    const resAbsences = await getAbsences()
    const res = resPresences.concat(resAbsences)

    return {
      total: res.length,
      skip: 0,
      limit: res.length,
      data: res
    }
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    }
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)))
    }

    return data
  }

  async update (id, data, params) {
    return data
  }

  async patch (id, data, params) {
    return data
  }

  async remove (id, params) {
    return { id }
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options)
}

module.exports.Service = Service
