module.exports = class {
  async create(data, params) {
    return await this.app.service('fingersusers').create(data, params)
  }

  async find(params) {
    return await this.app.service('fingersusers').find(params)
  }

  async get(id, params) {
    return await this.app.service('fingersusers').get(id, params)
  }

  async patch(id, data, params) {
    return await this.app.service('fingersusers').patch(id, data, params)
  }

  async remove(id, params) {
    return await this.app.service('fingersusers').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
