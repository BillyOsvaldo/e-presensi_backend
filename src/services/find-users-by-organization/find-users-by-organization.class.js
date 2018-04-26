/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    var params2 = params
    params2.query = {
      organization: params.query.organization,
      $nopaginate: false,
      $select: [ '_id' ]
    }

    const docs = await params.client.service('users').find(params2)
    const result = {
      total : docs.length,
      limit : docs.length,
      skip  : 0,
      data  : docs
    }
    return result
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
