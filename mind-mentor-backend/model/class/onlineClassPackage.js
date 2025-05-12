const mongoose = require("mongoose");

const CenterInfoSchema = new mongoose.Schema({
  centerId: {
    type: String,
  },
  centerName: {
    type: String,
  },
});

const OnlineClassSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
    },
    classes: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    programName: {
      type: String,
    },
    programLevel: {
      type: String,
    },
    mode: {
      type: String,
      default: "Online",
    },
    time: {
      type: String,
      enum: ["Day", "Night"],
    },
    centers: [CenterInfoSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OnlineClass", OnlineClassSchema);
