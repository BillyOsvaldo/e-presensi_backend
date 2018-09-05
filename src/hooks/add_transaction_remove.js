module.exports = async (context) => {
  if(context.result.ignored) return

  const transactions = context.app.service('transactions')
  const count = await transactions.Model.count()
  const inc = count + 1
  const commandRemove = 2

  const data = {
    trans_id: inc,
    dev_id: context.data.dev_id,
    command: commandRemove,
    command_value: { user_id: context.data.user.username }
  }

  await transactions.create(data, context.params)
}
