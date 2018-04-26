module.exports = async (context) => {
  const transactions = context.app.service('transactions')
  const count = await transactions.Model.count()
  const inc = count + 1
  const commandRemove = 2

  const getUsername = async () => {
    const users = context.params.client.service('users')
    const profiles = context.params.client.service('profiles')
    const docUser = await users.get(context.data.user)
    const userId = docUser.username
    return { user_id: userId }
  }

  const data = {
    trans_id: inc,
    dev_id: context.data.dev_id,
    command: commandRemove,
    command_value: await getUsername()
  }
  await transactions.create(data)
}
