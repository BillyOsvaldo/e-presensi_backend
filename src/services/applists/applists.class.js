/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    const docs = await params.client.service('applists').find(params);
    return docs
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
