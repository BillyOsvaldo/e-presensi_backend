const whiteListHeader = [ 'x-api-key', 'authorization' ]

module.exports = (context) => {
  for(let headerKey in context.params.headers) {
    if(!whiteListHeader.includes(headerKey.toLowerCase())) {
      delete context.params.headers[headerKey]
    }
  }
}