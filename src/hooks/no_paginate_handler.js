module.exports = (context) => {
  if(!context.params) return
  if(!context.params.query) return

  if(context.params.query.$nopaginate) {
    context.params.paginate = false
    delete context.params.query.$nopaginate
  }
}