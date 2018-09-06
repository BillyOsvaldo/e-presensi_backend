const moment = require('moment')
const getTimeInTimeOut = require('../helpers/get_time_in_time_out')

module.exports = async (context) => {
  if(!context.params.status || context.result.ignored) return

  const eventName = 'organization_' + context.params.organization

  const data = {
    _id: context.result._id,
    name: context.params.name,
    time: context.data.time,
    user: context.data.user._id,
    mode: parseInt(context.data.mode),
    organization: context.params.organization
  }

  context.service.emit(eventName, data)

  const { timeIn, timeOut } = await getTimeInTimeOut(context)
  const configTimeIn = timeIn
  const currentDate = moment().format('YYYY-MM-DD')
  const timeInDateTime = new Date(currentDate + ' ' + configTimeIn)

  if(context.data.mode == 1) {
    var eventCustom
    if(context.data.time < timeInDateTime) {
      eventCustom = eventName + '_tepat_waktu'
      context.service.emit(eventCustom, data)
      context.service.emit('tepat_waktu', data)
      context.service.emit('organization_tepat_waktu', data)
    } else {
      eventCustom = eventName + '_terlambat'
      context.service.emit('terlambat', data)
      context.service.emit(eventCustom, data)
      context.service.emit('organization_terlambat', data)
    }
  }
}
