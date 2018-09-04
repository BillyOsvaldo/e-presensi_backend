const errors = require('@feathersjs/errors')
const getParamsWithHeader = require('../helpers/get_params_with_header') 

module.exports = async (context) => {
  const users = context.params.client.service('usersmanagement')
  const resUsers = await users.get(context.data.user, context.params)
  if(!resUsers)
    throw new errors.BadRequest('Doc not found')

  context.data.user = resUsers
}