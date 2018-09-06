/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async get (organizationId, params) {
    const MachinesUsers = this.app.service('machinesusers').Model

    const aggregateData = [
      { $unwind: '$user.organizationuser.organization' },
      { $group: { _id: '$user.organizationuser.organization' } }
    ]

    const docs = await MachinesUsers.aggregate(aggregateData)
    const docsWithoutId = docs.map(doc => doc._id)

    return {
      _id: docsWithoutId[0]._id,
      name: docsWithoutId[0].name
    };
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
