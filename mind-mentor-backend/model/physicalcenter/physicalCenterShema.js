const mongoose = require("mongoose");

const physicalCenterSchema = new mongoose.Schema({
  centerName: {
    type: String,
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
  role:{type:String,default:"center-admin"}
});

const PhysicalCenter = mongoose.model("PhysicalCenter", physicalCenterSchema);
module.exports = PhysicalCenter;
