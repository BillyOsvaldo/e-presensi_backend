const mongoose = require('mongoose')
const Schema = mongoose.Schema
const usersSchema = require('./users.schema')

module.exports = new Schema({
  user: usersSchema,
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: new Date('3000-01-01') },
  timeIn: { type: String, required: true },
  timeOut: { type: String, required: true }
}, {
  timestamps: true
});