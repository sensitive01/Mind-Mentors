const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema(
  {
    openTime: String,
    closeTime: String,
  },
  { _id: false }
);

const businessHourSchema = new mongoose.Schema(
  {
    day: String,
    periods: [periodSchema],
    is24Hours: Boolean,
    isClosed: Boolean,
  },
  { _id: false }
);

const programLevelSchema = new mongoose.Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
    levels: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);


const physicalCenterSchema = new mongoose.Schema({
  centerType: {
    type: String, // e.g., "offline" or "online"
    required: true,
  },
  centerName: {
    type: String,
    required: true,
  },
  centerId: {
    type: String,
  },
  address: {
    type: String,
  },
  pincode: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  photos: {
    type: [String],
    default: [],
  },
  businessHours: {
    type: [businessHourSchema],
    default: [],
  },
  programLevels: {
    type: [programLevelSchema],
    default: [],
  },
  role: {
    type: String,
    default: "center-admin",
  },
});

const PhysicalCenter = mongoose.model("PhysicalCenter", physicalCenterSchema);
module.exports = PhysicalCenter;
