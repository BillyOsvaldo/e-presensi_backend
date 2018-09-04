const objectid = require('objectid')
const moment = require('moment-timezone')
const getParamsWithHeader = require('../../helpers/get_params_with_header')

moment.tz.setDefault('Asia/Jakarta')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {

    // resolve users
    const collections = ['absences', 'fingersusers', 'machinesusers', 'presences', 'specialtimes']
    for(let collection of collections) {
      let docs = await this.app.service(collection).find(getParamsWithHeader())
      for(let doc of docs.data) {
        const alreadyResolved = !objectid.isValid(doc.user)
        if(alreadyResolved) {
          doc.user = doc.user._id
        }

        const docUser = await params.client.service('usersmanagement').get(doc.user, getParamsWithHeader())
        await this.app.service(collection).patch(doc._id, {user: docUser}, getParamsWithHeader())
      }
    }

    // unset field machinesusers.organization
    const unset = {$unset: {"organization": ""}}
    await this.app.service('machinesusers').Model.update({}, unset, {strict: false})

    // fill presences.workdays
    const docs = await this.app.service('presences').find(getParamsWithHeader())
    for(let doc of docs.data) {
      let workDayMoment = moment().clone()

      workDayMoment.set({
        hours: 0,
        minutes: 0,
        seconds: 0
      })
      let workDay = workDayMoment.format('YYYY-MM-DD HH:mm:ss')
      await this.app.service('presences').patch(doc._id, { workDay }, getParamsWithHeader())
    }

    return { status: 'success' };
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
