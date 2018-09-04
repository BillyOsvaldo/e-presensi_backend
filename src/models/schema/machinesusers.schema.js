const mongoose = require('mongoose')
const Schema = mongoose.Schema
const usersSchema = require('./users.schema')

module.exports = new Schema({
  user: usersSchema,
  machine: { type: Schema.Types.ObjectId, required: true },
  status: { type: Boolean, default: false }, // status sudah terdaftar atau belum
}, {
  timestamps: true,
  versionKey: false
});