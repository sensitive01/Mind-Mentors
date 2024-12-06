const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  leaveStartDate: { type: Date, required: true },
  leaveEndDate: { type: Date, required: true },
  employeeName: { type: String, required: true },
  leaveType: { type: String, required: true },
  empEmail: { type: String },
  status:{type:String,default:'pending'}
});
module.exports = mongoose.model("leaves", LeaveSchema);
