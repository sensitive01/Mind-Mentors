const mongoose = require("mongoose");

const programDataSchema = new mongoose.Schema(
  {
    ID: { type: String, required: true, unique: true },
    SEQUENCE_NUMBER: { type: Number, required: true },
    CHOICE: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgramDataKims", programDataSchema);
