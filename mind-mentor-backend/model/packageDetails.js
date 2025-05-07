const mongoose = require("mongoose");

const classDetailSchema = new mongoose.Schema({
  count: { type: Number,}, // number of classes
  amount: { type: Number,}, // total amount
  perClassAmount: { type: Number }, // optional: price per class
});

const modeDetailSchema = new mongoose.Schema({
  day: classDetailSchema,
  night: classDetailSchema,
});

const pricingSchema = new mongoose.Schema({
  online: modeDetailSchema,
  offline: modeDetailSchema,
  hybrid: {
    online: modeDetailSchema,
    offline: modeDetailSchema,
  },
  kit: {
    quantity: { type: Number },
    price: { type: Number },
  },
  tax: { type: Number, default: 0 },
  total: { type: Number }, // overall package total if needed
});

const packageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["online", "offline", "hybrid", "kit"],
  
  },
  packageName: { type: String,},
  description: { type: String },
  centerId: { type: String },
  centerName: { type: String },
  pricing: pricingSchema,
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
