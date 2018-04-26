const { fastJoin } = require('feathers-hooks-common')
const objectid = require('objectid')

module.exports.user = (context) => {
  const client = context.params.client

  const machinesResolvers = {
    joins: {
      users: () => async machine => {
        if(!machine.user) {
          machine.user = null
          return
        }

        // profile, organization, username

        const res = await client.service('usersformachinesusers').get(machine.user, context.params)

        machine.user = res
      },
    }
  }

  return fastJoin(machinesResolvers)(context)
}

module.exports.machine = (context) => {
  const machinesResolvers = {
    joins: {
      machines: () => async machine => {
        if(!machine.machine) {
          machine.machine = null
          return
        }

        const res = await context.app.service('machinesmanagement').get(machine.machine, context.params)

        machine.machine = res
      },
    }
  }

  return fastJoin(machinesResolvers)(context)
}

module.exports.fingersusers = (context) => {
  const machinesResolvers = {
    joins: {
      fingersusers: () => async machineuser => {
        machineuser.fingersusers = null

        var params = JSON.parse(JSON.stringify(context.params)) // feathers bug
        params.query = { user: machineuser.user }
        const res = await context.app.service('fingersusers').find(params)

        if(!res.total) return

        machineuser.fingersusers = res.data[0]
      },
    }
  }

  return fastJoin(machinesResolvers)(context)
}
