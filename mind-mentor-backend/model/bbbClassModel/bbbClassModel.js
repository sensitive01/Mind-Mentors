const mongoose = require("mongoose");

const bbbClassModel = new mongoose.Schema({
  classId: {
    type: String,
    required: true,
    unique: true,
  },
  className: {
    type: String,
    required: true,
  },
  coachName: {
    type: String,
  },
  meetingID: {
    type: String,
    required: true,
  },
  started: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
  },
});

module.exports = mongoose.model("bbbClassModel", bbbClassModel);
