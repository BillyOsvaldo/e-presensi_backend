module.exports = class {
  async create(data, params) {
    return await params.client.service('usersmanagement').create(data, params)
  }

  async find(params) {
    return await params.client.service('usersmanagement').find(params)
  }

  async get(id, params) {
    params.query.$appid = this.app.get('appid')
    const doc = await params.client.service('usersmanagement').get(id, params)
    return doc
  }

  async patch(id, data, params) {
    return await params.client.service('usersmanagement').patch(id, data, params)
  }

  async remove(id, params) {
    return await params.client.service('usersmanagement').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
