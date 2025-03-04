const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  leaveStartDate: { type: Date, },
  leaveEndDate: { type: Date, },
  employeeName: { type: String, },
  leaveType: { type: String, },
  notes: { type: String, },
  proof: { type: String },
  empId: { type: String },

  status:{type:String,default:'pending'}
},{timestamps:true});
module.exports = mongoose.model("leaves", LeaveSchema);
