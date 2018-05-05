const moment = require('moment')

/*
  method: find
  type: after hook
*/
module.exports = (...fields) => {
  return (context) => {
    for(let doc of context.result.data) {
      for(let field of fields) {
        doc[field] = moment(doc[field]).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
