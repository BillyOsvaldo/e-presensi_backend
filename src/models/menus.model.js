// menus-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const menus = new Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    to: { type: String, required: true },
    desc: { type: String, required: true },
    color: { type: String, required: true },
    order: { type: Number, required: true },
    roles: [{
      type: mongooseClient.Schema.Types.ObjectId,
      ref: 'roles'
    }],
    permissions: [{
      type: mongooseClient.Schema.Types.ObjectId,
      ref: 'permissions'
    }]
  }, {
    timestamps: true
  });

  return mongooseClient.model('menus', menus);
};
