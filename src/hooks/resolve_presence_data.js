const errors = require('@feathersjs/errors')
const utils = require('../helpers/utils')
const moment = require('moment')
const getParamsWithHeader = require('../helpers/get_params_with_header')

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

  const getUserIdAndOrganization = async () => {
    const getusersbyusername = context.params.client.service('getusersbyusername')
    const doc = await getusersbyusername.get(username, getParamsWithHeader())
    return { userId: doc._id, organization: doc.organization, profileId: doc.profile }
  }

  const getName = async (profileId) => {
    const profiles = context.params.client.service('profiles')
    const doc = await profiles.get(profileId, getParamsWithHeader())
    return utils.getFullName(doc)
  }

  const decideDate = () => {
    const serverDate = new Date()
    const clientDate = getDateTime()

    // if difference between client time and server time is under 10 seconds
    // then use serverDate, else use clientDate
    const diff = (+serverDate) - (+clientDate)
    const diffAbs = Math.abs(diff) // in milliseconds
    if(diffAbs > 10 * 1000) {
      return clientDate
    } else {
      return serverDate
    }
  }

  const { userId, organization, profileId } = await getUserIdAndOrganization()

  context.data.time = decideDate()
  context.data.user = userId
  context.params.organization = organization
  context.params.name = await getName(profileId)

  context.data.status = true
  context.params.status = context.data.status
}