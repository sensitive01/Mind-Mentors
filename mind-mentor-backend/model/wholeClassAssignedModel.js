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
  status: { type: String, enum: ["scheduled", "cancelled", "rescheduled"] },
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
  studentName: {
    type: String,
  },
  selectedClasses: [
    {
      id: { type: Number },
      day: { type: String },
      startTime: { type: String },
      endTime: { type: String, default: "" },
      coach: { type: String },
      type: { type: String, enum: ["online", "offline", "hybrid"] },
    },
  ],
  generatedSchedule: [scheduleSchema],
  cancelledSessions: [scheduleSchema],
  status:{type:String,default:"Active"}
});

module.exports = mongoose.model("SelectedClass", selectedClassSchema);
