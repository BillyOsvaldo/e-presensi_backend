// !Not Used

const errors = require('@feathersjs/errors')
const jwtDecode = require('jwt-decode')

module.exports = (context) => {
  const authorization = context.params.headers.authorization
  const authorizationWithoutBearer = authorization.replace('Bearer ', '')

  try {
    const jwtDecoded = jwtDecode(authorizationWithoutBearer)
    const userId = jwtDecoded.userId
    context.params.epresensiUserId = userId
  } catch (e) {
    throw new errors.BadRequest('No auth')
  }
}