const errors = require('@feathersjs/errors')

module.exports.updateIfExist = async (context) => {

  const fingersUsers = context.app.service('fingersusers')
  const user = context.data.user
  const params = { query: { user: user }, headers: context.params.headers }
  const docs = await fingersUsers.find(params)

  // not found, then create
  if(!docs.total) return

  const firstDoc = docs.data[0]
  const dataUpdate = {
    username: context.data.username,
    dev_id: context.data.dev_id,
    finger: context.data.finger
  }

  const docPatched = await fingersUsers.patch(firstDoc._id, dataUpdate, context.params)
  context.result = docPatched
  context.params.$update = true
}
