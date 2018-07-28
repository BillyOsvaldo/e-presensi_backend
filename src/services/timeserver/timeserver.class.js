const moment = require('moment')

class Service {
  constructor (options) {
    this.options = options || {}
  }

  async find (params) {
    const data = {
      time: moment().format('YYYYMMDDHHmmss')
    }
    return {total:1,limit:1,skip:1,data:data}
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options)
}

module.exports.Service = Service
