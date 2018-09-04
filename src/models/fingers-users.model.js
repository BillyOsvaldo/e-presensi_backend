const fingersUsersSchema = require('./schema/fingers-users.schema')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  return mongooseClient.model('fingersUsers', fingersUsersSchema);
};
