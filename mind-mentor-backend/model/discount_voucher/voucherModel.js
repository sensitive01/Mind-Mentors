const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    voucherId: { type: String },
    code: { type: String },
    mmKidId: { type: String },
    remarks: { type: String },
    type: { type: String, enum: ["amount", "class"] },
    value: { type: Number },
    condition: { type: String, enum: ["new user", "existing user"] },
    slots: { type: Number },
    startDate: { type: Date },
    expiry: { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
    voucherUsed: [
      {
        enqId: { type: String },
        isUsed: { type: Boolean },
        usedDate: { type: Date, default: Date.now },
      },
    ],
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;
