const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    voucherId: { type: String }, // DEFAULT
    code: { type: String }, // FREE500
    mmKidId: [{ type: String }],
    value: { type: Number },
    remarks: { type: String },
    type: { type: String, }, 
    condition: { type: String,  },
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
