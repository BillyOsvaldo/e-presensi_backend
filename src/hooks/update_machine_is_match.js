const moment = require('moment')

// fill is_match
module.exports = async (context) => {
  // assumed fk_time is timestamp (in seconds)
  const fkTime = context.data.fk_time
  const fkTimeTimestampGlobal = moment(fkTime, 'YYYYMMDDHHmmss').unix()
  //const fkTimeTimestampGlobal = fkTimeTimestampJakarta - (7 * 60 * 60)
  const currentTimestamp = Math.floor((+ new Date()) / 1000)
  const diff = Math.abs(fkTimeTimestampGlobal - currentTimestamp)

  context.data.is_match = Boolean(diff <= 3)
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log('fkTimeTimestampGlobal', fkTimeTimestampGlobal)
  console.log('currentTimestamp', currentTimestamp)
  console.log('diff', diff)
  console.log('context.data.is_match', context.data.is_match)
  console.log('ED ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
}