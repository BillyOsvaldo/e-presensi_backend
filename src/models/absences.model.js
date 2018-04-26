// Absences-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const absences = new Schema({
    user: { type: mongooseClient.Schema.Types.ObjectId, required: true },
    absencestype: { type: mongooseClient.Schema.Types.ObjectId, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    desc: { type: String, required: true },
    status: { type: Boolean, required: true }
  }, {
    timestamps: true,
    versionKey: false
  });

  return mongooseClient.model('absences', absences);
};
