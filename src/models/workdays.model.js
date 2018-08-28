// workdays-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const workdays = new Schema({
    organization: {
      type: mongooseClient.Schema.Types.ObjectId
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: new Date('3000-01-01') },
    monday: {
      type: { timeIn: String, timeOut: String },
      default: null
    },
    tuesday: {
      type: { timeIn: String, timeOut: String },
      default: null
    },
    wednesday: {
      type: { timeIn: String, timeOut: String },
      default: null
    },
    thursday: {
      type: { timeIn: String, timeOut: String },
      default: null
    },
    friday: {
      type: { timeIn: String, timeOut: String },
      default: null
    },
    saturday: {
      type: { timeIn: String, timeOut: String },
      default: null
    },
    sunday: {
      type: { timeIn: String, timeOut: String },
      default: null
    }
  }, {
    timestamps: true,
    versionKey: false
  });

  return mongooseClient.model('workdays', workdays);
};
