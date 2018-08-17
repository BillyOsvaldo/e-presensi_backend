module.exports = async (context) => {
  context.data.user
  context.data.dev_id
  context.data.user
  context.data.dev_id

  const transactions = context.app.service('transactions')

  const getUser = async () => {
    const users = context.app.service('usersformachinesusers')
    const params2 = { query: {} }
    const doc = await users.get(context.data.user, { ...context.params, params2 })
    return doc
  }

  const addTransactionRemove = async () => {
    const count = await transactions.Model.count()
    const inc = count + 1
    const commandRemove = 2

    const getUsername = async () => {
      const users = context.params.client.service('users')
      const docUser = await users.get(context.data.user, context.params)
      const userId = docUser.username
      return { user_id: userId }
    }

    const data = {
      trans_id: inc,
      dev_id: context.data.dev_id,
      command: commandRemove,
      command_value: await getUsername()
    }
    await transactions.create(data, context.params)
  }

  const addTransactionAdd = async () => {
    const count = await transactions.Model.count()
    const inc = count + 1
    const commandAdd = 1

    const getUsernameAndName = async () => {
      const users = context.params.client.service('users')
      const profiles = context.params.client.service('profiles')
      const docUser = await users.get(context.data.user, context.params)
      const docProfile = await profiles.get(docUser.profile, context.params)
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
    await transactions.create(data, context.params)
  }

  const docUser = await getUser()
  const isAdmin = docUser.permissions.length
  if(isAdmin) {
    //await addTransactionRemove()
    await addTransactionAdd()
  }
}
