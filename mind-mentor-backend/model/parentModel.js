const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema(
  {
    parentName: {
      type: String,
      trim: true,
    },
    parentEmail: {
      type: String,
      lowercase: true,
      // unique: true,
      trim: true,
    },
    parentMobile: {
      type: String,
      // unique: true,
      trim: true,
    },
    parentPin: {
      type: Number,
    },
    kids: [
      {
        kidId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    role: {
      type: String,
      default: "parent",
    },
    status: {
      type: String,
      default: "Pending",
    },
    type: {
      type: String,
      default: "new",
    },
    isParentNew: { type: Boolean, default: true },
    payment: [
      {
        enqId: { type: String },
        paymentId: { type: String },
        patmentStatus: { type: String, default: "Pending" },
      },
    ],
    paymentLink: { type: String },
  },
  {
    timestamps: true,
  }
);

const Parent = mongoose.model("Parent", parentSchema);

module.exports = Parent;
