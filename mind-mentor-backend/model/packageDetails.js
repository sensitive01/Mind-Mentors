// Assuming you're using Mongoose
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  packageId: {
    type: String,
  },
  type: {
    type: String,

    enum: ["online", "offline", "hybrid"],
  },
  packageName: {
    type: String,
  },
  description: {
    type: String,
  },
  onlineClasses: {
    type: Number,
    default: 0,
  },
  physicalClasses: {
    type: Number,
    default: 0,
  },
  centerName: {
    type: String,
  },
  pricing: {
    amount: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    total: {
      type: Number,
    },
  },
  centerId :{type:String},
  centerName :{type:String}

});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;


// Online - offline-Hybrid

//online - time ---mng,night
//how many class 8,16, custom internal teams
//day -->8=3068/-  1=383.5/-  16=5428/- 1=339.25/-

//night --> offline ---> 8=3835/- 1=479.375/-  16=7060/- 1=442.5/-    

//4day 4 night


//kit ---->750/-
