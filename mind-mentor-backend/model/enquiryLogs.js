const mongoose = require("mongoose");

const logEntrySchema = new mongoose.Schema({
  employeeId: { type: String },
  employeeName: { type: String },
  comment: { type: String },
  action: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const logSchema = new mongoose.Schema({
  enqId: { type: mongoose.Schema.Types.ObjectId, ref: "OperationDept", required: true },
  logs: [logEntrySchema], 
});

module.exports = mongoose.model("Log", logSchema);