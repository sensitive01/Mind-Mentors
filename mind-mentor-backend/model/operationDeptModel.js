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
    kidRollNo: { type: String },
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

    schoolName: { type: String },
    address: { type: String },
    schoolPincode: { type: String },
    intentionOfParents: { type: String },

    enquiryType: { type: String, enum: ["warm", "cold"], default: "warm" },
    enquiryStage: { type: String },
    recomentedLevel: { type: String },
    chessKidName: { type: String },

    stageTag: { type: String },

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
    dateOfJoining: { type: Date },

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
    oldLogs: { type: String },

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
    employeeAssisted: { type: String },
    perHourRate: { type: Number },
    employmentType: { type: String },

    chessKidGoldEnabledDateAndTime: { type: String },
    chessKidGoldExperationDateAndTime: { type: String },
    chessKidGoldDeactivationDateAndTime: { type: String },
    reasonForDeactivation: { type: String },
    lastInteractionDateandTime: { type: String },



    classAssigned: { type: Boolean, default: false },
    isNewUser: { type: Boolean, default: true },
    isParentNameCompleted: { type: Boolean, default: false },
    isLevelPromoteRecomented: { type: Boolean, default: false },
    ischessKidIdAssigned: { type: Boolean, default: false },
    isFirstKidAdded: { type: Boolean, default: false },
    isProgramSelected: { type: Boolean, default: false },
    isDemoSheduled: { type: Boolean, default: false },
    isDemoAttended: { type: Boolean, default: false },
    isPackageSelected: { type: Boolean, default: false },
    isClassAssigned: { type: Boolean, default: false },
    isEnrollmementStepCompleted: { type: Boolean, default: false },
    isProfileActive: { type: Boolean, default: false },
    isEnquiryNew: { type: Boolean, default: true },
    isProfilePaused: { type: Boolean, default: false },
    isChessKidGoldTaken: { type: Boolean, default: false },


    totalRenewalCount: { type: Number }


  },
  { timestamps: true }
);

// Indexes for performance optimization
operationDeptSchema.index({ enquiryField: 1, createdAt: -1 });
operationDeptSchema.index({ enquiryField: 1, paymentStatus: 1, createdAt: -1 });
operationDeptSchema.index({ enquiryField: 1, enquiryStatus: 1, createdAt: -1 });

module.exports = mongoose.model("OperationDept", operationDeptSchema);
