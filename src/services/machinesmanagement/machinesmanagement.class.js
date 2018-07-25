module.exports = class MenusManagement {
  async create(data, params) {
    return await this.app.service('machines').create(data, params)
  }

  async find(params) {
    return await this.app.service('machines').find(params)
  }

  async get(id, params) {
    return await this.app.service('machines').get(id, params)
  }

  async patch(id, data, params) {
    return await this.app.service('machines').patch(id, data, params)
  }

  async remove(id, params) {
    return await this.app.service('machines').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
