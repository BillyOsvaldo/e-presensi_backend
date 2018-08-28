const moment = require('moment-timezone')
const objectid = require('objectid')
const errors = require('@feathersjs/errors')
const utils = require('../helpers/utils')

// ------------------------------------------------------------------------ config
moment.tz.setDefault('Asia/Jakarta')

// assumed that working hours is never reach 18 hours/day
const MAX_WORK_HOUR = 18

// format MOCK_CURRENT_DATE: YYYY-MM-DD HH:mm. e.g '2018-08-16'
const MOCK_CURRENT_DATE = null // date|null

const CONTEXT_RESULT_IGNORE = { status: 'OK', _id: '5b5fd6ff4fcc250584b2c642', ignored: true }

// ------------------------------------------------------------------------ helper

const EpresTime = class {
  constructor(dateStrArg) {
    this.str = dateStrArg
    this.date = new Date(this.str)
    this.moment = moment(this.date)
  }
}

const getWeekDay = (momentDate) => {
  return momentDate.format('dddd').toLowerCase()
}

const getSpecialTime = async (userId, ctxDate, context) => {
  const ctxDateObj = new Date(ctxDate)
  const SpecialTimes = context.app.service('specialtimes').Model

  const where = {
    user: objectid(userId),
    endDate: { $gte: ctxDateObj },
    startDate: { $lte: ctxDateObj }
  }

  const doc = await SpecialTimes.findOne(where)
  const isUseSpecialTime = (doc != null)
  return { isUseSpecialTime, specialTimeInOut: doc }
}

/*
  desc: get default time in and out today only

  @params:
    ctxDate String (YYYY-MM-DD)
*/
const getDefaultTimeInOut = async (ctxDate, context) => {
  const ctxDateObj = new Date(ctxDate)
  const ctxWeekDay = getWeekDay(moment(ctxDate))
  const WorkDays = context.app.service('workdays').Model

  const where = {
    endDate: { $gte: ctxDateObj },
    startDate: { $lte: ctxDateObj },
    organization: objectid(context.params.organization)
  }

  const doc = await WorkDays.findOne(where)
  const configTimeInOut = doc[ctxWeekDay]
  return configTimeInOut
}

