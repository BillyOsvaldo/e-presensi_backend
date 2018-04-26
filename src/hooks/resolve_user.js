const io = require('socket.io-client')
const feathers = require('@feathersjs/feathers')
const socketio = require('@feathersjs/socketio-client')

const socket = io('http://localhost:3030' ,{
  transports: ['websocket'],
  forceNew: true
})
const client = feathers()

client.configure(socketio(socket))

module.exports = function () {
  return context => {
    console.log('-----------------', context.params)
    const users = client.service('users')
    users.find(context.params).then(console.log).catch(console.error)
    console.log('+++++++++++++++++')
  }
}
