const errors = require('@feathersjs/errors')
const objectid = require('objectid')

module.exports.ignoreIfExist = async (context) => {
  const MachinesUsers = context.app.service('machinesusers').Model
  const where = { 'user._id': objectid(context.data.user._id) }
  var doc = await MachinesUsers.findOne(where)
  const isExist = Boolean(doc)
  console.log('isExist', isExist)
  if(isExist) {
    doc = JSON.parse(JSON.stringify(doc))
    doc.ignored = true
    context.result = doc
  }
}