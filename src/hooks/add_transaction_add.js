module.exports = async (context) => {
  const transactions = context.app.service('transactions')
  const count = await transactions.Model.count()
  const inc = count + 1
  const commandAdd = 1

  const getUsernameAndName = async () => {
    const users = context.params.client.service('users')
    const profiles = context.params.client.service('profiles')
    const docUser = await users.get(context.data.user)
    const docProfile = await profiles.get(docUser.profile)
    const userName = docProfile.name.first_name + ' ' + docProfile.name.last_name
    const userId = docUser.username
    return { user_id: userId, user_name: userName }
  }

  const data = {
    trans_id: inc,
    dev_id: context.data.dev_id,
    command: commandAdd,
    command_value: await getUsernameAndName()
  }
  await transactions.create(data)
}
