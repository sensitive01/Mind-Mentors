const mongoose = require("mongoose");

const selectedClassSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  studentName: {
    type: String,
  },
  selectedClasses: [
    {
      id: { type: Number },
      day: { type: String },
      startTime: { type: String },
      endTime: { type: String, default: "" },
      coach: { type: String },
      type: { type: String, enum: ["online", "offline", "hybrid"] },
    },
  ],
});

module.exports = mongoose.model("SelectedClass", selectedClassSchema);
