const mongoose = require("mongoose");

// Define the schema for coach availability
const coachAvailabilitySchema = new mongoose.Schema({
  coachId: {
    type: String,

    required: true,
  },
  coachName: {
    type: String,
  },
  availabilities: [
    {
      program: {
        type: String,
      },
      levels: {
        type: [String],
      },
      days: {
        type: [String],
      },
      times: {
        type: [String],
      },
    },
  ],
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
