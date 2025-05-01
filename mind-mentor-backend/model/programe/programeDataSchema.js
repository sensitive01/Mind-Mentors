const mongoose = require('mongoose');

const programDataSchema = new mongoose.Schema({
  programName: {
    type: String,
    required: true,
  },
  programLevel: {
    type: [String],
    required: true,
    validate: [val => val.length > 0, '{PATH} must have at least one level'],
  },
  physicalCenter: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PhysicalCenter',
    }
  ],
});




const ProgramData = mongoose.model("ProgramData", programDataSchema);
module.exports = ProgramData;
