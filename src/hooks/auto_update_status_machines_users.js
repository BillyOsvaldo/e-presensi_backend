const getParamsWithHeader = require('../helpers/get_params_with_header')

module.exports = async (context) => {
  if(context.result.status) {
    const machinesusers = context.app.service('machinesusersmanagement')
    const users = context.params.client.service('usersformachinesusers')

    const username = context.result.command_value.user_id
    const paramsUser = { query: { username: username } }
    const resUsers = await users.find(getParamsWithHeader(paramsUser))
    const docUser = resUsers.data[0]
    const idUser = docUser._id

    const paramsMachinesUsersFind = { query: { user: idUser } }
    const resMachinesUsers = await machinesusers.find(getParamsWithHeader(paramsMachinesUsersFind))
    if(!resMachinesUsers.total) return

    const docMachinesUsers = resMachinesUsers.data[0]
    const dataUpdate = { status: context.result.status }
    await machinesusers.patch(docMachinesUsers._id, dataUpdate, getParamsWithHeader(context.params))
  }
}
