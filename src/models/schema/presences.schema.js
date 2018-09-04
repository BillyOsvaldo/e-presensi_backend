const mongoose = require('mongoose')
const Schema = mongoose.Schema
const usersSchema = require('./users.schema')

module.exports = new Schema({
  user: usersSchema,
  time: { type: Date, default: Date.now },
  mode: { type: Number, required: true }, // mode 1 = masuk, mode 2 = pulang
  workDay: { type: Date, required: true },
  // status is true when current user is absent but he does create presence
  status: { type: Boolean }
}, {
  timestamps: false,
  versionKey: false
});