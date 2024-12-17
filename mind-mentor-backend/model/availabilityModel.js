const mongoose = require("mongoose");


const coachAvailabilitySchema = new mongoose.Schema({
  coachId: {
    type: String,

  },
  coachName: {
    type: String,
  },
  program: {
    type: String,
  },

  day: {
    type: String, 
  },
  fromTime: {
    type: String, 
  },
  toTime: {
    type: String, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CoachAvailability = mongoose.model(
  "CoachAvailability",
  coachAvailabilitySchema
);

module.exports = CoachAvailability;