/*
  @return:
    {
      '1': {
        timeIn: time String (08:00)
        timeOut: time String (14:00)
      },
      '2': {
        timeIn: time String (08:00)
        timeOut: time String (14:00)
      },
      ...
      '31': {
        timeIn: time String (08:00)
        timeOut: time String (14:00)
      },
    }
*/
const getDefaultTimeInOutMonth = async (context, params) => {
  var res = []

  const isMonthOnly = true
  const { fromStr, untilStr } = utils.firstDayOfCurrMonthUntilLastDayOfCurrMonth(params.query.month, params.query.year, isMonthOnly)
  
  const getDocsWorkDays = async () => {
    const WorkDays = context.app.service('workdays').Model

    // final: WHERE NOT (startDate > untilStr OR To_date < fromStr)
    const aggregateData = [
      {
        $match: {
          $or: [
            { startDate: { $gte: new Date(untilStr) } },
            { endDate: { $lte: new Date(fromStr) } },
          ]
        }
      },
      {
        $project: {
          _id: 1
        }
      }
    ]

    const getWhere = (idsReversed) => { _id: { $nin: idsReversed } }
    const docsIdsReversed = await WorkDays.aggregate(aggregateData)
    const idsReversed = docsIdsReversed.map(doc => doc._id)
    return await WorkDays.find(getWhere(idsReversed))
  }

  const addMomentToDocsWorkDays = (docsWorkDays) => {
    return docsWorkDays.map(docsWeekDay => {
      /*for(let weekDay of utils.getWeekDays()) {
        const isHoliday = !docsWeekDay[weekDay]
        if(isHoliday) continue

        docsWeekDay[weekDay].startDateMoment = moment(docsWeekDay[weekDay].startDate)
        docsWeekDay[weekDay].endDateMoment = moment(docsWeekDay[weekDay].endDate)
      }*/

      docsWeekDay = JSON.parse(JSON.stringify(docsWeekDay))
      docsWeekDay.startDateMoment = moment(docsWeekDay.startDate)
      docsWeekDay.endDateMoment = moment(docsWeekDay.endDate)
      return docsWeekDay
    })
  }

  /*
    @params:
      ctxMoment moment
      docsWorkDaysAndMoment
    @return: {
      dateOfMonth: int (1...31)
      timeIn: time String (08:00)
      timeOut: time String (14:00)
    }
  */
  const getTimeManagementByDate = (ctxMoment) => {
    const currentDateOfMonth = ctxMoment.format('D')
    const generateRes = (ctxMoment, docTimesManagement) => {
      const ctxWeekDay = getWeekDay(ctxMoment)
      const timeIn = (Boolean(docTimesManagement[ctxWeekDay]) ? docTimesManagement[ctxWeekDay].timeIn : null)
      const timeOut = (Boolean(docTimesManagement[ctxWeekDay]) ? docTimesManagement[ctxWeekDay].timeOut : null)
      return {
        dateOfMonth: ctxMoment.format('D'),
        timeIn: timeIn,
        timeOut: timeOut
      }
    }

    for(let docTimesManagement of docsWorkDaysAndMoment) {
      if(ctxMoment.isBetween(docTimesManagement.startDateMoment, docTimesManagement.endDateMoment, 'days', '[]')) {
        return generateRes(ctxMoment, docTimesManagement)
      }
    }

    throw new Error('Unknown config time-in and time-out')
  }

  const docsTimesManagement = await getDocsWorkDays()
  const docsWorkDaysAndMoment = addMomentToDocsWorkDays(docsTimesManagement)

  for (let ctxMoment = moment(fromStr); ctxMoment.diff(untilStr, 'days') <= 0; ctxMoment.add(1, 'days')) {
    let currentDate = ctxMoment.format('YYYY-MM-DD')
    let currentDateOfMonth = ctxMoment.format('D')
    res[currentDateOfMonth] = getTimeManagementByDate(ctxMoment, docsWorkDaysAndMoment)
  }

  return res
}

const getSpecialTimeInOutMonth = async (context, params) => {
  var res = []

  const isMonthOnly = true
  const { fromStr, untilStr } = utils.firstDayOfCurrMonthUntilLastDayOfCurrMonth(params.query.month, params.query.year, isMonthOnly)
  
  const getDocsSpecialTime = async () => {
    const SpecialTime = context.app.service('specialtimes').Model

    // final: WHERE NOT (startDate > untilStr OR To_date < fromStr)
    const aggregateData = [
      { $match: { user: params.query.user } },
      {
        $match: {
          $or: [
            { startDate: { $gte: new Date(untilStr) } },
            { endDate: { $lte: new Date(fromStr) } },
          ]
        }
      },
      {
        $project: {
          _id: 1
        }
      }
    ]

    const getWhere = (idsReversed) => { _id: { $nin: idsReversed } }
    const docsIdsReversed = await SpecialTime.aggregate(aggregateData)
    const idsReversed = docsIdsReversed.map(doc => doc._id)
    return await SpecialTime.find(getWhere(idsReversed))
  }

  const addMomentToDocsSpecialTime = (docsSpecialTime) => {
    return docsSpecialTime.map(docSpecialTime => {
      docSpecialTime.startDateMoment = moment(docSpecialTime.startDate)
      docSpecialTime.endDateMoment = moment(docSpecialTime.endDate)
      return docSpecialTime
    })
  }

  /*
    @params:
      ctxMoment moment
      docsSpecialTimeAndMoment
    @return: {
      dateOfMonth: int (1...31)
      timeIn: time String (08:00)
      timeOut: time String (14:00)
    }
  */
  const getSpecialTimeByDate = (ctxMoment) => {
    const currentDateOfMonth = ctxMoment.format('D')
    const generateRes = (ctxMoment, docSpecialTime) => {
      return {
        dateOfMonth: ctxMoment.format('D'),
        timeIn: docSpecialTime.timeIn,
        timeOut: docSpecialTime.timeOut
      }
    }

    for(let docSpecialTime of docsSpecialTimeAndMoment) {
      if(ctxMoment.isBetween(docSpecialTime.startDateMoment, docSpecialTime.endDateMoment, 'days', '[]')) {
        return generateRes(ctxMoment, docSpecialTime)
      }
    }

    return null
  }

  const docsSpecialTime = await getDocsSpecialTime()
  const docsSpecialTimeAndMoment = addMomentToDocsSpecialTime(docsSpecialTime)

  for (let ctxMoment = moment(fromStr); ctxMoment.diff(untilStr, 'days') <= 0; ctxMoment.add(1, 'days')) {
    let currentDate = ctxMoment.format('YYYY-MM-DD')
    let currentDateOfMonth = ctxMoment.format('D')
    res[currentDateOfMonth] = getSpecialTimeByDate(ctxMoment, docsSpecialTimeAndMoment)
  }

  return res
}

