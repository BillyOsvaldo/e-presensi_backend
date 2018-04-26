module.exports = class {
  async create(data, params) {
    return await params.client.service('rolesselect').create(data, params)
  }

  async find(params) {
    return await params.client.service('rolesselect').find(params)
  }

  async get(id, params) {
    return await params.client.service('rolesselect').get(id, params)
  }

  async patch(id, data, params) {
    return await params.client.service('rolesselect').patch(id, data, params)
  }

  async remove(id, params) {
    return await params.client.service('rolesselect').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
