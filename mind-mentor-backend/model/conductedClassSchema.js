const mongoose = require("mongoose");

const conductedClassSchema = new mongoose.Schema({
  classID: {
    type: String,
  },
  students: [
    {
      studentID: {
        type: String,
      },
      name: {
        type: String,
      },
      attendance: {
        type: String,
        enum: ["Present", "Absent"],
        default:"Absent"
      },
      feedback: {
        type: String,
        default: "",
      },
    },
  ],
  conductedDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Conducted", "Canceled"],
    default: "Conducted",
  },
});

const ConductedClass = mongoose.model("ConductedClass", conductedClassSchema);

module.exports = ConductedClass;