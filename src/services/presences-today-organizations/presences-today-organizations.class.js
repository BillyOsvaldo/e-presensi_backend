/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    const MachinesUsers = this.app.service('machinesusers').Model
    const presencestodaysummary = this.app.service('presencestodaysummary')

    const aggregateData = [
      { $unwind: '$user.organizationuser.organization' },
      { $group: { _id: '$user.organizationuser.organization' } }
    ]

    const docs = await MachinesUsers.aggregate(aggregateData)
    const docsWithoutId = docs.map(doc => doc._id)

    for(let docOrg of docsWithoutId) {
      let params = {
        query: {
          organization: docOrg._id.toString()
        }
      }
      let docsSummary = await presencestodaysummary.find(params)
      docOrg.summary = docsSummary.data[0]
    }

    return docsWithoutId;
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
