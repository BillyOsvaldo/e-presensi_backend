module.exports = async (context) => {
  //if(context.params.$update) return

  const transactions = context.app.service('transactions')
  const count = await transactions.Model.count()
  const inc = count + 1
  const commandGetUserInfo = 3

  const data = {
    dev_id: context.data.dev_id,
    trans_id: inc,
    command: commandGetUserInfo,
    command_value: { user_id: context.data.username }
  }
  await transactions.create(data, context.params)

  context.result.trans_id = inc
}
