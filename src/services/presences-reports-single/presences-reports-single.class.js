const { headers } = require('../../helpers/headers')
const objectid = require('objectid')
const moment = require('moment-timezone')
const utils = require('../../helpers/utils')

moment.tz.setDefault('Asia/Jakarta')

class Service {
  constructor (options) {
    this.options = options || {}
  }

  /*
    @params
      {
        user: objectid,
        month: int,
        year: int
      }

    flow:
      1. find all presences where date is between 1st day of current month until 2nd day of next month.
         e.g: 01 aug 2018 - 02 sept 2018
      2. 
  */
  async find (params) {
    const hook = require('../../hooks/presences')

    const getReportPresences = async () => {
      const getDocsPresences = async () => {
        const Presences = this.app.service('presences').Model
        const { fromStr, untilStr } = utils.firstDayOfCurrMonthUntilSecondDayOfNextMonth(params.query.month, params.query.year)

        const aggregateData = [
          {
            $match: {
              $and: [
                { 'user._id': objectid(params.query.user) },
                {
                  time: {
                    $gte: new Date(fromStr),
                    $lte: new Date(untilStr)
                  }
                },
                { status: true }
              ]
            }
          }
        ]

        return await Presences.aggregate(aggregateData)
      }

      /*
        @return: [
          {
            id: ObjectId
            title: 07:30 String
            start: 2018-12-31 String
            className: mode-in|mode-out String
          }
        ]
      */
      const getReportsPresencesTimeInOut = async (docsPresences, configTimeInOutMonth) => {
        const MODE_IN = 1
        const MODE_OUT = 2

        var reportsPresences = []
        const lastDateOfMonth = utils.getLastDatesOfMonth(params.query.month, params.query.year)
        // 1, 2, 3... 31
        for(let currentDateOfMonth = 1; currentDateOfMonth <= lastDateOfMonth; currentDateOfMonth++) {
          let configTimeInOut = configTimeInOutMonth[currentDateOfMonth]

          let reportPresenceModeIn = await hook.getTimeInOutFromPresence(MODE_IN, currentDateOfMonth,
                                                                         docsPresences, configTimeInOut, this, params)
          let reportPresenceModeOut = await hook.getTimeInOutFromPresence(MODE_OUT, currentDateOfMonth,
                                                                          docsPresences, configTimeInOut, this, params)

          if(reportPresenceModeIn !== null)
            reportsPresences.push(reportPresenceModeIn)
          if(reportPresenceModeOut !== null)
            reportsPresences.push(reportPresenceModeOut)
        }
        return reportsPresences
      }

      const docsPresences = await getDocsPresences()
      const configTimeInOutMonth = await hook.getConfigTimeInOutMonth(params.query.user, this, params)
      const reportsPresencesTimeInOut = await getReportsPresencesTimeInOut(docsPresences, configTimeInOutMonth)
      return reportsPresencesTimeInOut
    }

    const getReportAbsences = async () => {
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
              { 'user._id': objectid(params.query.user) },
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

    const resReportPresences = await getReportPresences()
    const resReportAbsences = await getReportAbsences()
    const res = resReportPresences.concat(resReportAbsences)

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
