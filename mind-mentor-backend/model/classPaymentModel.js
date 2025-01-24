const mongoose = require("mongoose");

const classPaymentModel = new mongoose.Schema({
  amount: {
    type: Number,
  },
  classDetails: {
    coachName: {
      type: String,
    },
    day: {
      type: String,
    },
    isGoldMember: {
      type: Boolean,
      default: false,
    },
    classType: {
      type: String,
    },
    numberOfClasses: {
      type: Number,
    },
  },
  enqId: {
    type: String,
  },
  kidId: {
    type: String,
  },
  kidName: {
    type: String,
  },
  kitItem: {
    type: String,
    default: null,
  },
  selectionType: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  whatsappNumber: {
    type: String,
  },
  parentId: { type: String },
  raz_transaction_id: { type: String },
  paymentMode: { type: String },
  status: { type: String, default: "Success" },
});

module.exports = mongoose.model("paidFees", classPaymentModel);
