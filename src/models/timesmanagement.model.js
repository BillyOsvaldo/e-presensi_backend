// timesmanagement-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const timesmanagement = new Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    timeIn: { type: String, required: true },
    timeOut: { type: String, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('timesmanagement', timesmanagement);
};
