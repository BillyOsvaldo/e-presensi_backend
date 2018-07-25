// machines-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const machines = new Schema({
    name: { type: String, required: true },
    organization: { type: mongooseClient.Schema.Types.ObjectId, required: true },
    dev_id: { type: String, required: true },
    // from machine
    fk_name: { type: String }, // from machine
    fk_time: { type: String }, // from machine
    fk_info: { type: String }, // from machine
    supported_enroll_data: { type: String }, // from machine
    fk_bin_data_lib: { type: String }, // from machine
    firmware: { type: String }, // from machine
    firmware_filename: { type: String }, // from machine
    fp_data_ver: { type: Number }, // from machine
    is_match: { type: Boolean }
  }, {
    timestamps: true,
    versionKey: false
  });

  return mongooseClient.model('machines', machines);
};
