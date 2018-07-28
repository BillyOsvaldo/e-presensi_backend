const moment = require('moment')

// fill is_match
module.exports = async (context) => {
  const Settings = context.app.service('settings').Model

  // assumed fk_time is timestamp (in seconds)
  const fkTime = context.data.fk_time
  const fkTimeTimestampGlobal = moment(fkTime, 'YYYYMMDDHHmmss').unix()
  //const fkTimeTimestampGlobal = fkTimeTimestampJakarta - (7 * 60 * 60)
  const currentTimestamp = Math.floor((+ new Date()) / 1000)
  const diff = Math.abs(fkTimeTimestampGlobal - currentTimestamp)
  const docIntervalSync = await Settings.findOne({ tag: 'interval_synchron' })
  const interval = (docIntervalSync ? docIntervalSync.value : 5)
  console.log('interval', interval)

  context.data.is_match = Boolean(diff <= 5)
}