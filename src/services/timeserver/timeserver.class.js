const moment = require('moment')

moment.tz.setDefault('Asia/Jakarta')

class Service {
  constructor (options) {
    this.options = options || {}
  }

  async find (params) {
    const data = [{
      time: (+ new Date())
    }]
    return {total:1,limit:1,skip:0,data:data}
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options)
}

module.exports.Service = Service
