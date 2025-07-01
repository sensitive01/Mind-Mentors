import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    referrerId:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("referralModel", referralSchema);
