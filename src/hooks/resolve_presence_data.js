const errors = require('@feathersjs/errors')

module.exports = async (context) => {
  const timeIo = context.data.time_io
  const username = context.data.username

  const getDateTime = () => {
    const year = timeIo[0] + timeIo[1] + timeIo[2] + timeIo[3]
    const month = timeIo[4] + timeIo[5]
    const date = timeIo[6] + timeIo[7]
    const hour = timeIo[8] + timeIo[9]
    const minutes = timeIo[10] + timeIo[11]
    const seconds = timeIo[12] + timeIo[13]
    const dateStr = `${year}-${month}-${date} ${hour}:${minutes}:${seconds}`
    const datetime = new Date(dateStr)
    return datetime
  }

  const getUserId = async () => {
    const getusersbyusername = context.params.client.service('getusersbyusername')
    const doc = await getusersbyusername.get(username)
    return doc._id
  }

  context.data.time = getDateTime()
  context.data.user = await getUserId()
}
