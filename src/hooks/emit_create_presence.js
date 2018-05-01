module.exports = (context) => {
  // emit_create_presence
  console.log('context.params.organization', context.params.organization)
  const data = {
    user: context.data.user,
    time: context.data.time
  }
  console.log('data', data)

  context.app.service('presences').emit('organization', {
    type: 'organization',
    data: data
  })
}
