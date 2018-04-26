const { fastJoin } = require('feathers-hooks-common')
const objectid = require('objectid')

module.exports.organization = (context) => {
  const client = context.params.client

  const machinesResolvers = {
    joins: {
      organizations: () => async machine => {
        if(!machine.organization) {
          machine.organization = null
          return
        }

        const res = await client.service('organizationsmanagement').get(machine.organization)

        machine.organization = res
      },
    }
  }

  return fastJoin(machinesResolvers)(context)
}
