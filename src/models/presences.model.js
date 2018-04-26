// presences-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const presences = new Schema({
    user_id: {
      type: mongooseClient.Schema.Types.ObjectId,
      ref: 'organizations',
      required: true
    },
    time_in: { type: Date, default: Date.now },
    time_out: { type: Date }
  }, {
    timestamps: false,
    versionKey: false
  });

  return mongooseClient.model('presences', presences);
};
