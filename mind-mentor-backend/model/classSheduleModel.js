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
  classDate: {
    type: Date,
  },
  classTime: {
    type: String,
  },
  duration: {
    // New field for class duration
    type: Number, // Duration in minutes
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
  isDemoAdded: {
    type: Boolean,
    default: false,
  },
  meetingLink: {
    type: String,
  },
  isDemo: {
    // New field to indicate if the class is a demo
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    // New field to track last update time
    type: Date,
    default: Date.now,
  },
  createdBy: {
    // New field to track who created the schedule
    type: String,
  },
  notes: {
    // New field for additional notes
    type: String,
  },
  type: {
    type: String,
  },
  centerName: {
    type: String,
  },
  centerId: {
    type: String,
  },
  maximumKidCount: {
    type: Number,
    default: 0,
  },
  enrolledKidCount: {
    type: Number,
    default: 0,
  },
  selectedStudents: [
    {
      kidId: { type: String },
      chessKid: { type: String },
      kidName: { type: String },
      status: { type: String, default: "Scheduled" },
      sheduleId: { type: String },
      sheduledDate: { type: Date },
    },
  ],
  demoAssignedKid: [
    {
      kidId: { type: String },
      chessKid: { type: String },
      kidName: { type: String },
      status: { type: String, default: "Scheduled" },
      sheduleId: { type: String },
      sheduledDate: { type: Date },
    },
  ],
  coachJoinUrl:{type:String},
  kidJoinUrl:{type:String},
  bbTempClassId:{type:String},
  meetingLinkCreated:{type:Boolean,default:false}
});

const ClassSchedule = mongoose.model("ClassSchedule", classScheduleSchema);

module.exports = ClassSchedule;
