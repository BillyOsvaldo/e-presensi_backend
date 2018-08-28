/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async create(data, params) {
    return await this.app.service('workdays').create(data, params)
  }

  async find(params) {
    return await this.app.service('workdays').find(params)
  }

  async get(id, params) {
    return await this.app.service('workdays').get(id, params)
  }

  async patch(id, data, params) {
    return await this.app.service('workdays').patch(id, data, params)
  }

  async remove(id, params) {
    return await this.app.service('workdays').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
