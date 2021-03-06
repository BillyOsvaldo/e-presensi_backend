const moment = require('moment')

// fill is_match
module.exports = async (context) => {
  const Settings = context.app.service('settings').Model

  // assumed fk_time is timestamp (in seconds)
  const fkTime = context.data.fk_time
  const fkTimeTimestampGlobal = moment(fkTime, 'YYYYMMDDHHmmss').unix()
  const currentTimestamp = Math.floor((+ new Date()) / 1000)
  const diff = Math.abs(fkTimeTimestampGlobal - currentTimestamp)
  const docIntervalSync = await Settings.findOne({ tag: 'interval_synchron' })
  const interval = (docIntervalSync ? docIntervalSync.value : 5)

  const isMatch = Boolean(diff <= interval)
  if(isMatch) {
    context.data.is_match = isMatch
  } else {
    const docMachine = await context.app.service('machines').get(context.id, context.params)
    const currentFkTime = docMachine.fk_time
    const isMatch2 = currentFkTime == context.data.fk_time
    context.data.is_match = isMatch2
  }
}