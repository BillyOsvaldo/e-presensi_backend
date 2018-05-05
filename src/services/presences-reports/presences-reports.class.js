const { headers } = require('../../helpers/headers')
const objectid = require('objectid')
const moment = require('moment')
const utils = require('../../helpers/utils')
const getTimeInTimeOut = require('../../helpers/get_time_in_time_out')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {}
  }

  /*
    if today there is mode 1 and mode 2
      if mode 1 < 07.30 and mode 2 > 14.00
        then presence is tepat_waktu
      else if mode 1 > 07.30 and mode 2 > 14.00
        then presence is telat
      if mode 1 is exist and mode 2 is not exist
    else
      if today in absences is found
        count alpa, dl, cuti, izin
  */

  // 
  /*
    @provide params.organization
    @request
      {
        organization: objectid,
        month: int,
        year: int
      }
    @response
      [
        {
          name: String
          tepat_waktu: Number,
          telat: Number,
          pulang_cepat: Number,
          alpa: Number,
          dl: Number,
          cuti: Number,
          izin: Number,
          sakit: Number
        }
      ]
  */
  async find (params) {
    const { timeIn, timeOut } = await getTimeInTimeOut(this)
    const configTimeIn = timeIn
    const configTimeOut = timeOut

    const Presences = this.app.service('presences').Model
    const Absences = this.app.service('absences').Model
    const users = params.client.service('users')
    const profiles = params.client.service('profiles')

    const getDaysInMonth = (month, year) => {
      return new Date(year, month, 0).getDate()
    }

    const getDocsUsers = async () => {
      var params2 = {
        query: {
          organization: params.query.organization,
          $nopaginate: true,
          $select: ['_id', 'position']
        },
        headers: params.headers
      }

      const docsUsers = await params.client.service('users').find(params2)
      return docsUsers
    }

    const sortUsers = async (docUsers) => {
      const getOrderByUserId = async (positionId) => {
        if(!positionId) return 999999

        var params2 = { headers: params.headers }
        const docsOrgStru = await params.client.service('organizationstructures').get(positionId, params2)
        const order = docsOrgStru.order
        return order
      }

      for(let docUser of docUsers) {
        docUser.order = await getOrderByUserId(docUser.position)
      }

      const docUsersSorted = docUsers.sort((a, b) => a.order - b.order)
      return docUsersSorted
    }

    const docsUsers = await getDocsUsers()
    const docsUsersSorted = await sortUsers(docsUsers)
    const usersIds = docsUsersSorted.map(doc => objectid(doc._id))

    const aggregatePresencesData = [
      {
        $project: {
          user: 1,
          time: 1,
          mode: 1,
          month: { $month: '$time'},
          year: { $year: '$time'}
        }
      },
      {
        $match: {
          $and: [
            { user: { $in: usersIds } },
            { month: parseInt(params.query.month) },
            { year: parseInt(params.query.year) }
          ]
        }
      }
    ]

    /*
      find absences where
        startDate is between date ${`first date`-`current month`-`current year` till ${`max`-`currentmonth`-`currentyear`}
        endDate is between date ${`first date`-`current month`-`current year` till ${`max`-`currentmonth`-`currentyear`}
    */
    const aggregateAbsencesData = [
      {
        $project: {
          user: 1,
          startDate: 1,
          endDate: 1,
          absencestype: 1,
          monthStartDate: { $month: '$startDate'},
          yearStartDate: { $year: '$startDate'},
          monthEndDate: { $month: '$endDate'},
          yearEndDate: { $year: '$endDate'}
        }
      },
      { $lookup: { from: 'absencestypes', localField: 'absencestype', foreignField: '_id', as: 'row_absence_type'} },
      { $unwind: { path: '$row_absence_type', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $and: [
            { user: { $in: usersIds } },
            {
              $or: [
                {
                  $and: [
                    { monthStartDate: parseInt(params.query.month) },
                    { yearStartDate: parseInt(params.query.year) }
                  ]
                },
                {
                  $and: [
                    { monthEndDate: parseInt(params.query.month) },
                    { yearEndDate: parseInt(params.query.year) }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        $project: {
          user: 1,
          startDate: 1,
          endDate: 1,
          row_absence_type: 1
        }
      }
    ]

    const getAbsencesByUser = (user, docs) => {
      return docs.filter(doc => doc.user.toString() == user.toString())
    }

    const getAbsenceByDate = (argDate, user, docs) => {
      const docAbsence = getAbsencesByUser(user, docs)
      if(!Boolean(docAbsence.length)) return null

      return docAbsence
    }

    const countAbsence = (absenceType, user, docs) => {
      var counter = 0
      for(let doc of docs) {
        let sameUser = (doc.user.toString() == user.toString())
        let sameAbsenceType = (doc.row_absence_type.name == absenceType)
        if(sameAbsenceType && sameUser) counter++
      }
      return counter
    }

    const getPresencesByUser = (user, docs) => {
      return docs.filter(doc => doc.user.toString() == user.toString())
    }

    const getPresenceByDate = (argDate, user, docs) => {
      var res = { modeIn: null, modeOut: null }

      const docPresences = getPresencesByUser(user, docs)
      if(!Boolean(docPresences.length)) return res

      const docsFiltered = docs.filter(doc => {
        const docMoment = moment(doc.time).format('DD-MM-YYYY')
        const argDateMoment = moment(argDate).format('DD-MM-YYYY')
        return docMoment == argDateMoment
      })

      if(!docsFiltered.length) return res

      if(docsFiltered[0]) {
        const mode1 = (docsFiltered[0].mode == 1 ? 'modeIn' : 'modeOut')
        res[mode1] = docsFiltered[0].time
      }

      if(docsFiltered[1]) {
        const mode2 = (docsFiltered[1].mode == 1 ? 'modeIn' : 'modeOut')
        res[mode2] = docsFiltered[1].time
      }

      return res
    }

    const isTepatWaktu = (docInOut) => {
      if(!docInOut) return false
      if(!docInOut.modeIn) return false
      if(!docInOut.modeOut) return false

      const momentInTimeOnly = moment(docInOut.modeIn).format('HH:mm')
      const momentOutTimeOnly = moment(docInOut.modeOut).format('HH:mm')

      const momentIn = moment(momentInTimeOnly, 'HH:mm')
      const momentOut = moment(momentOutTimeOnly, 'HH:mm')

      const momentInConfig = moment(configTimeIn, 'HH:mm')
      const momentOutConfig = moment(configTimeOut, 'HH:mm')

      const tepatMasuk = momentIn.isBefore(momentInConfig)
      const tepatPulang = momentOutConfig.isBefore(momentOut)

      if(tepatMasuk && tepatPulang) return true

      return false
    }

    const isTelat = (docInOut) => {
      if(!docInOut) return false
      if(!docInOut.modeIn) return false
      if(!docInOut.modeOut) return false

      const momentInTimeOnly = moment(docInOut.modeIn).format('HH:mm')
      const momentIn = moment(momentInTimeOnly, 'HH:mm')
      const momentInConfig = moment(configTimeIn, 'HH:mm')
      const telatMasuk = momentInConfig.isBefore(momentIn)
      return telatMasuk
    }

    const isPulangCepat = (docInOut) => {
      if(!docInOut) return false

      return Boolean(docInOut.modeIn && !docInOut.modeOut)
    }


    const docsAbsences = await Absences.aggregate(aggregateAbsencesData)
    const docsPresences = await Presences.aggregate(aggregatePresencesData)
    const daysInMonth = getDaysInMonth(params.query.month, params.query.year)

    var resData = []
    for(let user of usersIds) {
      let docUser = await users.get(user)
      if(!docUser.profile) continue

      let docProfile = await profiles.get(docUser.profile)
      if(!docProfile._id) continue

      var row = {
        name: utils.getFullName(docProfile),
        _id: user,
        tepat_waktu: 0,
        telat: 0,
        pulang_cepat: 0,
        alpa: 0,
        dl: 0,
        cuti: 0,
        izin: 0,
        sakit: 0,
      }

      // presences
      for(let dateCounter = 1; dateCounter <= daysInMonth; dateCounter++) {
        let currentDate = (new Date()).getDate()

        // loop hanya sampai tanggal sekarang dibulan ini
        if(dateCounter >= currentDate) break

        // format $day is 01, 02, 03 ... 30, 31
        let day = dateCounter.toString().padStart(2, '0')
        // format $dateArg is 2018-04-30
        let dateArg = `${params.query.year}-${params.query.month}-${day}`
        let docInOut = getPresenceByDate(new Date(dateArg), user, docsPresences)

        if(!docInOut) { // if null then current user is alpha
          row.alpa++
          continue
        }

        if(isTepatWaktu(docInOut)) {
          row.tepat_waktu++
          continue
        }

        if(isTelat(docInOut)) {
           row.telat++
          continue
        }

        if(isPulangCepat(docInOut)) {
          row.pulang_cepat++
          continue
        }
      }

      // absences
      row.dl = countAbsence('Dinas Luar', user, docsAbsences)
      row.cuti = countAbsence('Cuti', user, docsAbsences)
      row.izin = countAbsence('Izin', user, docsAbsences)
      row.sakit = countAbsence('Sakit', user, docsAbsences)

      resData.push(row)
    }

    return { total: resData.length, skip: 0, limit: resData.length, data: resData }
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
