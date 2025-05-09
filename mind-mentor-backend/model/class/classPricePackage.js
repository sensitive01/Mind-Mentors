const mongoose = require("mongoose");

const ClassAmountSchema = new mongoose.Schema({
  classPackageName: {
    type: String,
  },
  classes: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  program: {
    type: String,
  },
  level: {
    type: String,
  },
  time: {
    type: String,

    enum: ["Day", "Night"],
  },
  mode: {
    type: String,
    enum: ["Online", "Offline"],
  },
});

const CenterPriceSchema = new mongoose.Schema({
  centerId: {
    type: String,
  },
  centerName: {
    type: String,
  },
  prices: [ClassAmountSchema],
});

const ClassPricingSchema = new mongoose.Schema({
  onlineClassPrices: [ClassAmountSchema],
  hybridClassPrices: [ClassAmountSchema],
  physicalClassPrices: [ClassAmountSchema],
  kitPrice: {
    type: Number,
  },
  centerPrices: [CenterPriceSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ClassPricing = mongoose.model("ClassPricing", ClassPricingSchema);

module.exports = ClassPricing;
