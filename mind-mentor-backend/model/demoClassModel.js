const mongoose = require("mongoose");

const demoClassSchema = new mongoose.Schema(
  {
    programs: [
      {
        program: {
          type: String,
        
        },
        programLevel: {
          type: String,
         
        }
      }
    ],
    date: {
      type: Date,
    
    },
    time: {
      type: String,
     
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
   
    },
    kidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kid",
      required: true,
    },
  },
  { timestamps: true } 
);


const DemoClass = mongoose.model("DemoClass", demoClassSchema)

module.exports = DemoClass;
