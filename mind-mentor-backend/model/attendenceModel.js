const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    kidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kid", 
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"], 
      required: true,
    },
    checkInTime: {
      type: String, 
    },
    checkOutTime: {
      type: String,
    },
    remarks: {
      type: String,
      trim: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coach",
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
