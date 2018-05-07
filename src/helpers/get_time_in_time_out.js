const moment = require('moment')

/*
  if today is between startDate and endDate
    then timeIn and timeOut is overriden
  else
    then timeIn=settings.'Jam Masuk'

  tes #1
    start date 05-05-2018 00:00:00
    end date   05-05-2018 00:00:00

    current date 09-05-2018 08:00

  tes #2
    start date 02-05-2018 00:00:00
    end date   10-05-2018 00:00:00

    current date 05-05-2018 08:00

*/

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate()
}

const getTimeInTimeOut = async (context, currentDateStr = null) => {
  var ret = { timeIn: null, timeOut: null }
  const timesManagement = context.app.service('timesmanagement')
  const TimesManagement = timesManagement.Model
  const Settings = context.app.service('settings').Model

  if(currentDateStr === null)
    currentDateStr = moment().format('YYYY-MM-DD')

  const query = {
    $and: [
      { startDate: { $lte: new Date(currentDateStr + ' 00:00:00') } },
      { endDate: { $gte: new Date(currentDateStr + ' 00:00:00') } }
    ]
  }

  const docs = await TimesManagement.find(query)
  if(docs.length) {
    var doc = docs[0]
    ret.timeIn = doc.timeIn
    ret.timeOut = doc.timeOut
  } else {
    var docTimeIn = await Settings.findOne({ name: 'Jam Masuk' })
    var docTimeOut = await Settings.findOne({ name: 'Jam Keluar' })
    ret.timeIn = docTimeIn.value
    ret.timeOut = docTimeOut.value
  }

  return ret
}

/*
  @return:
    {
      "1": { timeIn: '07.30', timeOut: '14.00' },
      "2": { timeIn: '07.30', timeOut: '14.00' },
      ...
      "31": { timeIn: '08.30', timeOut: '14.00' }
    }
*/
const getByMonth = async (monthPad, year, context) => {
  var ret = []

  const daysInMonth = getDaysInMonth(monthPad, year)
  for(let dateCounter = 1; dateCounter <= daysInMonth; dateCounter++) {

    // format $day is 01, 02, 03 ... 30, 31
    let day = dateCounter.toString().padStart(2, '0')

    const dateStr = year + '-' + monthPad + '-' + day
    const timeInTimeOut = await getTimeInTimeOut(context, dateStr)
    ret[dateCounter] = timeInTimeOut
  }

  return ret
}

module.exports = getTimeInTimeOut
module.exports.getByMonth = getByMonth
