module.exports = class {
  async create(data, params) {
    return await this.app.service('machinesusers').create(data, params)
  }

  async find(params) {
    return await this.app.service('machinesusers').find(params)
  }

  async get(id, params) {
    return await this.app.service('machinesusers').get(id, params)
  }

  async patch(id, data, params) {
    return await this.app.service('machinesusers').patch(id, data, params)
  }

  async remove(id, params) {
    return { ignored: true }
    return await this.app.service('machinesusers').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
