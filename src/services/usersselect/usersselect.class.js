module.exports = class {
  async create(data, params) {
    return await params.client.service('usersselect').create(data, params)
  }

  async find(params) {
    return await params.client.service('usersselect').find(params)
  }

  async get(id, params) {
    const doc = await params.client.service('usersselect').get(id, params)
    return doc
  }

  async patch(id, data, params) {
    return await params.client.service('usersselect').patch(id, data, params)
  }

  async remove(id, params) {
    return await params.client.service('usersselect').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
