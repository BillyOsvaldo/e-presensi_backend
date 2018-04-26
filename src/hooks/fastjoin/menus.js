const { fastJoin } = require('feathers-hooks-common')
const objectid = require('objectid')

module.exports.permissions = (context) => {
  const client = context.params.client

  const menusResolvers = {
    joins: {
      permissions: () => async menu => {
        if(!menu.permissions.length) {
          menu.permissions = null
          return
        }

        const menuPermissionsArrStr = menu.permissions.map(permissionId => permissionId.toString())
        const menuPermissionsArrStrValid = menuPermissionsArrStr.filter(perm => objectid.isValid(perm))

        const where = { _id: { $in: menuPermissionsArrStrValid } }
        var permissionParams = context.params
        permissionParams.query = where

        const res = await client.service('permissionsmanagement').find(permissionParams)

        menu.permissions = res.data
      },
    }
  }

  return fastJoin(menusResolvers)(context)
}


module.exports.roles = (context) => {
  const client = context.params.client
  const menusResolvers = {
    joins: {
      roles: () => async menu => {
        if(!menu.roles.length) {
          menu.roles = null
          return
        }

        const menuRolesArrStr = menu.roles.map(roleId => roleId.toString())
        const menuRolesArrStrValid = menuRolesArrStr.filter(id => objectid.isValid(id))

        const where = { _id: { $in: menuRolesArrStrValid } }
        var roleParams = context.params
        roleParams.query = where

        const res = await client.service('rolesmanagement').find(roleParams)
        menu.roles = res.data
      },
    }
  }

  return fastJoin(menusResolvers)(context)
}