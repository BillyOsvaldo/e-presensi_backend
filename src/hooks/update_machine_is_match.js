// fill is_match
module.exports = async (context) => {
  // assumed fk_time is timestamp (in seconds)
  const fkTime = context.data.fk_time
  const currentTimestamp = Math.floor((+ new Date())/1000)
  const diff = Math.abs(fkTime - currentTimestamp)

  const machines = context.app.service('machines')

  context.data.is_match = Boolean(diff <= 3)
}