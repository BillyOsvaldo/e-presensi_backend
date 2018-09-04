const errors = require('@feathersjs/errors')
const moment = require('moment-timezone')

moment.tz.setDefault('Asia/Jakarta')

const specialTimesHook = {}

/*
  fill last doc.endDate with (context.data.startDate - 1)
*/
specialTimesHook.fillEndDate = async context => {
  const specialtimes = context.app.service('specialtimes')
  const SpecialTimes = specialtimes.Model

  const where = {
    'user._id': context.data.user,
    endDate: new Date('3000-01-01')
  }
  const lastDoc = await SpecialTimes.findOne(where)

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
  await specialtimes.patch(lastDoc._id, dataUpdate)
}

module.exports = specialTimesHook
