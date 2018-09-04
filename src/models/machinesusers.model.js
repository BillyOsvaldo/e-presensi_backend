const machinesUsersSchema = require('./schema/machinesusers.schema')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  return mongooseClient.model('machinesusers', machinesUsersSchema);
};
