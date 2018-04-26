// transactions-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const transactions = new Schema({
    trans_id: { type: Number, required: true },
    dev_id: { type: String, required: true },
    command: { type: Number, required: true },
    command_value: { type: Object, required: true },
    status: { type: Boolean, default: false } // status false means this transaction is not invoked by machine, else is already invoked
  }, {
    timestamps: true,
    versionKey: false
  });

  return mongooseClient.model('transactions', transactions);
};
