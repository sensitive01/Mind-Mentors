const mongoose = require("mongoose");

const relKidCentreSchema = new mongoose.Schema({
  KidID: { type: String, required: true },     // Kid ID
  CentreID: { type: String, required: true },  // Allotted Centre ID
});



module.exports = mongoose.model("RelKidCentrekims", relKidCentreSchema);
