const moment = require('moment')

// fill is_match
module.exports = async (context) => {
  console.log('context.params.status', context.params.status)
  if(!context.params.status) {
    throw new Error('Machine not match')
  }
}