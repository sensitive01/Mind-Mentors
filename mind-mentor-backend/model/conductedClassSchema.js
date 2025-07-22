const mongoose = require("mongoose");

const conductedClassSchema = new mongoose.Schema({
  classId: { type: String},
  coachId: { type: String},
  classStartTime: { type: Date },
  students: [
    {
      classType: { type: String },
      studentId: { type: String },
      name: { type: String },
      joinTime: { type: Date },
      attendance: {
        type: String,
        enum: ["Present", "Absent"],
        default: "Absent",
      },
      feedback: { type: String, default: "" },
    },
  ],
  conductedDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Conducted", "Canceled"],
    default: "Conducted",
  },
  kidCount: { type: Number, default: 0 },
  attendedKidCount: { type: Number, default: 0 },
  coachAmount: { type: Number, default: 0 },
  coachPaidDate: { type: Date },
  auditScore: { type: Number, min: 0, max: 10 },
  feedbackScore: { type: Number, min: 0, max: 10 },
  averageRating: { type: Number, min: 0, max: 5 },
  coachClassFeedBack:{type:String}
});


const ConductedClass = mongoose.model("ConductedClass", conductedClassSchema);

module.exports = ConductedClass;

// class start time,attannce , individual join time,kid count, attended kid count,coach amount,coach paid date,audit score , feedback score, average rating,
