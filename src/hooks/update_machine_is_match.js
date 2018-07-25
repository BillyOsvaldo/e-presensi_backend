// fill is_match
module.exports = async (context) => {
  // assumed fk_time is timestamp (in seconds)
  const fkTime = context.data.fk_time
  const currentTimestamp = Math.floor((+ new Date())/1000)
  const diff = Math.abs(fkTime - currentTimestamp)

  context.data.is_match = Boolean(diff <= 3)
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log('fkTime', fkTime)
  console.log('currentTimestamp', currentTimestamp)
  console.log('diff', diff)
  console.log('context.data.is_match', context.data.is_match)
  console.log('ED ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
}