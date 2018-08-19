const moment = require('moment-timezone')
const objectid = require('objectid')
const errors = require('@feathersjs/errors')

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

const getDefaultTimeInOut = async (ctxDate, context) => {
  const ctxDateObj = new Date(ctxDate)
  const TimesManagement = context.app.service('timesmanagement').Model

  const where = {
    endDate: { $gte: ctxDateObj },
    startDate: { $lte: ctxDateObj }
  }

  const doc = await TimesManagement.findOne(where)
  return doc
}

/*
  @params:
    userId int
    ctxDate String (YYYY-MM-DD)
  @return: { timeIn: EpresTime, timeOut: EpresTime }
*/
const getConfigTimeInOut = async (userId, ctxDate, context) => {
  const defautTimeInOut = await getDefaultTimeInOut(ctxDate, context)
  const { isUseSpecialTime, specialTimeInOut } = await getSpecialTime(userId, ctxDate, context)
  const dateTodayStr = (MOCK_CURRENT_DATE ? MOCK_CURRENT_DATE : moment().format('YYYY-MM-DD'))

  var timeIn, timeOut

  if(isUseSpecialTime) {
    timeIn = specialTimeInOut.timeIn
    timeOut = specialTimeInOut.timeOut
  } else {
    timeIn = defautTimeInOut.timeIn
    timeOut = defautTimeInOut.timeOut
  }

  var res = {}
  res.timeIn = new EpresTime(dateTodayStr + ' ' + timeIn)
  res.timeOut = new EpresTime(dateTodayStr + ' ' + timeOut)
  return res
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
    const isModeIn = userTimeIn.moment.clone().isBetween(toleranceBefore, toleranceAfter)
    return (isModeIn ? 1 : null)
  } else {
    // tolerance mode out is between time in and MAX_WORK_HOUR hour after
    const timeInMoment = configTimeInOut.timeIn.moment
    const toleranceBefore = timeInMoment.clone()
    const toleranceAfter  = timeInMoment.clone().add(MAX_WORK_HOUR, 'hour')
    const isModeOut = userTimeIn.moment.clone().isBetween(toleranceBefore, toleranceAfter)
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

// ------------------------------------------------------------------------ module exposure

module.exports.setMode = async (context) => {
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

// !not used!
module.exports.checkIfExist = async (context) => {
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
