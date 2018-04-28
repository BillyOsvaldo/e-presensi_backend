const { headers } = require('../../helpers/headers')
const objectid = require('objectid')
const moment = require('moment')

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
    const Presences = this.app.service('presences').Model

    const aggregateData = [
      {
        $project: {
          user: 1,
          time: 1,
          mode: 1,
          month: { $month: '$time'},
          year: { $year: '$time'},
        }
      },
      {
        $match: {
          $and: [
            { user: objectid(params.query.user) },
            { month: parseInt(params.query.month) },
            { year: parseInt(params.query.year) }
          ]
        }
      }
    ]

    const docs = await Presences.aggregate(aggregateData)
    const res = docs.map(doc => {
      var resSingle = {}
      const momentDate = moment(doc.time)
      resSingle.id = doc._id
      resSingle.title = momentDate.format('HH:mm')
      resSingle.start = momentDate.format('YYYY-MM-DD')
      resSingle.className = (doc.mode == 1 ? 'mode-in' : 'mode-out')

      return resSingle
    })

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
