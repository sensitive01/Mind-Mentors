const mongoose = require("mongoose");

const relEnrollmentCentreSchema = new mongoose.Schema({
  kidId: { type: String, required: true }, // Kids#RECORD_LINK_ID#BASE
  centreId: { type: String, required: true }, // Centres#RECORD_LINK_ID#REF
});

module.exports = mongoose.model(
  "RelEnrollmentCentreKidsKims",
  relEnrollmentCentreSchema
);
