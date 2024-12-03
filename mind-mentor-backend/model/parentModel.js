const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema(
  {
    parentName: {
      type: String,
      trim: true,
    },
    parentEmail: {
      type: String,   
      lowercase: true,
      // unique: true,
      trim: true,
    },
    parentMobile: {
      type: Number,
      // unique: true,
      trim: true,
    },
    parentPin: {
      type: Number,
    },
    kids: [{
      kidId: {
        type: mongoose.Schema.Types.ObjectId, 
      }
    }],
    role: {
      type: String,
      default: "parent",
    },
    status: {
      type: String,
      default: "Active"
    },
    type:{
        type:String,
        default:"new"

    }
  },
  {
    timestamps: true,
  }
);

const Parent = mongoose.model("Parent", parentSchema);

module.exports = Parent;
