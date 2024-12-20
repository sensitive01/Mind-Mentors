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
    selectedProgram: {
      program: { type: String },
      level: { type: String },
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
    enqId: {
      type: String,
    },
    status:{
      type:"String",
      default:"Enrolled" 
    },
    role:{
      type:String,
      default:"Kid"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kid", kidSchema);
