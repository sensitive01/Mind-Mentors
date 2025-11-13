const mongoose = require("mongoose");

const kidClassScheduleLinkSchema = new mongoose.Schema(
  {
    Class_Schedule_Record_Link_ID_BASE: {
      type: String,
      required: true,
      index: true,
    },
    Kids_Record_Link_ID_REF: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "KidClassScheduleLink",
  kidClassScheduleLinkSchema
);
