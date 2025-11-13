const mongoose = require("mongoose");

const relKidProgramSchema = new mongoose.Schema({
  KidID: { type: String, required: true },     // Kid ID
  ProgramID: { type: String, required: true }, // Program ID
});

module.exports = mongoose.model("RelKidProgramKims", relKidProgramSchema);
