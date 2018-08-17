const utils = require('../../helpers/utils')
const moment = require('moment-timezone')
const objectid = require('objectid')
const { headers } = require('../../helpers/headers')

moment.tz.setDefault('Asia/Jakarta')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    const datetime = new Date()
    const momentDate = moment(datetime)
    const date = momentDate.format('D')
    const month = momentDate.format('M')
    const year = momentDate.format('YYYY')

    const Presences = this.app.service('presences').Model

    const getDocsUsers = async () => {
      var params2 = {
        query: {
          organization: params.query.organization,
          $nopaginate: true,
          $select: ['_id', 'position']
        },
        headers: params.headers
      }

      const docsUsers = await params.client.service('users').find(params2)
      return docsUsers
    }

    const docsUsers = await getDocsUsers()
    const usersIds = docsUsers.map(doc => objectid(doc._id))

    const aggregateData = [
      {
        $project: {
          user: 1,
          time: 1,
          mode: 1,
          dayOfMonth: { $dayOfMonth: '$time'},
          month: { $month: '$time'},
          year: { $year: '$time'},
          status: 1
        }
      },
      {
        $match: {
          $and: [
            { user: { $in: usersIds } },
            { dayOfMonth: parseInt(date) },
            { month: parseInt(month) },
            { year: parseInt(year) },
            { status: true }
          ]
        }
      },
      { $sort: params.query.$sort || { time: -1 } }
    ]

    const docs = await Presences.aggregate(aggregateData)
    for(let doc of docs) {
      let docUsers = await params.client.service('users').get(doc.user, params)
      let docProfile = await params.client.service('profiles').get(docUsers.profile, params)
      doc.name = utils.getFullName(docProfile)

      delete doc.dayOfMonth
      delete doc.month
      delete doc.year
    }
    return docs
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
