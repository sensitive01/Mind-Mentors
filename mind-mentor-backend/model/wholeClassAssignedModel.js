const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  id: { type: Number },
  day: { type: String },
  startTime: { type: String },
  endTime: { type: String, default: "" },
  coach: { type: String },
  type: { type: String,  },
  sessionId: { type: String},
  sessionNumber: { type: Number },
  classDate: { type: Date },
  formattedDate: { type: String },
  status: { type: String,},
});

const selectedClassSchema = new mongoose.Schema({
  kidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "kids",
  },
  enqId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "operationdepts",
  },
  pauseRemarks:{type:String},
  studentName: {
    type: String,
  },
  selectedClasses: {type:Array},
  generatedSchedule: [scheduleSchema],
  cancelledSessions: [scheduleSchema],
  status:{type:String,default:"Active"}
});

module.exports = mongoose.model("SelectedClass", selectedClassSchema);
