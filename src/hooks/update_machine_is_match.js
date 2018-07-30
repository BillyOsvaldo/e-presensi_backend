const moment = require('moment')

// fill is_match
module.exports = async (context) => {
  const Settings = context.app.service('settings').Model
  console.log('----------------------------------')

  // assumed fk_time is timestamp (in seconds)
  const fkTime = context.data.fk_time
  const fkTimeTimestampGlobal = moment(fkTime, 'YYYYMMDDHHmmss').unix()
  //const fkTimeTimestampGlobal = fkTimeTimestampJakarta - (7 * 60 * 60)
  const currentTimestamp = Math.floor((+ new Date()) / 1000)
  const diff = Math.abs(fkTimeTimestampGlobal - currentTimestamp)
  const docIntervalSync = await Settings.findOne({ tag: 'interval_synchron' })
  const interval = (docIntervalSync ? docIntervalSync.value : 5)
  console.log('setting_interval', interval)
  console.log('diff between machine and server', diff)

  const isMatch = Boolean(diff <= interval)
  console.log('isMatch', isMatch)
  if(isMatch) {
    context.data.is_match = isMatch
  } else {
    const docMachine = await context.app.service('machines').get(context.id)
    const currentFkTime = docMachine.fk_time
    console.log('after offline')
    console.log('currentFkTime', currentFkTime)
    console.log('context.data.fk_time', context.data.fk_time)
    const isMatch2 = currentFkTime == context.data.fk_time
    context.data.is_match = isMatch2
  }

  console.log('context.data.is_match', context.data.is_match)
}