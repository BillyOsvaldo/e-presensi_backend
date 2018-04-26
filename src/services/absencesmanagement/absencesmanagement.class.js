module.exports = class AbsencesManagement {
  async create(data, params) {
    return await this.app.service('absences').create(data, params)
  }

  async find(params) {
    return await this.app.service('absences').find(params)
  }

  async get(id, params) {
    return await this.app.service('absences').get(id, params)
  }

  async patch(id, data, params) {
    return await this.app.service('absences').patch(id, data, params)
  }

  async remove(id, params) {
    return await this.app.service('absences').remove(id, params)
  }

  setup(app) {
    this.app = app
  }
}
