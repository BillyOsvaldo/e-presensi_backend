// AbsencesTypes-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const absencesTypes = new Schema({
    name: { type: String, required: true },
    desc: { type: String }
  }, {
    timestamps: true,
    versionKey: false
  });

  return mongooseClient.model('absencesTypes', absencesTypes);
};
