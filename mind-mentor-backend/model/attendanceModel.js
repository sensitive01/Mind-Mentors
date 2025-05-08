const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  loginTime: {
    type: String,
  },
  logoutTime: {
    type: String,
  },
  empId: {
    type: String,
  },
  empName: {
    type: String,
  },
  department: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"],
  },
  isLoginMarked: { type: Boolean, default: false },
  isLogoutMarked: { type: Boolean, default: false },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
