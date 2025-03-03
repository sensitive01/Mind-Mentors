// Assuming you're using Mongoose
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  packageId: {
    type: String,
  },
  type: {
    type: String,

    enum: ["online", "offline", "hybrid", "kit"],
  },
  packageName: {
    type: String,
  },
  description: {
    type: String,
  },
  onlineClasses: {
    type: Number,
    default: 0,
  },
  physicalClasses: {
    type: Number,
    default: 0,
  },
  centerName: {
    type: String,
  },
  pricing: {
    amount: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    total: {
      type: Number,
    },
  },
  centerId :{type:String},
  centerName :{type:String}

});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
