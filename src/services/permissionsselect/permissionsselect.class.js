module.exports = class {
  async create(data, params) {
    return await params.client.service('permissionsselect').create(data, params)
  }

  async find(params) {
    return await params.client.service('permissionsselect').find(params)
  }

  async get(id, params) {
    return await params.client.service('permissionsselect').get(id, params)
  }

  async patch(id, data, params) {
    return await params.client.service('permissionsselect').patch(id, data, params)
  }

  async remove(id, params) {
    return await params.client.service('permissionsselect').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
