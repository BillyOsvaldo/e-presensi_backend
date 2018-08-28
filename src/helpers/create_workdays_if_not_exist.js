const paramsWithHeaders = require('./headers')
const objectid = require('objectid')

const defaultWorkDay = {
  "monday" : {
    "timeIn" : "07:30", 
    "timeOut" : "16:00"
  }, 
  "tuesday" : {
    "timeIn" : "07:30", 
    "timeOut" : "16:00"
  }, 
  "wednesday" : {
    "timeIn" : "07:30", 
    "timeOut" : "16:00"
  }, 
  "thursday" : {
    "timeIn" : "07:30", 
    "timeOut" : "16:00"
  }, 
  "friday" : {
    "timeIn" : "07:30", 
    "timeOut" : "14:30"
  }, 
  "saturday" : null, 
  "sunday" : null, 
  "organization" : null, 
  "startDate" : new Date("2018-01-01T00:00:00.000+0000"), 
  "endDate" : new Date("3000-01-01"), 
  "createdAt" : new Date("2018-08-26T08:14:25.217+0000"), 
  "updatedAt" : new Date("2018-08-26T08:14:49.872+0000")
}

const createWorkDaysIfNotExist = async (app) => {
  const getDocsOrganizations = async () => {
    const client = require('../hooks/client').getClient(app)
    const organizations = client.service('organizations')
    const params = paramsWithHeaders
    params.query = { $select: ['_id'], $nopaginate: true }
    const res = await organizations.find(params)
    const ids = res.data.map(doc => doc._id.toString())
    return ids
  }

  const createWorkDay = async (idOrganization) => {
    const WorkDays = app.service('workdays').Model
    const where = { organization: objectid(idOrganization) }
    const doc = await WorkDays.findOne(where)
    const alreadyExist = Boolean(doc)
    if(alreadyExist) return

    const newDoc = defaultWorkDay
    newDoc.organization = objectid(idOrganization)
    await WorkDays.create(newDoc)
  }

  const idsOrganizations = await getDocsOrganizations()
  for(let idOrganization of idsOrganizations) {
    await createWorkDay(idOrganization)
  }
}

module.exports = createWorkDaysIfNotExist