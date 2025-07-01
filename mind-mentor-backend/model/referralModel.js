const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    referrerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("referralModel", referralSchema);
