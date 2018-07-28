/*
  type:
    timepicker
    string
*/

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const settings = new Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    tag: { type: String, default: '' },
    type: { type: String }
  }, {
    timestamps: true
  });

  return mongooseClient.model('settings', settings);
};
