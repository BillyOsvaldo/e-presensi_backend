const absencesSchema = require('./schema/absences.schema')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  return mongooseClient.model('absences', absencesSchema);
};
