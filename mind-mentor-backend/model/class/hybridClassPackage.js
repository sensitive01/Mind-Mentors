const mongoose = require("mongoose");

const hybridClassSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      default: "Hybrid",
    },
    centers: [
      {
        centerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PhysicalCenter",
          required: true,
        },
        centerName: {
          type: String,
          required: true,
        },
        packageName: {
          type: String,
        },
        programName: {
          type: String,
          required: true,
        },
        programLevel: {
          type: String,
          required: true,
        },
        upToClasses: {
          type: Number,
          required: true,
        },
        classNumFrom: {
          type: Number,
        },
        amount: {
          type: Number,
          required: true,
        },
        time: {
          type: String,
          enum: ["Day", "Night"],
          required: true,
        },
        status: {
          type: String,
          default: "Active",
        },
        mode: {
          type: String,
          required: true,
        },
        oneClassPrice: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("HybridClassPackage", hybridClassSchema);
