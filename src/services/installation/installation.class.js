const errors = require('@feathersjs/errors')
const util = require('util')
const fs = require('fs')
const readDir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const path = require('path')

class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    const seedsDir = path.resolve(__dirname, '../../../installation/seeds')

    const collectionJsonList = await readDir(seedsDir)
    for(let filename of collectionJsonList) {
      let content = await readFile(seedsDir + '/' + filename)
      let dataJson = JSON.parse(content.toString())
      let collectionName = filename.replace('.json', '')
      let Model = this.app.service(collectionName).Model

      const doc = await Model.findById(dataJson[0]._id)
      if(doc != null) {
        throw new errors.BadRequest('App already installed')
      }

      await Model.insertMany(dataJson)
    }

    return {
      total: 1,
      skip: 0,
      limit: 1,
      data: [
        { status: 'success' }
      ]
    };
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
