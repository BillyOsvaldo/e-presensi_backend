/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    params.query = { organization: params.query.organization }
    params.query.$select = [ '_id', 'user' ]
    params.paginate = false
    const machineUsers = this.app.service('machinesusers')

    const docs = await machineUsers.find(params)
    const result = {
      total : docs.length,
      limit : docs.length,
      skip  : 0,
      data  : docs
    }
    return result
  }

  setup (app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
