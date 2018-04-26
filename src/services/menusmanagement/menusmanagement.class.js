module.exports = class MenusManagement {
  async create(data, params) {
    return await this.app.service('menus').create(data, params)
  }

  async find(params) {
    return await this.app.service('menus').find(params)
  }

  async get(id, params) {
    return await this.app.service('menus').get(id, params)
  }

  async patch(id, data, params) {
    return await this.app.service('menus').patch(id, data, params)
  }

  async remove(id, params) {
    return await this.app.service('menus').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
