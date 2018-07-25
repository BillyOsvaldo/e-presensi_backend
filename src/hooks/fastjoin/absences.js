const { fastJoin } = require('feathers-hooks-common')
const objectid = require('objectid')

module.exports.user = (context) => {
  const client = context.params.client

  const absencesResolver = {
    joins: {
      users: () => async absence => {
        if(!absence.user) {
          absence.user = null
          return
        }

        // profile, organization, username

        const res = await client.service('usersformachinesusers').get(absence.user, context.params)

        absence.user = res
      },
    }
  }

  return fastJoin(absencesResolver)(context)
}

module.exports.absencestype = (context) => {
  const absencesResolver = {
    joins: {
      machines: () => async absence => {
        if(!absence.absencestype) {
          absence.absencestype = null
          return
        }

        const res = await context.app.service('absencestypesmanagement').get(absence.absencestype, context.params)

        absence.absencestype = res
      },
    }
  }

  return fastJoin(absencesResolver)(context)
}