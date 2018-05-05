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

module.exports = async (context) => {
  var ret = { timeIn: null, timeOut: null }
  const timesManagement = context.app.service('timesmanagement')
  const TimesManagement = timesManagement.Model
  const Settings = context.app.service('settings').Model

  const currentDate = moment().format('YYYY-MM-DD')

  const query = {
    $and: [
      { startDate: { $lte: new Date(currentDate + ' 00:00:00') } },
      { endDate: { $gte: new Date(currentDate + ' 00:00:00') } }
    ]
  }

  const params = { query }
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