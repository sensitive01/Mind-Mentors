const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: {
      type: String,

      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    profilePicture: { type: String }, 
    bio: { type: String }, 
    skills: { type: [String] },
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        graduationYear: { type: String },
      },
    ],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User ", userSchema);
