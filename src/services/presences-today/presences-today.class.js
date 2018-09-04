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
    const Presences = this.app.service('presences').Model

    const aggregateData = [
      {
        $project: {
          user: 1,
          time: 1,
          mode: 1,
          workDay: 1,
          status: 1
        }
      },
      {
        $match: {
          $and: [
            { 'user.organizationuser.organization._id': objectid(params.query.organization) },
            { workDay: new Date(utils.getTodayDateZeroTime()) },
            { status: true }
          ]
        }
      },
      { $sort: params.query.$sort || { time: -1 } }
    ]

    const docsPresences = await Presences.aggregate(aggregateData)
    for(let docPresence of docsPresences) {
      docPresence.name = utils.getFullName(docPresence.user.profile)

      delete docPresence.dayOfMonth
      delete docPresence.month
      delete docPresence.year
    }
    return docsPresences
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
