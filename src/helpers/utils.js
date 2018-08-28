const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta')

module.exports.getFullName = (docProfile) => {
  if(!docProfile.name) return ''

  let name = docProfile.name

  var firstTitle
  if(name.first_title) {
    firstTitle = name.first_title + '. '
  } else {
    firstTitle = ''
  }

  var lastTitle
  if(name.last_title) {
    lastTitle = ' ' + name.last_title
  } else {
    lastTitle = ''
  }

  let fullname = `${firstTitle}${name.first_name} ${name.last_name}${lastTitle}`
  return fullname
}

/*
  @return:
    {
      fromStr: 'YYYY-MM-DD HH:mm:ss'
      untilStr: 'YYYY-MM-DD HH:mm:ss'
    }
*/
module.exports.firstDayOfCurrMonthUntilSecondDayOfNextMonth = (argMonth, argYear) => {
  const dateOfMonth = '01'
  const month = argMonth.toString().padStart(2, '0')
  const year = argYear

  const fromMoment = moment(`${ year }-${ month }-${ dateOfMonth }`, 'YYYY-MM-DD')
  const untilMoment = fromMoment.clone()
  untilMoment.add({ month: 1 })
  untilMoment.add({ day: 1 })

  return {
    fromStr: fromMoment.format('YYYY-MM-DD HH:mm:ss'),
    untilStr: untilMoment.format('YYYY-MM-DD HH:mm:ss')
  }
}

/*
  @return:
    {
      fromStr: 'YYYY-MM-DD'
      untilStr: 'YYYY-MM-DD'
    }
*/
module.exports.firstDayOfCurrMonthUntilLastDayOfCurrMonth = (argMonth, argYear) => {
  const dateOfMonth = '01'
  const month = argMonth.toString().padStart(2, '0')
  const year = argYear

  const fromMoment = moment(`${ year }-${ month }-${ dateOfMonth }`, 'YYYY-MM-DD')
  const untilMoment = fromMoment.clone()
  untilMoment.add({ month: 1 })
  untilMoment.subtract({ day: 1 })

  return {
    fromStr: `${ year }-${ month }-${ dateOfMonth }`,
    untilStr: untilMoment.format('YYYY-MM-DD')
  }
}

module.exports.getLastDatesOfMonth = (argMonth, argYear) => {
  const dateOfMonth = '01'
  const month = argMonth.toString().padStart(2, '0')
  const year = argYear

  const ctxMonth = moment(`${ year }-${ month }-${ dateOfMonth }`, 'YYYY-MM-DD')
  const lastDate = moment(ctxMonth).date(0).format('D')
  return lastDate
}

module.exports.getWeekDays = () => {
  return [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ]
}
