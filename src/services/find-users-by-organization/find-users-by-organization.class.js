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
      let name = docProfile.name

      var firstTitle
      if(name.first_title) {
        firstTitle = ' ' + name.first_title
      } else {
        firstTitle = ''
      }

      let fullname = `${firstTitle}${name.first_name} ${name.last_name} ${name.last_title} `
      doc.name = fullname
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
