module.exports = async (context) => {
  const transactions = context.app.service('transactions')
  const count = await transactions.Model.count()
  const inc = count + 1
  const commandAdd = 1

  const getUsernameAndName = async () => {
    const users = context.params.client.service('users')
    const profiles = context.params.client.service('profiles')
    const userName = context.data.user.profile.name.first_name + ' ' + context.data.user.profile.name.last_name
    const userId = context.data.user.username
    return { user_id: userId, user_name: userName }
  }

  const data = {
    trans_id: inc,
    dev_id: context.data.dev_id,
    command: commandAdd,
    command_value: await getUsernameAndName()
  }

  await transactions.create(data, context.params)
}
