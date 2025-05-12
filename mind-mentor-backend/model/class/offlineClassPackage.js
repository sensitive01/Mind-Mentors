const mongoose = require("mongoose");

const CenterInfoSchema = new mongoose.Schema({
  centerId: {
    type: String,
  },
  centerName: {
    type: String,
  },
  packageName: {
    type: String, // Package name for this center
  },
  programName: {
    type: String,
  },
  programLevel: {
    type: String,
  },
  classes: {
    type: Number, // Number of offline classes for this center
  },
  amount: {
    type: Number, // Amount for this center's offline package
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active", // Status of the center's offline package
  },
  time: {
    type: String,
    enum: ["Day", "Night"], // Time of the class at this center
  },
});

const OfflineClassSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      default: "Offline", // Mode of class is Offline
    },
    centers: [CenterInfoSchema], // Array of centers with all the details inside each center
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OfflineClass", OfflineClassSchema);
