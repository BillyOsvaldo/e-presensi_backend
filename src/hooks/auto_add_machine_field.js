const errors = require('@feathersjs/errors')

module.exports.create = async (context) => {
  const machines = context.app.service('machines')

  const params = { organization: context.data.organization, headers: context.params.headers }
  const docMachineUser = (await machines.find(params)).data[0]

  context.data.machine = docMachineUser._id
  context.data.dev_id = docMachineUser.dev_id
  context.data.user = context.data.user
}

module.exports.remove = async (context) => {
  const machines = context.app.service('machines')
  const machinesUsers = context.app.service('machinesusers')
  const docMachinesUsers = await machinesUsers.get(context.id)
  const machineId = docMachinesUsers.machine
  const docMachines = await machines.get(machineId, context.params)

  context.data = {}
  context.data.machine = docMachines._id
  context.data.dev_id = docMachines.dev_id
  context.data.user = docMachinesUsers.user
}
