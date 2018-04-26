const { authenticate } = require('@feathersjs/authentication').hooks

const permissions = {}

permissions.apiOrJWT = (context) => {
  commonHooks.iffElse(
    // if the specific header is included
    ctx => {
      if(!ctx.params.headers) return false

      ctx.params.headers['x-api-key']
    },
    // authentication with this strategy
    authenticate('apiKey'),
    // else fallback on the jwt strategy
    authenticate(['jwt'])
  )(context)
}

module.exports = permissions
