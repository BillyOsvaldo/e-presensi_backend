module.exports = class {
  async create(data, params) {
    return await params.client.service('usersformachinesusers').create(data, params)
  }

  async find(params) {
    return await params.client.service('usersformachinesusers').find(params)
  }

  async get(id, params) {
    params.query.$appid = this.app.get('appid')
    const doc = await params.client.service('usersformachinesusers').get(id, params)
    return doc
  }

  async patch(id, data, params) {
    return await params.client.service('usersformachinesusers').patch(id, data, params)
  }

  async remove(id, params) {
    return await params.client.service('usersformachinesusers').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
