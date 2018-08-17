const { authenticate } = require('@feathersjs/authentication').hooks

const permissions = {}

permissions.apiOrJWT = async (context) => {
  try {
    await authenticate('apiKey')(context)
  } catch(e) {
    await authenticate('jwt')(context)
  }
}

module.exports = permissions
