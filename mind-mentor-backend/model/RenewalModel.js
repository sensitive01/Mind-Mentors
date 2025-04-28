const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentId: String,
  status: String,
  amount: Number,
  discount: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  proof: String,
});

const renewalSchema = new mongoose.Schema({
  enqId: {
    type: String,
  },
  paymentData: [paymentSchema],
});

module.exports = mongoose.model("Renewal", renewalSchema);
