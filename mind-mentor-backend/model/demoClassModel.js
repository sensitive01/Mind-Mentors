const mongoose = require("mongoose");

const demoClassSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    programs: [
      {
        program: {
          type: String,
        },
        programLevel: {
          type: String,
        },
      },
    ],
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
    },
    kidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kid",
 
    },
    coachName: {
      type: String,
    
    },
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",

    },
    scheduledByName: {
      type: String, 
    
    },
    scheduledById: {
      type: String
    
     
    },
  },
  { timestamps: true }
);

const DemoClass = mongoose.model("DemoClass", demoClassSchema);

module.exports = DemoClass;
