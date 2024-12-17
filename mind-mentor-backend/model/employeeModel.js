const mongoose = require("mongoose");

// Employee Schema
const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,

      trim: true,
    },
    email: {
      type: String,

      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    department: {
      type: String,
    },
    role: {
      type: String,
      default: "employee",
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Employee Model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
