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
    contactNumber: { type: String },
    whatsappNumber: { type: String },
    isSameAsContact: { type: Boolean },

    email: { type: String },
    message: { type: String },
    source: { type: String },
    kidId: { type: String },
    kidsAge: { type: Number },
    kidsGender: { type: String },
    programs: {
      type: [ProgramSchema],
    },

    intentionOfParents: { type: String },
    schoolName: { type: String },
    address: { type: String },
    schoolPincode: { type: String },
    city: { type: String },
    state: { type: String },
    relationship: { type: String },
    otherRelationship: { type: String },
    pincode: { type: String },

    enquiryStatus: {
      type: String,
      enum: ["Pending", "Qualified Lead", "Unqualified Lead"],
      default: "Pending",
    },

    enquiryType: { type: String, enum: ["warm", "cold"], default: "cold" },
    disposition: {
      type: String,
      enum: ["RnR", "Call Back", "None"],
      default: "None",
    },
    enquiryField: { type: String, default: "enquiryList" },
    payment: {
      type: String,
      enum: ["Pending", "Success", "Requested"],
      default: "Pending",
    },

    notes: { type: String },
    scheduleDemo: {
      status: {
        type: String,
        enum: ["Pending", "Scheduled", "Conducted", "Cancelled","Completed"],
        default: "Pending",
      },
      sheduledDay: { type: String },
    },
    referral: {
      referredTo: { type: String },
      referredEmail: { type: String },
    },
    logs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Log",
    },
    status: { type: String, default: "Pending" },
    paymentLink: { type: String },
    isNewUser :{type:Boolean,default:true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("OperationDept", operationDeptSchema);
