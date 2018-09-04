const specialTimesSchema = require('./schema/specialtimes.schema')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  return mongooseClient.model('specialtimes', specialTimesSchema);
};
