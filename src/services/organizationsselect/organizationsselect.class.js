module.exports = class {
  async create(data, params) {
    return await params.client.service('organizationsselect').create(data, params)
  }

  async find(params) {
    return await params.client.service('organizationsselect').find(params)
  }

  async get(id, params) {
    return await params.client.service('organizationsselect').get(id, params)
  }

  async patch(id, data, params) {
    return await params.client.service('organizationsselect').patch(id, data, params)
  }

  async remove(id, params) {
    return await params.client.service('organizationsselect').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
