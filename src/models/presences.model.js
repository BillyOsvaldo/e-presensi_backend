const presencesSchema = require('./schema/presences.schema')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  return mongooseClient.model('presences', presencesSchema);
};
