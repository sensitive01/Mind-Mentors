const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    enqId: {
      type: String,
    },
    kidName: {
      type: String,
    },
    kidId: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    programs: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    classMode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    baseAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    packageId: {
      type: String,
      required: true,
    },
    selectedPackage: {
      type: String,
      required: true,
    },
    onlineClasses: {
      type: Number,
      default: 0,
    },
    offlineClasses: {
      type: Number,
      default: 0,
    },
    centerId: {
      type: String,

      default: null,
    },

    paymentId: { type: String },
    paymentStatus: { type: String, default: "Pending" },
    transactionId: { type: String },
    paymentMode: { type: String },
    remarks: { type: String },
    documentUrl: { type: String },
  },
  { timestamps: true }
);

const Package = mongoose.model("packagePaymentData", packageSchema);
module.exports = Package;
