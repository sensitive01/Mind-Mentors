const mongoose = require("mongoose");

// Define the note schema with timestamps for createdAt and updatedAt
const noteSchema = new mongoose.Schema(
  {
    enquiryStatus: {
      type: String,
      default: "Pending",
    },
    disposition: {
      type: String,
      default: "None",
    },
    note: {
      type: String,
    },
    updatedBy: { type: String },
    createdOn: { type: String },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const notesSectionSchema = new mongoose.Schema(
  {
    enqId: {
      type: String,
    },
    logId: {
      type: String,
    },
    notes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

const NotesSection = mongoose.model("NotesSection", notesSectionSchema);

module.exports = NotesSection;
