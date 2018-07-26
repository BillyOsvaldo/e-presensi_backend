module.exports = class AbsencesTypesManagement {
  async create(data, params) {
    return await this.app.service('absencestypes').create(data, params)
  }

  async find(params) {
    return await this.app.service('absencestypes').find(params)
  }

  async get(id, params) {
    return await this.app.service('absencestypes').get(id, params)
  }

  async patch(id, data, params) {
    return await this.app.service('absencestypes').patch(id, data, params)
  }

  async remove(id, params) {
    return await this.app.service('absencestypes').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
