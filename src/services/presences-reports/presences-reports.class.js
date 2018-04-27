const { headers } = require('../../helpers/headers')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {}
  }

  

  // @provide params.organization
  /*
    {
      organization: objectid,
      month: int,
      year: int
    }
  */
  async find (params) {
    const getUsersIds = async () => {
      var params2 = params
      params2.query.$nopaginate = true
      params2.headers = headers
      params2.query.$select = ['_id']

      const docsUsers = await params.client.service('users').find(params2)

      const usersIds = docsUsers.map(doc => doc._id)
      return usersIds
    }

    const usersIds = await getUsersIds()

    return usersIds
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    }
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)))
    }

    return data
  }

  async update (id, data, params) {
    return data
  }

  async patch (id, data, params) {
    return data
  }

  async remove (id, params) {
    return { id }
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options)
}

module.exports.Service = Service
