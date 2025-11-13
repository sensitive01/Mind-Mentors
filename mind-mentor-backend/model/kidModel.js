const mongoose = require("mongoose");

const kidSchema = new mongoose.Schema(
  {
    chessId: {
      type: String,
    
    },
    kidPin: {
      type: Number,
    },
    kidsName: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    selectedProgram: [
      {
        program: { type: String },
        level: { type: String },
        chessKidId:{type:String},
        pgmStatus:{type:String,default:"Pending"}
      },
    ],


    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
    },
    enqId: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    role: {
      type: String,
      default: "Kid",
    },

    // Newly added fields
    joinDateTime: { type: Date },
    welcomeTime: { type: Date },
    welcomedBy: { type: String },

    totalClassesAttended: { type: Number, default: 0 },
    lastClassAttendedDate: { type: Date },
    classesRemaining: { type: Number, default: 0 },
    expiryDate: { type: Date },

    classTransferProgram: { type: String },
    classTransferChild: { type: String },

    classesAttendedAfterLastRenewal: { type: Number, default: 0 },

    lastPaidAmount: { type: Number, default: 0 },
    totalPaidAmount: { type: Number, default: 0 },
    lastPaidDate: { type: Date },

    isProfilePaused: { type: Boolean, default: false },
    pausedDateTime: { type: Date },
    unpausedDateTime: { type: Date },

    isProfileActive: { type: Boolean, default: true },
    reactivatedDateTime: { type: Date },
    deactivatedDateTime: { type: Date },
    actionTakenBy: { type: String },

    enrollmentType: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
    },
    paymentCount: { type: Number, default: 0 },
    enrollmentCenter: { type: String }, // Where enrolled
    allotmentCenter: { type: String }, // Where classes happen
    physicalCenter: { type: String }, // Physical center

    isChessKidGoldActivated: { type: Boolean, default: false },
    chessKidGoldActivatedDateTime: { type: Date },
    chessKidGoldExpiryDateTime: { type: Date },

    reasonForDeactivation: {
      type: String,
      enum: [
        "Classes are Expensive",
        "Poor Centre Experience",
        "Poor Coach Experience",
        "Kid Lost Interest",
        "Went for Advanced Coaching",
        "Prefers Offline Classes",
        "Summer Camp Only",
        "Want Personal Coaching",
        "Paused, Shall Return",
        "No Reason Cited",
        "Parent is not Attending",
      ],
    },

    lastInteractedDateTime: { type: Date },
    lastInteractedWith: { type: String }, // Support person
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kid", kidSchema);