/*
  @params:
    userId int
    ctxDate String (YYYY-MM-DD)
    context feathers.app
  @return: { timeIn: EpresTime, timeOut: EpresTime }|null
*/
const getConfigTimeInOut = async (userId, ctxDate, context) => {
  const defautTimeInOut = await getDefaultTimeInOut(ctxDate, context)
  const isHoliday = !defautTimeInOut
  if(isHoliday)
    return null

  const { isUseSpecialTime, specialTimeInOut } = await getSpecialTime(userId, ctxDate, context)
  const dateTodayStr = (MOCK_CURRENT_DATE ? MOCK_CURRENT_DATE : moment(ctxDate).format('YYYY-MM-DD'))

  var timeIn, timeOut
  if(isUseSpecialTime) {
    timeIn = specialTimeInOut.timeIn
    timeOut = specialTimeInOut.timeOut
  } else {
    timeIn = defautTimeInOut.timeIn
    timeOut = defautTimeInOut.timeOut
  }

  const isConfigOutBeforeIn = () => {
    const timeInMoment = moment(dateTodayStr + ' ' + timeIn)
    const timeOutMoment = moment(dateTodayStr + ' ' + timeOut)

    return timeOutMoment.isBefore(timeInMoment)
  }

  var timeOutDateStr
  if(isConfigOutBeforeIn()) {
    timeOutDateStr = moment(dateTodayStr).add(1, 'day').format('YYYY-MM-DD')
  } else {
    timeOutDateStr = dateTodayStr
  }

  var res = {}
  res.timeIn = new EpresTime(dateTodayStr + ' ' + timeIn)
  res.timeOut = new EpresTime(timeOutDateStr + ' ' + timeOut)
  return res
}

/*
  @params:
    userId int
    context: feathers context
  @return: [
    '1': { timeIn: '07:30', timeOut: '14:00' }
    '2': { timeIn: '07:30', timeOut: '14:00' }
    '3': { timeIn: '07:30', timeOut: '14:00' }
    ...
    '31': { timeIn: '14:30', timeOut: '22:00' }
  ]
*/
const getConfigTimeInOutMonth = async (userId, context, params) => {
  var configTimeInOutMonth = []
  const defautTimeInOutMonth = await getDefaultTimeInOutMonth(context, params)
  const specialTimeInOutMonth = await getSpecialTimeInOutMonth(context, params)
  const datesOfMonth = Object.keys(defautTimeInOutMonth).map(k => parseInt(k))

  for(let dateOfMonth of datesOfMonth) {
    if(specialTimeInOutMonth[dateOfMonth]) {
      configTimeInOutMonth[dateOfMonth] = specialTimeInOutMonth[dateOfMonth]
    } else {
      configTimeInOutMonth[dateOfMonth] = defautTimeInOutMonth[dateOfMonth]
    }
  }

  return configTimeInOutMonth
}

