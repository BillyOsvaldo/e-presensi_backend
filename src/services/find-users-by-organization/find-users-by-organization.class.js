const utils = require('../../helpers/utils')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {

    const profiles = params.client.service('profiles')

    var params2 = params
    params2.query = {
      organization: params.query.organization,
      $nopaginate: false,
      $select: [ '_id', 'profile' ]
    }

    var docs = await params.client.service('users').find(params2)

    for(let doc of docs) {
      if(!doc.profile) {
        doc.name = ''
        continue
      }

      let docProfile = await profiles.get(doc.profile)
      doc.name = utils.getFullName(docProfile)
    }

    const result = {
      total : docs.length,
      limit : docs.length,
      skip  : 0,
      data  : docs
    }
    return result
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
