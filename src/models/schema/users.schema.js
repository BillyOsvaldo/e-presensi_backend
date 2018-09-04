const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  _id: Schema.Types.ObjectId,
  profile: {
    name: {
      first_name: String,
      first_title: String,
      last_name: String,
      last_title: String
    },
    nip: String
  },
  username: String,
  email: String,
  organizationuser: {
    organization: {
      _id: Schema.Types.ObjectId,
      name: String
    }
  },
  position: {
    order: { type: Number, default: 9999999 }
  }
})