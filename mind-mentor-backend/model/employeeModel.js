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
    centers: [{
      centerId: { type: String },
      centerName: { type: String }
    }],
    modes: [{ type: String }],
    perHourRate: { type: Number, default: 0 },
    employmentType: { type: String, default: null },
    dob: { type: Date },
    doj: { type: Date },
    bloodGroup: { type: String },
    bankDetails: {
      accountNumber: { type: String },
      panCard: { type: String }, // Storing as string (file path if uploaded, or ID string)
      idCard: { type: String }, // Storing as string (file path)
      emergencyContact: { type: String }
    }
  },
  {
    timestamps: true,
  }
);

// Employee Model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
