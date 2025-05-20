const mongoose = require("mongoose");

const CenterInfoSchema = new mongoose.Schema({
  centerId: {
    type: String,
  },
  centerName: {
    type: String,
  },
  packageName: {
    type: String, 
  },
  programName: {
    type: String,
  },
  programLevel: {
    type: String,
  },
  classes: {
    type: Number, 
  },
  amount: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active", 
  },
  time: {
    type: String,
    enum: ["Day", "Night"], 
  },
});



const OfflineClassSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      default: "Offline",
    },
    centers: [CenterInfoSchema], 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OfflineClass", OfflineClassSchema);
