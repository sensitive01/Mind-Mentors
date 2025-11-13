const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({
  Active_Profile: { type: Boolean, default: false },
  Added_Time: { type: Number }, // epoch time
  Added_User: { type: String },
  Amount_per_Session: { type: Number, default: 0 },
  Coach: { type: Boolean, default: false },
  Email: { type: String },
  ID: { type: String },
  Modified_Time: { type: Number },
  Modified_User: { type: String },
  Name: {
    prefix: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    suffix: { type: String }
  },
  Phone_Number: { type: String },
  Record_Status: { type: Number, default: 0 },
  Trained_on_SKUARE: { type: Boolean, default: false },
});

module.exports = mongoose.model("CoachDataKims", coachSchema);
