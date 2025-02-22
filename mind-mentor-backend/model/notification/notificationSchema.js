const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  kidId: {
    type: String,
  },
  kidName: {
    type: String,
  },
  chessKidId: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  notifiedDate: {
    type: Date,
  },
  isNoticed: {
    type: Boolean,
    default: false,
  },
  assignedTo: {
    type: String,
  },
});

const alert = mongoose.model("alert", alertSchema);
module.exports = alert;
