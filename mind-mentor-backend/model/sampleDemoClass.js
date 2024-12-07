const mongoose = require("mongoose");

const sampleDemoClass = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  fromTime: {
    type: String,
    required: true,
  },
  toTime: {
    type: String,
    required: true,
  },
  coachName: {
    type: String,
    required: true,
  },
  coachId: {
    type: String,
    required: true,
  },

  kidName: {
    type: String,
    required: true,
  },
  kidId: {
    type: String,
    required: true,
  },

  course: {
    type: String,
    required: true,
  },
});

const DemoClassSchema = mongoose.model("DemoClass", sampleDemoClass);

module.exports = DemoClassSchema;
