const errors = require('@feathersjs/errors')
const getParamsWithHeader = require('../helpers/get_params_with_header')

module.exports.updateIfExist = async (context) => {
  const fingersUsers = context.app.service('fingersusers')
  const query = { 'user._id': context.data.user }
  const params = { query: query, headers: context.params.headers }
  const docs = await fingersUsers.find(params)

  // not found, then create
  if(!docs.total) return

  const firstDoc = docs.data[0]
  const dataUpdate = {
    username: context.data.username,
    dev_id: context.data.dev_id,
    finger: context.data.finger
  }

  const docPatched = await fingersUsers.patch(firstDoc._id, dataUpdate, getParamsWithHeader())
  context.result = docPatched
  context.params.$update = true
}
