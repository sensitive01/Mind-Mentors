const mongoose = require("mongoose");

// Employee Schema
const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    email: { type: String },
    password: { type: String },
    department: { type: String },
    role: { type: String, default: "employee" },
    status: { type: String, default: "Active" },
    phoneNumber: { type: String },
    address: { type: String },
    gender: { type: String },
    isPasswordChanged: { type: Boolean, default: false },
    centerName: { type: String, default: null },
    centerId: { type: String, default: null },
    modes: [{ type: String }], 
    perHourRate: { type: Number, default: 0 },
    employmentType: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Employee Model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
