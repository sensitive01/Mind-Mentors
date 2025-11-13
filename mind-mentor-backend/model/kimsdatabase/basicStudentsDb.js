// const mongoose = require("mongoose");

// const studentSchema = new mongoose.Schema(
//   {},
//   { strict: false }
// );

// module.exports = mongoose.model("StudentDataKIMS", studentSchema);

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    ID: { type: String, index: true }, // 🔑 force ID to String
  },
  { strict: false } // keep rest of fields flexible
);

module.exports = mongoose.model("StudentDataKIMS", studentSchema);
