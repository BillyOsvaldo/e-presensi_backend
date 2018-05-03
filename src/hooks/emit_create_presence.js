const moment = require('moment')

module.exports = (context) => {
  if(context.result.already_exist) return

  const eventName = 'organization_' + context.params.organization

  const data = {
    _id: context.result._id,
    name: context.params.name,
    time: context.data.time,
    user: context.data.user,
    mode: parseInt(context.data.mode)
  }

  context.service.emit(eventName, data)

  const configTimeIn = context.app.get('time_in')
  const currentDate = moment().format('YYYY-MM-DD')
  const timeInDateTime = new Date(currentDate + ' ' + configTimeIn)

  if(context.data.mode == 1) {
    var eventCustom
    if(context.data.time < timeInDateTime) {
      eventCustom = eventName + '_tepat_waktu'
      context.service.emit(eventCustom, data)
    } else {
      eventCustom = eventName + '_terlambat'
      context.service.emit(eventCustom, data)
    }
  }
}
