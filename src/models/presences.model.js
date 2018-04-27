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
    time: { type: Date, default: Date.now }
  }, {
    timestamps: false,
    versionKey: false
  });

  return mongooseClient.model('presences', presences);
};
