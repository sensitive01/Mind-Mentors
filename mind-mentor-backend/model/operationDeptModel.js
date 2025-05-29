const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  program: { type: String },
  level: { type: String },
  status: { type: String, default: "Enquiry Kid" }, // enquiry,Active kid, deactive kid
  enrolledDate: { type: Date },
  totalClass: { type: Number, default: 0 },
  attendedClass: { type: Number, default: 0 },
  remainingClass: { type: Number, default: 0 },
  centerName: { type: String },
  centerType: { type: String },
});

const operationDeptSchema = new mongoose.Schema(
  {
    parentFirstName: { type: String },
    parentLastName: { type: String },
    contactNumber: { type: String },
    whatsappNumber: { type: String },
    isSameAsContact: { type: Boolean },
    email: { type: String },
    relationship: { type: String },
    // otherRelationship: { type: String },

    source: { type: String },
    message: { type: String }, 
    notes: { type: String ,default:"Empty"},

    kidFirstName: { type: String },
    kidLastName: { type: String },
    kidId: { type: String },
    kidsGender: { type: String },
    kidsAge: { type: Number },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    programs: {
      type: [ProgramSchema],
    },

    schoolName: { type: String },
    address: { type: String },
    schoolPincode: { type: String },
    intentionOfParents: { type: String },

    enquiryType: { type: String, enum: ["warm", "cold"], default: "cold" },
    enquiryStage: { type: String ,},

    enquiryStatus: {
      type: String,
      // enum: [
      //   "Pending",
      //   "Qualified Lead",
      //   "Unqualified Lead",
      //   "Unattended",
      //   "Demo Interested",
      //   "Demo Assigned",
      //   "Demo Taken",
      //   "Payment Link Sent",
      //   "Enrolled",
      //   "Need Clarification",
      //   "Call Later",
      //   "Not Interested",
      //   "Not Answering",
      //   "Wrong Number",
      //   "Prospectus Sent"
      // ],
      default: "Pending",
    },

    disposition: {
      type: String,
      enum: ["RnR", "Call Back", "None", "Connected"],
      default: "None",
    },

    enquiryField: { type: String, default: "enquiryList" },
    scheduleDemo: {
      status: {
        type: String,
        enum: ["Pending", "Scheduled", "Conducted", "Cancelled", "Attended"],
        default: "Pending",
      },
      sheduledDay: { type: String },
    },

    referral: [
      {
        referredTo: { type: String },
        referredEmail: { type: String },
      },
    ],
    logs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Log",
    },
    isNewUser: { type: Boolean, default: true },
    paymentData: { type: String },

    // paymentLink: { type: String },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Requested", "Processing"],
      default: "Pending",
    },
    paymentRenewal: { type: String },
    classAssigned:{type:Boolean,default:false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("OperationDept", operationDeptSchema);
