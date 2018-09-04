const mongoose = require('mongoose')
const Schema = mongoose.Schema
const usersSchema = require('./users.schema')

module.exports = new Schema({
  user: usersSchema,
  status: { type: Boolean, default: true },
  finger: { type: String }
}, {
  timestamps: true,
  versionKey: false
});