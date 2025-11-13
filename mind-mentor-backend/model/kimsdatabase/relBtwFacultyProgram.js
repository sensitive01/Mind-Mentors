const mongoose = require("mongoose");

const relFacultyProgramSchema = new mongoose.Schema({
  FacultyID: { type: String, required: true },   // Faculty ID
  ProgramID: { type: String, required: true },   // Program ID
});


module.exports = mongoose.model("RelFacultyProgramkims", relFacultyProgramSchema);
