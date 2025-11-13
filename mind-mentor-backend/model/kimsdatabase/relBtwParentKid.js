const mongoose = require("mongoose");

const parentKidSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "ParentDataKims" },
    kidId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentDataKIMS" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParentKidLink", parentKidSchema);
