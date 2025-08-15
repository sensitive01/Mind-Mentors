const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  program: { type: String },
  level: { type: String },
  status: { type: String, default: "Enquiry Kid" },
  demoAttended: { type: Boolean, default: false },
  enrolledDate: { type: Date },
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

    source: { type: String, default: "MindMentorz Online" },
    message: { type: String },
    notes: { type: String, default: "Empty" },

    kidFirstName: { type: String },
    kidLastName: { type: String },
    kidId: { type: String },
    kidsGender: { type: String },
    kidsAge: { type: Number },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },

    programs: { type: [ProgramSchema] },

    // ---- CLASS COUNTS AT TOP LEVEL ----
    totalClassCount: {
      online: { type: Number, default: 0 },
      offline: { type: Number, default: 0 },
      both: { type: Number, default: 0 },
    },
    attendedClass: {
      online: { type: Number, default: 0 },
      offline: { type: Number, default: 0 },
      both: { type: Number, default: 0 },
    },
    remainingClass: {
      online: { type: Number, default: 0 },
      offline: { type: Number, default: 0 },
      both: { type: Number, default: 0 },
    },
    absentClass: {
      online: { type: Number, default: 0 },
      offline: { type: Number, default: 0 },
      both: { type: Number, default: 0 },
    },
    pausedClass: {
      online: { type: Number, default: 0 },
      offline: { type: Number, default: 0 },
      both: { type: Number, default: 0 },
    },
    canceledClass: {
      online: { type: Number, default: 0 },
      offline: { type: Number, default: 0 },
      both: { type: Number, default: 0 },
    },
    // -----------------------------------

    isEnquiryNew: { type: Boolean, default: true },
    schoolName: { type: String },
    address: { type: String },
    schoolPincode: { type: String },
    intentionOfParents: { type: String },

    enquiryType: { type: String, enum: ["warm", "cold"], default: "warm" },
    enquiryStage: { type: String },
    recomentedLevel: { type: String },
    isLevelPromoteRecomented: { type: Boolean, default: false },
    ischessKidIdAssigned: { type: Boolean, default: false },
    chessKidName: { type: String },

    enquiryStatus: {
      type: String,
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

    paymentData: [
      {
        type: String,
      },
    ],

    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Requested", "Processing"],
      default: "Pending",
    },
    paymentRenewal: { type: String },
    classAssigned: { type: Boolean, default: false },
    employeeAssisted: { type: String },
    perHourRate: { type: Number },
    employmentType: { type: String },
    
    isParentNameCompleted: { type: Boolean, default: false },
    isFirstKidAdded:{type:Boolean,default:false},
    isProgramSelected:{type:Boolean,default:false},
    isDemoSheduled:{type:Boolean,default:false},
    isDemoAttended:{type:Boolean,default:false},
    isPackageSelected:{type:Boolean,default:false},
    isClassAssigned:{type:Boolean,default:false},
    isEnrollmementStepCompleted:{type:Boolean,default:false}


  },
  { timestamps: true }
);

module.exports = mongoose.model("OperationDept", operationDeptSchema);
