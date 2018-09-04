const mongoose = require('mongoose')
const Schema = mongoose.Schema
const usersSchema = require('./users.schema')

module.exports = new Schema({
  user: usersSchema,
  absencestype: { type: Schema.Types.ObjectId, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  desc: { type: String, required: true },
  status: { type: Boolean, required: true }
}, {
  timestamps: true,
  versionKey: false
})