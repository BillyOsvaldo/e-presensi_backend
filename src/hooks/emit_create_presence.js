module.exports = (context) => {
  const eventName = 'organization_' + context.params.organization

  const data = {
    _id: context.result._id,
    name: context.params.name,
    time: context.data.time,
    mode: context.data.mode
  }

  context.service.emit(eventName, data)
}
