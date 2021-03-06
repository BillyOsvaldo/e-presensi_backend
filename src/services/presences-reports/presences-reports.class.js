const { headers } = require('../../helpers/headers')
const objectid = require('objectid')
const moment = require('moment-timezone')
const utils = require('../../helpers/utils')
const getTimeInTimeOut = require('../../helpers/get_time_in_time_out')
const getTimeInTimeOutByMonth = require('../../helpers/get_time_in_time_out').getByMonth
const getParamsWithHeader = require('../../helpers/get_params_with_header')

moment.tz.setDefault('Asia/Jakarta')

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

    const Presences = this.app.service('presences').Model
    const Absences = this.app.service('absences').Model

    const queryMonthPad = params.query.month.toString().padStart(2, '0')

    const timeInTimeOutByMonth = await getTimeInTimeOutByMonth(queryMonthPad, params.query.year, this)

    const getDaysInMonth = (month, year) => {
      return new Date(year, month, 0).getDate()
    }

    const getDocsUsers = async () => {
      const MachinesUsers = this.app.service('machinesusers').Model
      const where = { 'user.organizationuser.organization._id': objectid(params.query.organization) }
      const sort = { 'user.position.order': 1 }
      const docsMachinesUsers = await MachinesUsers.find(where).sort(sort)
      const docsUsers = docsMachinesUsers.map(doc => doc.user)
      return docsUsers
    }

    const getDocsPresences = async () => {
      const { fromStr, untilStr } = utils.firstDayOfCurrMonthUntilSecondDayOfNextMonth(params.query.month, params.query.year)

      const aggregateData = [
        {
          $match: {
            $and: [
              { 'user.organizationuser.organization._id': objectid(params.query.organization) },
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

    const getDocsAbsences = async () => {
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
              { 'user.organizationuser.organization._id': objectid(params.query.organization) },
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

      return await Absences.aggregate(aggregateAbsencesData)
    }

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

    const filterPresencesByUser = (user, docs) => {
      return docs.filter(doc => doc.user._id.toString() == user.toString())
    }

    const filterPresencesByDate = (dateCounter, docs) => {
      const getDateCtx = () => {
        const dateCounterStrPad = dateCounter.toString().padStart(2, '0')
        const queryMonthPad = params.query.month.toString().padStart(2, '0')
        const queryYear = params.query.year
        return moment(`${queryYear}-${queryMonthPad}-${dateCounterStrPad}`).format('DD-MM-YYYY')
      }
      return docs.filter(doc => {
        const docMoment = moment(doc.workDay).format('DD-MM-YYYY')
        const todayMoment = getDateCtx()

        return docMoment == todayMoment
      })
    }

    const getPresenceByDate = (dateCounter, user, docs) => {
      var res = { modeIn: null, modeOut: null }

      const docPresences = filterPresencesByUser(user, docs)
      if(!Boolean(docPresences.length)) return res

      const docsFiltered = filterPresencesByDate(dateCounter, docPresences)

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

    const isTepatWaktu = (docInOut, momentInConfig, momentOutConfig) => {
      if(!docInOut) return false
      if(!docInOut.modeIn) return false
      if(!docInOut.modeOut) return false

      const momentInTimeOnly = moment(docInOut.modeIn).format('HH:mm')
      const momentOutTimeOnly = moment(docInOut.modeOut).format('HH:mm')

      const momentIn = moment(momentInTimeOnly, 'HH:mm')
      const momentOut = moment(momentOutTimeOnly, 'HH:mm')

      const tepatMasuk = momentIn.isBefore(momentInConfig)
      const tepatPulang = momentOutConfig.isBefore(momentOut)

      if(tepatMasuk && tepatPulang) return true

      return false
    }

    const isTelat = (docInOut, momentInConfig) => {
      if(!docInOut) return false
      if(!docInOut.modeIn) return false

      const momentInTimeOnly = moment(docInOut.modeIn).format('HH:mm')
      const momentIn = moment(momentInTimeOnly, 'HH:mm')
      const telatMasuk = momentInConfig.isBefore(momentIn)
      return telatMasuk
    }

    const isPulangCepat = (docInOut, momentOutConfig) => {
      if(!docInOut) return false

      const momentOutTimeOnly = moment(docInOut.modeOut).format('HH:mm')
      const momentOut = moment(momentOutTimeOnly, 'HH:mm')
      const dateIsNotToday = (moment(docInOut.modeIn).format('D') != (new Date).getDate())

      const hasNoPresentType2 = Boolean(docInOut.modeIn && !docInOut.modeOut && dateIsNotToday)
      const presentType2BeforeConfigOut = Boolean(docInOut.modeOut && momentOut.isBefore(momentOutConfig))

      return hasNoPresentType2 || presentType2BeforeConfigOut
    }

    const queryMonthAndYearSameAsCurrentMonthAndYear = () => {
      const queryMonth = parseInt(params.query.month)
      const queryYear = parseInt(params.query.year)
      const currentMonth = moment().format('M')
      const currentYear = moment().format('Y')
      return (queryMonth == currentMonth) && (queryYear == currentYear)
    }

    const docsUsers = await getDocsUsers()
    const docsAbsences = await getDocsAbsences()
    const docsPresences = await getDocsPresences()
    const daysInMonth = getDaysInMonth(queryMonthPad, params.query.year)

    const resolveReport = async (docUser) => {
      let row = {
        name: utils.getFullName(docUser.profile),
        _id: docUser._id,
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
        let currentDate = moment().format('D')

        // loop hanya sampai tanggal sekarang dibulan ini
        if(dateCounter > currentDate && queryMonthAndYearSameAsCurrentMonthAndYear()) break

        let docInOut = getPresenceByDate(dateCounter, docUser._id, docsPresences)

        if(!docInOut) { // if null then current user is alpha
          row.alpa++
          continue
        }

        let timeInTimeOut = timeInTimeOutByMonth[dateCounter]
        let momentInConfig = moment(timeInTimeOut.timeIn, 'HH:mm')
        let momentOutConfig = moment(timeInTimeOut.timeOut, 'HH:mm')

        if(isTepatWaktu(docInOut, momentInConfig, momentOutConfig)) {
          row.tepat_waktu++
          continue
        }

        if(isTelat(docInOut, momentInConfig)) {
          row.telat++
        }

        if(isPulangCepat(docInOut, momentOutConfig)) {
          row.pulang_cepat++
        }
      }

      // absences
      row.dl = countAbsence('Dinas Luar', docUser._id, docsAbsences)
      row.cuti = countAbsence('Cuti', docUser._id, docsAbsences)
      row.izin = countAbsence('Izin', docUser._id, docsAbsences)
      row.sakit = countAbsence('Sakit', docUser._id, docsAbsences)

      return row
    }

    const docsUsersJobs = docsUsers.map(docUser => resolveReport(docUser))
    const resData = await Promise.all(docsUsersJobs)

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