/*
  @return: 1|2|null

    1: means mode in
    2: means mode out
    null: means ignore this present
*/
const getMode = (userTimeIn, configTimeInOut, wasAlreadyIn, minuteBeforeTimeIn, minuteAfterTimeIn) => {
  if(!wasAlreadyIn) { // present mode in
    const timeInMoment = configTimeInOut.timeIn.moment
    const toleranceBefore = timeInMoment.clone().subtract(Math.abs(minuteBeforeTimeIn), 'minute')
    const toleranceAfter  = timeInMoment.clone().add(Math.abs(minuteAfterTimeIn), 'minute')
    const isModeIn = userTimeIn.moment.clone().isBetween(toleranceBefore, toleranceAfter, null, '[]')
    return (isModeIn ? 1 : null)
  } else {
    // tolerance mode out is between time in and MAX_WORK_HOUR hour after
    const timeInMoment = configTimeInOut.timeIn.moment
    const toleranceBefore = timeInMoment.clone()
    const toleranceAfter  = timeInMoment.clone().add(MAX_WORK_HOUR, 'hour')
    const isModeOut = userTimeIn.moment.clone().isBetween(toleranceBefore, toleranceAfter, null, '[]')
    return (isModeOut ? 2 : null)
  }
}

/*
  @return boolean: wheter today the user has mode 1
*/
const getPresenceCountToday = async (userId, configTimeInOut, minuteBeforeTimeIn, context) => {
  // get total docs when presences.mode 1 between (time-in minus tolerance-before) until (time-in plus MAX_WORK_HOUR hours)

  // config
  const ObjectId = context.app.get('mongooseClient').Types.ObjectId
  const Presences = context.app.service('presences').Model

  // setup data
  const timeInMoment = configTimeInOut.timeIn.moment
  const toleranceBefore = timeInMoment.clone().subtract(Math.abs(minuteBeforeTimeIn), 'minute')
  const fromMoment = toleranceBefore
  const untilMoment = timeInMoment.clone().add(MAX_WORK_HOUR, 'hour')

  // exec
  const where = {
    time: {
      $gte: fromMoment.format(),
      $lte: untilMoment.format(),
    },
    user: ObjectId(context.data.user)
  }

  const count = await Presences.countDocuments(where)
  return count
}

const getSettingTolerance = async (context) => {
  const defaultMinuteBeforeTimeIn = 90
  const defaultMinuteAfterTimeIn = 90

  const Settings = context.app.service('settings').Model
  const minuteBeforeTimeInPromise = Settings.findOne({ tag: 'minute_before_time_in' })
  const minuteAfterTimeInPromise = Settings.findOne({ tag: 'minute_after_time_in' })
  const jobs = Promise.all([ minuteBeforeTimeInPromise, minuteAfterTimeInPromise ])
  const [ minuteBeforeTimeInDoc, minuteAfterTimeInDoc ] = await jobs
  return { minuteBeforeTimeIn: minuteBeforeTimeInDoc.value, minuteAfterTimeIn: minuteAfterTimeInDoc.value }
}

const getPresenceToday = async (userId, configTimeInOut, minuteBeforeTimeIn, context) => {
  // get total docs when presences.mode 1 between (time-in minus tolerance-before) until (time-in plus MAX_WORK_HOUR hours)

  // config
  const Presences = context.app.service('presences').Model

  // setup data
  const timeInMoment = configTimeInOut.timeIn.moment
  const toleranceBefore = timeInMoment.clone().subtract(Math.abs(minuteBeforeTimeIn), 'minute')
  const fromMoment = toleranceBefore
  const untilMoment = timeInMoment.clone().add(MAX_WORK_HOUR, 'hour')

  // exec
  const where = {
    time: {
      $gte: fromMoment.format(),
      $lte: untilMoment.format(),
    },
    user: objectid(context.data.user)
  }

  const doc = await Presences.find(where)
  return doc
}

/*
  find presences where user is current-user and time is between (ctxDate minus MAX_HOURS) and ctxDate
*/
const isContinuedFromYesterday = async (userId, currTimeMoment, context) => {
  // config
  const Presences = context.app.service('presences').Model
  const from = currTimeMoment.clone().subtract(MAX_WORK_HOUR, 'hour')
  const until = currTimeMoment.clone()

  const where = {
    time: {
      $gte: from.format(),
      $lte: until.format(),
    },
    user: objectid(context.data.user)
  }

  const docs = await Presences.find(where)
  var docMode1, docMode2
  for(let doc of docs) {
    if(doc.mode == 1)
      docMode1 = doc
    else
      docMode2 = doc
  }

  const alreadyInButNotOutYet = (docMode1 && !docMode2)
  return alreadyInButNotOutYet
}

