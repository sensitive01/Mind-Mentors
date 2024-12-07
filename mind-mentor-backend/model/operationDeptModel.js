const mongoose = require("mongoose");
const ProgramSchema = new mongoose.Schema({
  program: { type: String },
  level: { type: String },
});

const operationDeptSchema = new mongoose.Schema(
  {
    parentFirstName: { type: String },
    parentLastName: { type: String },
    kidFirstName: { type: String },
    kidLastName: { type: String },
    whatsappNumber: { type: String },
    email: { type: String },
    message: { type: String },
    source: { type: String },
    kidsAge: { type: Number },
    kidsGender: { type: String },
    programs: {
      type: [ProgramSchema],
    },

    intentionOfParents: { type: String },
    schoolName: { type: String },
    address: { type: String },
    schoolPincode: { type: String },

    enquiryStatus: {
      type: String,
      enum: ["Pending", "Qualified Lead", "Unqualified Lead"],
      default: "Pending",
    },
    enquiryType: { type: String, enum: ["warm", "cold"], default: "warm" },
    disposition: {
      type: String,
      enum: ["RnR", "Call Back", "None"],
      default: "None",
    },
    enquiryField:{type:String,default:"enquiryList"},
    payment: { type: String, enum: ["Pending", "Success"], default: "Pending" },

    notes: { type: String },
    scheduleDemo: {
      status: {
        type: String,
        enum: ["Pending", "Scheduled", "Completed", "Cancelled"],
        default: "Pending",
      },
      sheduledDate: { type: Date },
    },
    referral: {
      referredTo: { type: String },
      referredEmail: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OperationDept", operationDeptSchema);
