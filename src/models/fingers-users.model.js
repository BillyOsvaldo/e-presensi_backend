// fingers-users-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const fingersUsers = new Schema({
    user: { type: mongooseClient.Schema.Types.ObjectId, required: true },
    status: { type: Boolean, default: true },
    finger: { type: String }
  }, {
    timestamps: true,
    versionKey: false
  });

  return mongooseClient.model('fingersUsers', fingersUsers);
};
