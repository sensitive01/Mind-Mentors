const mongoose = require("mongoose");

const kidSchema = new mongoose.Schema(
  {
    chessId: {
      type: String,
      unique: true,
    },
    kidPin: {
      type: Number,
    },

    kidsName: {
      type: String,

      trim: true,
    },

    age: {
      type: Number,
    },
    gender: {
      type: String,
    },


    intention: {
      type: String,

      trim: true,
    },
    schoolName: {
      type: String,

      trim: true,
    },
    address: {
      type: String,

      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kid", kidSchema);
