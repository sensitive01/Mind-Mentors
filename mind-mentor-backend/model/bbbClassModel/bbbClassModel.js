const mongoose = require("mongoose");

const bbbClassModel = new mongoose.Schema(
  {
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
    checkSum: {
      type: String,
    },
    internalMeetingID: {
      type: String,
    },
    sheduledClassId:{
      type:String
    }
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("bbbClassModel", bbbClassModel);
