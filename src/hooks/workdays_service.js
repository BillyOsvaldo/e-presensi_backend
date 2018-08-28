const errors = require('@feathersjs/errors')
const moment = require('moment-timezone')

moment.tz.setDefault('Asia/Jakarta')

const timesManagementHook = {}

/*
  fill last doc.endDate with (context.data.startDate - 1)
*/
timesManagementHook.fillEndDate = async context => {
  const workDays = context.app.service('workdays')
  const WorkDays = workDays.Model

  const where = {
    endDate: new Date('3000-01-01')
  }
  const lastDoc = await WorkDays.findOne(where)

  // if !lastDoc then context.data.endDate = null
  if(!lastDoc) return

  // minimum context.data.startDate is lastDoc.startDate plus 1 day
  const validate = (lastDoc) => {
    const startDateMoment = moment(context.data.startDate)
    const lastDocStartDateMoment = moment(lastDoc.startDate)

    if(startDateMoment.isBefore(lastDocStartDateMoment)) {
      const errStr = 'Minimum startDate is ' + lastDocStartDateMoment.add({ day: 1 }).format('YYYY-MM-DD')
      throw new errors.BadRequest(errStr)
    }
  }

  const dataStartDateMin1Day = () => {
    const startDateMoment = moment(context.data.startDate)
    startDateMoment.subtract({ day: 1 })
    return startDateMoment.format('YYYY-MM-DD')
  }

  validate(lastDoc)
  const dataUpdate = { endDate: dataStartDateMin1Day() }
  await workDays.patch(lastDoc._id, dataUpdate)
}

module.exports = timesManagementHook
