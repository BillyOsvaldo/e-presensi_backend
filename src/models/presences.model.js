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
    workDay: { type: Date, required: true },
    // status is true when current user is absent but he does create presence
    status: { type: Boolean }
  }, {
    timestamps: false,
    versionKey: false
  });

  return mongooseClient.model('presences', presences);
};