const mongoose = require("mongoose");
const { Schema } = mongoose;

const kidAvailabilitySchema = new Schema({
  kidId: {
    type: String,
  },

  day: {
    type: String,
  },
  availableFrom: {
    type: String,
  },
  availableTo: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

const kidAvailability = mongoose.model(
  "kidAvailability",
  kidAvailabilitySchema
);

module.exports = kidAvailability;
