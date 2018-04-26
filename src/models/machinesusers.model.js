// machines-users-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const machinesUsers = new Schema({
    user: { type: mongooseClient.Schema.Types.ObjectId, required: true },
    machine: { type: mongooseClient.Schema.Types.ObjectId, required: true },
    organization: { type: mongooseClient.Schema.Types.ObjectId, required: true },
    status: { type: Boolean, default: false }, // status sudah terdaftar atau belum
  }, {
    timestamps: true,
    versionKey: false
  });

  return mongooseClient.model('machinesUsers', machinesUsers);
};
