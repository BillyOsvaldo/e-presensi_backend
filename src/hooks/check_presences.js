const moment = require('moment')
const objectid = require('objectid')
const errors = require('@feathersjs/errors')

module.exports = async (context) => {
  const datetime = context.data.time
  const momentDate = moment(datetime)
  const date = momentDate.format('D')
  const month = momentDate.format('M')
  const year = momentDate.format('YYYY')

  const Presences = context.app.service('presences').Model
  const aggregateData = [
    {
      $project: {
        user: 1,
        time: 1,
        mode: 1,
        dayOfMonth: { $dayOfMonth: '$time'},
        month: { $month: '$time'},
        year: { $year: '$time'},
      }
    },
    {
      $match: {
        $and: [
          { user: objectid(context.data.user) },
          { dayOfMonth: parseInt(date) },
          { month: parseInt(month) },
          { year: parseInt(year) },
          { mode: parseInt(context.data.mode) },
        ]
      }
    }
  ]

  const docs = await Presences.aggregate(aggregateData)

  const exist = Boolean(docs.length)
  if(exist) {
    context.result = { status: 'OK' }
  }
}
