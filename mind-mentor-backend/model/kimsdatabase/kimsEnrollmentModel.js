const mongoose = require("mongoose");

const enrollmentKimsSchema = new mongoose.Schema(
  {
    Added_Time: { type: Date },
    Added_User: { type: String },
    Auto_Number: { type: Number },
    ID: { type: String, required: true, index: true },
    Level: { type: String },
    Modified_Time: { type: Date },
    Modified_User: { type: String },
    Record_Status: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EnrollmentKims", enrollmentKimsSchema);
