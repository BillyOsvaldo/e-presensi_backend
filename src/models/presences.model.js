// presences-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const presences = new Schema({
    user: {
      type: mongooseClient.Schema.Types.ObjectId,
      required: true
    },
    time: { type: Date, default: Date.now },
    mode: { type: Number, required: true }, // mode 1 = masuk, mode 2 = pulang
    // field status: wheter the presence is match between machine time and server time
    // clone data from machines.is_match
    status: { type: Boolean }
  }, {
    timestamps: false,
    versionKey: false
  });

  return mongooseClient.model('presences', presences);
};