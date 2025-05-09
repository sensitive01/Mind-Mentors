const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["leave", "permission"],
    default: "leave",
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
  },
  leaveStartDate: {
    type: Date,
    required: true,
  },
  leaveEndDate: {
    type: Date, // Optional if it's a permission
  },
  notes: {
    type: String,
  },
  proof: {
    type: String, // URL or file path of uploaded file
  },
  startTime: {
    type: String, // For permission, time in HH:mm format
  },
  endTime: {
    type: String, // For permission, time in HH:mm format
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Leave", LeaveSchema);
