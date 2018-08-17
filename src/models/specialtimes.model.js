// specialtimes-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const specialtimes = new Schema({
    user: { type: mongooseClient.Schema.Types.ObjectId, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: new Date('3000-01-01') },
    timeIn: { type: String, required: true },
    timeOut: { type: String, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('specialtimes', specialtimes);
};