const isAlreadyInOrOut = (ctxMode, docsPresenceToday) => {
  for(let doc of docsPresenceToday) {
    if(ctxMode == doc.mode) return true
  }
  return false
}

// !broken!
// !not-tested!
const setModeAuto = async (context) => {
  const { minuteBeforeTimeIn, minuteAfterTimeIn } = await getSettingTolerance(context)
  const ctxDate = moment().format('YYYY-MM-DD')
  const configTimeInOut = await getConfigTimeInOut(context.data.user, ctxDate, context)
  const presenceCountToday = await getPresenceCountToday(context.data.user, configTimeInOut, minuteBeforeTimeIn, context)
  const isAlreadyOut = presenceCountToday > 1
  if(isAlreadyOut) {
    console.log(`create presence [failed]: user ${context.data.user}: isAlreadyOut`)
    context.result = CONTEXT_RESULT_IGNORE
    return
  }

  const wasAlreadyIn = Boolean(presenceCountToday)
  const dateTimeStrISO = context.data.time.toString()
  const dateTimeStr = moment(new Date(dateTimeStrISO)).format('YYYY-MM-DD HH:mm:ss')
  const userTimeIn = new EpresTime(dateTimeStr)

  const mode = getMode(userTimeIn, configTimeInOut, wasAlreadyIn, minuteBeforeTimeIn, minuteAfterTimeIn)
  if(mode === null) {
    console.log(`create presence [failed]: user ${context.data.user}: mode null`)
    context.result = CONTEXT_RESULT_IGNORE
    return
  }

  console.log(`create presence [succcess]: user ${context.data.user}`)
  context.data.mode = mode
}

const setModeManual = async (context) => {
  const { minuteBeforeTimeIn, minuteAfterTimeIn } = await getSettingTolerance(context)
  const currTimeMoment = moment(context.data.time, 'YYYYMMDDHHMMSS')
  const ctxDate = currTimeMoment.format('YYYY-MM-DD')
  const configTimeInOut = await getConfigTimeInOut(context.data.user, ctxDate, context)
  const isHoliday = (configTimeInOut === null)
  if(isHoliday) {
    console.log(`create presence [failed]: user ${context.data.user}: holiday`)
    context.result = CONTEXT_RESULT_IGNORE
    return
  }

  const docsPresenceToday = await getPresenceToday(context.data.user, configTimeInOut, minuteBeforeTimeIn, context)
  const noPresenceToday = (!docsPresenceToday.length)
  const isModeOut = (context.data.mode == 2)
  const tryingOutBeforeIn = (isModeOut && noPresenceToday)
  const continuedFromYesterday = await isContinuedFromYesterday(context.data.user, currTimeMoment, context)

  if(tryingOutBeforeIn && !continuedFromYesterday) {
    console.log(`create presence [failed]: user ${context.data.user}: trying out before in`)
    context.result = CONTEXT_RESULT_IGNORE
    return
  }

  // current user already in/out
  if(isAlreadyInOrOut(context.data.mode, docsPresenceToday)) {
    console.log(`create presence [failed]: user ${context.data.user}: already ${ context.data.mode == 1 ? 'in' : 'out' }`)
    context.result = CONTEXT_RESULT_IGNORE
    return
  }

  /*
    if current mode is 1 (in)
    then current time is must between (config-in minus tolerance before) until config-out
  */
  var timeToleranceBeforeMoment, timeToleranceAfterMoment
  if(context.data.mode == 1) {
    timeToleranceBeforeMoment = configTimeInOut.timeIn.moment.clone().subtract(Math.abs(minuteBeforeTimeIn), 'minute')
    timeToleranceAfterMoment = configTimeInOut.timeIn.moment.clone().add(Math.abs(minuteAfterTimeIn), 'minute')
  } else { // context.data.mode == 2
    timeToleranceBeforeMoment = configTimeInOut.timeIn.moment.clone().add(Math.abs(minuteAfterTimeIn), 'minute')
    timeToleranceAfterMoment = configTimeInOut.timeIn.moment.clone().add(MAX_WORK_HOUR, 'hour')
  }

  const currentTimeIsBetweenToleranceBeforeAndAfter = currTimeMoment.isBetween(timeToleranceBeforeMoment,
                                                                               timeToleranceAfterMoment, null, '[]')
  if(!currentTimeIsBetweenToleranceBeforeAndAfter &&
     !continuedFromYesterday) {
    console.log(`create presence [failed]: user ${context.data.user}: wrong time.
                 currTimeMoment: ${ currTimeMoment.format('DD-MM-YYYY HH:mm:ss') } is not between
                 timeToleranceBeforeMoment: ${ timeToleranceBeforeMoment.format('DD-MM-YYYY HH:mm:ss') } AND
                 timeToleranceAfterMoment: ${ timeToleranceAfterMoment.format('DD-MM-YYYY HH:mm:ss') }
    `)

    context.result = CONTEXT_RESULT_IGNORE
    return
  }
  
  console.log(`create presence [success]: user ${context.data.user} on ${ currTimeMoment.format('DD-MM-YYYY HH:mm:ss') }`)
}

