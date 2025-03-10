const mongoose = require("mongoose");

const classScheduleSchema = new mongoose.Schema({
  scheduledBy: {
    name: {
      type: String,
    },
    id: {
      type: String,
    },
    department: {
      type: String,
    },
  },

  day: {
    type: String,
  },
  classDate: { type: Date },
  classTime: {
    type: String,
  },

  coachName: {
    type: String,
  },
  coachId: {
    type: String,
  },

  program: {
    type: String,
  },
  level: {
    type: String,
  },

  classType: {
    type: String,
  },
  meetingLink: {
    type: String,
  },
  status: {
    type: String,
    default: "Scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: { type: String },
  centerName:{type:String},
  centerId:{type:String},
  selectedStudents: [
    {
      kidId: { type: String },
      chessKid: { type: String },
      kidName: { type: String },
      status: { type: String, default: "Sheduled" },
    },
  ],
});

const ClassSchedule = mongoose.model("ClassSchedule", classScheduleSchema);

module.exports = ClassSchedule;
