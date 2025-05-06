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
    phoneNumber: { type: String }, // Changed from Number to String
    address: { type: String },
    gender: { type: String },
    isPasswordChanged: { type: Boolean, default: false },
    centerName: { type: String, default: null },
    centerId: { type: String, default: null },
    modes: [{ type: String }], // Changed to array
  },
  {
    timestamps: true,
  }
);


// Employee Model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
