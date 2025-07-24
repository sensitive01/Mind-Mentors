const mongoose = require("mongoose");

const demoBookingSchema = new mongoose.Schema(
  {
    classId: {
      type: String,
    },
    program: {
      type: String,
    },
    level: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    coachName: {
      type: String,
    },
    type: {
      type: String,
      enum: ["online", "offline"],
    },
    centerName: {
      type: String,
    },
    centerId: {
      type: String,
    },
    parentId: {
      type: String,
    },
    kidId: {
      type: String,
    },
    status: { type: String, default: "Sheduled" },
  },
  { timestamps: true }
);

const DemoClass = mongoose.model("DemoClass", demoBookingSchema);

module.exports = DemoClass;