const checkIfExist = async (context) => {
  const datetime = context.data.time
  const momentDate = moment(datetime)
  const date = momentDate.format('D')
  const month = momentDate.format('M')
  const year = momentDate.format('YYYY')

  const Presences = context.app.service('presences').Model
  const aggregateData = [
    {
      $project: {
        user: 1,
        time: 1,
        mode: 1,
        dayOfMonth: { $dayOfMonth: '$time'},
        month: { $month: '$time'},
        year: { $year: '$time'},
      }
    },
    {
      $match: {
        $and: [
          { user: objectid(context.data.user) },
          { dayOfMonth: parseInt(date) },
          { month: parseInt(month) },
          { year: parseInt(year) },
          { mode: parseInt(context.data.mode) },
        ]
      }
    }
  ]

  const docs = await Presences.aggregate(aggregateData)

  const exist = Boolean(docs.length)
  if(exist) {
    context.result = { status: 'OK', _id: docs[0]._id, ignored: 1 }
  }
}

/*
  TODO!!!
  mode-in is decided between tolerance-in-before and tolerance-in-after
  mode-out is decided between tolerance-after till MAX_WORK_HOURS

  for example: when special time { mode-in: 22:00 and mode-out: 06.00 (tomorrow) }
               then timeIn equal 22:00 and timeOut equal 06:00
*/
const getTimeInOutFromPresence = async (mode, currentDateOfMonth, docsPresences, configTimeInOut, context, params) => {
  const lastDateOfMonth = utils.getLastDatesOfMonth(params.query.month, params.query.year)

  const generateSingleReport = (docPresence) => {
    if(!docPresence) return null

    let docPresenceTimeMoment = moment(docPresence.time)

    var resSingle = {}
    resSingle.id = docPresence._id.toString()
    resSingle.title = docPresenceTimeMoment.format('HH:mm')
    resSingle.start = docPresenceTimeMoment.format('YYYY-MM-DD')
    resSingle.className = (docPresence.mode == 1 ? 'mode-in' : 'mode-out')
    return resSingle
  }

  for(let docPresence of docsPresences) {
    let docTimeMoment = moment(docPresence.time)
    if(mode != docPresence.mode) continue

    if(currentDateOfMonth == docTimeMoment.format('D')) {
      let singleReport = generateSingleReport(docPresence, configTimeInOut)
      return singleReport
    }
  }
  return null
}


// ------------------------------------------------------------------------ module exposure

module.exports.getConfigTimeInOutMonth = getConfigTimeInOutMonth
module.exports.getTimeInOutFromPresence = getTimeInOutFromPresence
module.exports.setModeAuto = setModeAuto
module.exports.setModeManual = setModeManual

// !not used!
module.exports.checkIfExist = checkIfExist