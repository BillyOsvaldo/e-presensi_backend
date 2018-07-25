module.exports = async (context) => {
  if(context.result.status) {
    const machinesusers = context.app.service('machinesusersmanagement')
    const users = context.params.client.service('usersformachinesusers')

    const username = context.result.command_value.user_id
    const paramsUser = { query: { username: username }, headers: context.headers }
    const resUsers = await users.find(paramsUser)
    const docUser = resUsers.data[0]
    const idUser = docUser._id

    const headers = { headers: context.params.headers }
    const paramsMachinesUsersFind = { query: { user: idUser }, headers }
    const paramsMachinesUsersPatch = { headers }

    const resMachinesUsers = await machinesusers.find(paramsMachinesUsersFind)
    if(!resMachinesUsers.total) return

    const docMachinesUsers = resMachinesUsers.data[0]
    const dataUpdate = { status: context.result.status }
    await machinesusers.patch(docMachinesUsers._id, dataUpdate, paramsMachinesUsersPatch)
  }
}
