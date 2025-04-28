const mongoose = require("mongoose");

const conductedClassSchema = new mongoose.Schema({
  classID: {
    type: String,
  },
  coachId: {
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


// class start time,attannce , individual join time,kid count, attended kid count,coach amount,coach paid date,audit score , feedback score, average rating, 